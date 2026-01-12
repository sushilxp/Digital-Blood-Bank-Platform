from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timedelta
from werkzeug.security import generate_password_hash, check_password_hash
import os
import jwt
from functools import wraps

app = Flask(__name__)
CORS(app)

# Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///blood_bank.db')
if app.config['SQLALCHEMY_DATABASE_URI'].startswith('postgres://'):
    app.config['SQLALCHEMY_DATABASE_URI'] = app.config['SQLALCHEMY_DATABASE_URI'].replace('postgres://', 'postgresql://', 1)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key-change-in-production')

db = SQLAlchemy(app)

# Database Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    user_type = db.Column(db.String(20), nullable=False)  # donor, hospital, admin
    phone = db.Column(db.String(20))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Donor(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    blood_group = db.Column(db.String(5), nullable=False)
    location = db.Column(db.String(200))
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    last_donation = db.Column(db.Date)
    eligible = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Hospital(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    name = db.Column(db.String(200), nullable=False)
    address = db.Column(db.String(500))
    license_number = db.Column(db.String(50))
    contact_person = db.Column(db.String(100))
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class BloodInventory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    hospital_id = db.Column(db.Integer, db.ForeignKey('hospital.id'), nullable=False)
    blood_group = db.Column(db.String(5), nullable=False)
    units = db.Column(db.Integer, default=0)
    expiry_days = db.Column(db.String(20))
    storage_type = db.Column(db.String(100))
    status = db.Column(db.String(20))  # good, medium, low, critical
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class BloodRequest(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    request_id = db.Column(db.String(20), unique=True, nullable=False)
    hospital_id = db.Column(db.Integer, db.ForeignKey('hospital.id'))
    patient_name = db.Column(db.String(100), nullable=False)
    blood_group = db.Column(db.String(5), nullable=False)
    units = db.Column(db.Integer, nullable=False)
    status = db.Column(db.String(20), default='pending')  # pending, approved, issued, rejected
    emergency = db.Column(db.Boolean, default=False)
    response_time = db.Column(db.String(20))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class EmergencyCase(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    case_type = db.Column(db.String(100), nullable=False)
    blood_group = db.Column(db.String(5), nullable=False)
    units = db.Column(db.Integer, nullable=False)
    response_time = db.Column(db.String(20))
    hospital_id = db.Column(db.Integer, db.ForeignKey('hospital.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class DailyCollection(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    hospital_id = db.Column(db.Integer, db.ForeignKey('hospital.id'))
    date = db.Column(db.Date, nullable=False)
    donors_registered = db.Column(db.Integer, default=0)
    accepted = db.Column(db.Integer, default=0)
    rejected = db.Column(db.Integer, default=0)
    rejection_reason = db.Column(db.String(200))

class Notification(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    message = db.Column(db.String(500), nullable=False)
    type = db.Column(db.String(20))  # urgent, info, success
    read = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

# JWT Authentication Decorator
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Token is missing'}), 401
        try:
            token = token.split(' ')[1]
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            current_user = User.query.get(data['user_id'])
        except:
            return jsonify({'message': 'Token is invalid'}), 401
        return f(current_user, *args, **kwargs)
    return decorated

# Authentication Routes
@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'Email already registered'}), 400
    
    hashed_password = generate_password_hash(data['password'])
    user = User(
        name=data['name'],
        email=data['email'],
        password=hashed_password,
        user_type=data['user_type'],
        phone=data.get('phone')
    )
    
    db.session.add(user)
    db.session.commit()
    
    # Create donor or hospital record
    if data['user_type'] == 'donor':
        donor = Donor(
            user_id=user.id,
            blood_group=data['blood_group'],
            location=data.get('location'),
            latitude=data.get('latitude'),
            longitude=data.get('longitude')
        )
        db.session.add(donor)
    elif data['user_type'] == 'hospital':
        hospital = Hospital(
            user_id=user.id,
            name=data['name'],
            address=data.get('address'),
            license_number=data.get('license_number'),
            contact_person=data.get('contact_person'),
            latitude=data.get('latitude'),
            longitude=data.get('longitude')
        )
        db.session.add(hospital)
    
    db.session.commit()
    
    return jsonify({'message': 'Registration successful'}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(email=data['email']).first()
    
    if not user or not check_password_hash(user.password, data['password']):
        return jsonify({'message': 'Invalid credentials'}), 401
    
    token = jwt.encode({
        'user_id': user.id,
        'user_type': user.user_type,
        'exp': datetime.utcnow() + timedelta(days=1)
    }, app.config['SECRET_KEY'], algorithm='HS256')
    
    return jsonify({
        'token': token,
        'user': {
            'id': user.id,
            'name': user.name,
            'email': user.email,
            'user_type': user.user_type
        }
    }), 200

# Blood Inventory Routes
@app.route('/api/inventory', methods=['GET'])
def get_inventory():
    hospital_id = request.args.get('hospital_id')
    query = BloodInventory.query
    
    if hospital_id:
        query = query.filter_by(hospital_id=hospital_id)
    
    inventory = query.all()
    return jsonify([{
        'id': item.id,
        'blood_group': item.blood_group,
        'units': item.units,
        'expiry_days': item.expiry_days,
        'storage_type': item.storage_type,
        'status': item.status,
        'updated_at': item.updated_at.isoformat()
    } for item in inventory]), 200

@app.route('/api/inventory', methods=['POST'])
@token_required
def add_inventory(current_user):
    data = request.json
    
    inventory = BloodInventory(
        hospital_id=data['hospital_id'],
        blood_group=data['blood_group'],
        units=data['units'],
        expiry_days=data.get('expiry_days'),
        storage_type=data.get('storage_type'),
        status=data.get('status', 'good')
    )
    
    db.session.add(inventory)
    db.session.commit()
    
    return jsonify({'message': 'Inventory added successfully'}), 201

@app.route('/api/inventory/<int:id>', methods=['PUT'])
@token_required
def update_inventory(current_user, id):
    data = request.json
    inventory = BloodInventory.query.get_or_404(id)
    
    inventory.units = data.get('units', inventory.units)
    inventory.expiry_days = data.get('expiry_days', inventory.expiry_days)
    inventory.storage_type = data.get('storage_type', inventory.storage_type)
    inventory.status = data.get('status', inventory.status)
    
    db.session.commit()
    
    return jsonify({'message': 'Inventory updated successfully'}), 200

# Blood Request Routes
@app.route('/api/requests', methods=['GET'])
def get_requests():
    status = request.args.get('status')
    query = BloodRequest.query
    
    if status:
        query = query.filter_by(status=status)
    
    requests = query.order_by(BloodRequest.created_at.desc()).all()
    return jsonify([{
        'id': req.id,
        'request_id': req.request_id,
        'patient_name': req.patient_name,
        'blood_group': req.blood_group,
        'units': req.units,
        'status': req.status,
        'emergency': req.emergency,
        'response_time': req.response_time,
        'created_at': req.created_at.isoformat()
    } for req in requests]), 200

@app.route('/api/requests', methods=['POST'])
@token_required
def create_request(current_user):
    data = request.json
    
    # Generate request ID
    last_request = BloodRequest.query.order_by(BloodRequest.id.desc()).first()
    request_id = f"R{1001 + (last_request.id if last_request else 0)}"
    
    blood_request = BloodRequest(
        request_id=request_id,
        hospital_id=data.get('hospital_id'),
        patient_name=data['patient_name'],
        blood_group=data['blood_group'],
        units=data['units'],
        emergency=data.get('emergency', False)
    )
    
    db.session.add(blood_request)
    db.session.commit()
    
    # Create notification for matching donors
    donors = Donor.query.filter_by(blood_group=data['blood_group'], eligible=True).all()
    for donor in donors:
        notification = Notification(
            user_id=donor.user_id,
            message=f"Urgent: {data['blood_group']} blood needed for {data['patient_name']}",
            type='urgent'
        )
        db.session.add(notification)
    
    db.session.commit()
    
    return jsonify({
        'message': 'Request created successfully',
        'request_id': request_id
    }), 201

@app.route('/api/requests/<int:id>', methods=['PUT'])
@token_required
def update_request(current_user, id):
    data = request.json
    blood_request = BloodRequest.query.get_or_404(id)
    
    blood_request.status = data.get('status', blood_request.status)
    blood_request.response_time = data.get('response_time', blood_request.response_time)
    
    db.session.commit()
    
    return jsonify({'message': 'Request updated successfully'}), 200

# Donor Routes
@app.route('/api/donors', methods=['GET'])
def get_donors():
    blood_group = request.args.get('blood_group')
    query = Donor.query
    
    if blood_group:
        query = query.filter_by(blood_group=blood_group)
    
    donors = query.filter_by(eligible=True).all()
    donor_list = []
    
    for donor in donors:
        user = User.query.get(donor.user_id)
        donor_list.append({
            'id': donor.id,
            'name': user.name,
            'email': user.email,
            'phone': user.phone,
            'blood_group': donor.blood_group,
            'location': donor.location,
            'last_donation': donor.last_donation.isoformat() if donor.last_donation else None,
            'eligible': donor.eligible
        })
    
    return jsonify(donor_list), 200

@app.route('/api/donors/<int:id>', methods=['PUT'])
@token_required
def update_donor(current_user, id):
    data = request.json
    donor = Donor.query.get_or_404(id)
    
    donor.last_donation = datetime.strptime(data['last_donation'], '%Y-%m-%d').date() if 'last_donation' in data else donor.last_donation
    donor.eligible = data.get('eligible', donor.eligible)
    donor.location = data.get('location', donor.location)
    
    db.session.commit()
    
    return jsonify({'message': 'Donor updated successfully'}), 200

# Hospital Routes
@app.route('/api/hospitals', methods=['GET'])
def get_hospitals():
    hospitals = Hospital.query.all()
    hospital_list = []
    
    for hospital in hospitals:
        user = User.query.get(hospital.user_id)
        hospital_list.append({
            'id': hospital.id,
            'name': hospital.name,
            'address': hospital.address,
            'license_number': hospital.license_number,
            'contact_person': hospital.contact_person,
            'phone': user.phone,
            'latitude': hospital.latitude,
            'longitude': hospital.longitude
        })
    
    return jsonify(hospital_list), 200

# Emergency Cases Routes
@app.route('/api/emergencies', methods=['GET'])
def get_emergencies():
    emergencies = EmergencyCase.query.order_by(EmergencyCase.created_at.desc()).limit(10).all()
    return jsonify([{
        'id': case.id,
        'case_type': case.case_type,
        'blood_group': case.blood_group,
        'units': case.units,
        'response_time': case.response_time,
        'created_at': case.created_at.isoformat()
    } for case in emergencies]), 200

@app.route('/api/emergencies', methods=['POST'])
@token_required
def create_emergency(current_user):
    data = request.json
    
    emergency = EmergencyCase(
        case_type=data['case_type'],
        blood_group=data['blood_group'],
        units=data['units'],
        response_time=data.get('response_time'),
        hospital_id=data.get('hospital_id')
    )
    
    db.session.add(emergency)
    db.session.commit()
    
    return jsonify({'message': 'Emergency case created'}), 201

# Daily Collections Routes
@app.route('/api/collections', methods=['GET'])
def get_collections():
    collections = DailyCollection.query.order_by(DailyCollection.date.desc()).limit(7).all()
    return jsonify([{
        'id': coll.id,
        'date': coll.date.isoformat(),
        'donors_registered': coll.donors_registered,
        'accepted': coll.accepted,
        'rejected': coll.rejected,
        'rejection_reason': coll.rejection_reason
    } for coll in collections]), 200

@app.route('/api/collections', methods=['POST'])
@token_required
def add_collection(current_user):
    data = request.json
    
    collection = DailyCollection(
        hospital_id=data.get('hospital_id'),
        date=datetime.strptime(data['date'], '%Y-%m-%d').date(),
        donors_registered=data['donors_registered'],
        accepted=data['accepted'],
        rejected=data['rejected'],
        rejection_reason=data.get('rejection_reason')
    )
    
    db.session.add(collection)
    db.session.commit()
    
    return jsonify({'message': 'Collection data added'}), 201

# Notifications Routes
@app.route('/api/notifications', methods=['GET'])
@token_required
def get_notifications(current_user):
    notifications = Notification.query.filter_by(user_id=current_user.id).order_by(Notification.created_at.desc()).limit(10).all()
    return jsonify([{
        'id': notif.id,
        'message': notif.message,
        'type': notif.type,
        'read': notif.read,
        'created_at': notif.created_at.isoformat()
    } for notif in notifications]), 200

@app.route('/api/notifications/<int:id>/read', methods=['PUT'])
@token_required
def mark_notification_read(current_user, id):
    notification = Notification.query.get_or_404(id)
    notification.read = True
    db.session.commit()
    
    return jsonify({'message': 'Notification marked as read'}), 200

# Dashboard Stats
@app.route('/api/stats', methods=['GET'])
def get_stats():
    total_units = db.session.query(db.func.sum(BloodInventory.units)).scalar() or 0
    total_donors = Donor.query.count()
    active_requests = BloodRequest.query.filter_by(status='pending').count()
    total_emergencies = EmergencyCase.query.count()
    
    return jsonify({
        'total_units': total_units,
        'total_donors': total_donors,
        'active_requests': active_requests,
        'total_emergencies': total_emergencies
    }), 200

# Initialize database
@app.route('/api/init-db', methods=['POST'])
def init_database():
    try:
        db.create_all()
        
        # Create admin user if not exists
        admin = User.query.filter_by(email='admin@bloodbank.com').first()
        if not admin:
            admin = User(
                name='Admin User',
                email='admin@bloodbank.com',
                password=generate_password_hash('admin123'),
                user_type='admin',
                phone='1234567890'
            )
            db.session.add(admin)
            db.session.commit()
        
        return jsonify({'message': 'Database initialized successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/')
def home():
    return jsonify({
        'message': 'Digital Blood Bank API',
        'version': '1.0.0',
        'endpoints': [
            '/api/register',
            '/api/login',
            '/api/inventory',
            '/api/requests',
            '/api/donors',
            '/api/hospitals',
            '/api/emergencies',
            '/api/collections',
            '/api/notifications',
            '/api/stats'
        ]
    }), 200

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)