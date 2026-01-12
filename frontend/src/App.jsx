/* eslint-disable no-unused-vars */

import React, { useState, useEffect } from 'react';
import { Heart, Droplet, MapPin, Bell, Users, Activity, Calendar, Search, Plus, X, Check, Clock, AlertCircle, Building2, User, Phone, Mail, Shield, TrendingUp, Package } from 'lucide-react';



const BloodBankApp = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userType, setUserType] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [bloodRequests, setBloodRequests] = useState([]);
  const [donors, setDonors] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [emergencyCases, setEmergencyCases] = useState([]);
  const [dailyCollections, setDailyCollections] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  // Initialize demo data
  useEffect(() => {
    initializeDemoData();
  }, []);

  const initializeDemoData = () => {
    // Blood Inventory
    setInventory([
      { id: 1, bloodGroup: 'A+', units: 32, expiry: '5-7 days', storage: 'PRBC, FFP, Platelets', status: 'good' },
      { id: 2, bloodGroup: 'B+', units: 28, expiry: '4-6 days', storage: 'PRBC, Platelets', status: 'good' },
      { id: 3, bloodGroup: 'O+', units: 40, expiry: '6-8 days', storage: 'PRBC, FFP', status: 'good' },
      { id: 4, bloodGroup: 'AB+', units: 12, expiry: '3-5 days', storage: 'PRBC', status: 'medium' },
      { id: 5, bloodGroup: 'A-', units: 8, expiry: '2-4 days', storage: 'PRBC', status: 'low' },
      { id: 6, bloodGroup: 'B-', units: 6, expiry: '3-4 days', storage: 'PRBC', status: 'low' },
      { id: 7, bloodGroup: 'O-', units: 5, expiry: '2-3 days', storage: 'Emergency stock', status: 'critical' },
      { id: 8, bloodGroup: 'AB-', units: 2, expiry: '2 days', storage: 'Rare', status: 'critical' }
    ]);

    // Hospitals
    setHospitals([
      { id: 1, name: 'Manipal Hospital Jaipur', address: 'Sector 5, Vidhyadhar Nagar, Jaipur', license: '37AAJCM0541L1ZB', contact: 'Ms. Sulagna', phone: '091166 56540', lat: 26.9124, lng: 75.7873 }
    ]);

    // Blood Requests
    setBloodRequests([
      { id: 'R1021', patientName: 'Riya Sharma', bloodGroup: 'B+', units: 2, status: 'approved', time: '35 min', emergency: false, date: '2024-12-05' },
      { id: 'R1022', patientName: 'Mohan Das', bloodGroup: 'O-', units: 1, status: 'pending', time: '-', emergency: true, date: '2024-12-06' },
      { id: 'R1023', patientName: 'Sita Devi', bloodGroup: 'A+', units: 3, status: 'issued', time: '50 min', emergency: false, date: '2024-12-07' }
    ]);

    // Emergency Cases
    setEmergencyCases([
      { id: 1, date: '5 DEC', caseType: 'Accident, trauma', bloodGroup: 'O+', units: 4, responseTime: '18 MIN' },
      { id: 2, date: '6 DEC', caseType: 'Maternity', bloodGroup: 'AB+', units: 2, responseTime: '22 MIN' },
      { id: 3, date: '7 DEC', caseType: 'Surgery', bloodGroup: 'A-', units: 1, responseTime: '28 MIN' }
    ]);

    // Daily Collections
    setDailyCollections([
      { date: '5 DEC 24', donors: 19, accepted: 14, rejected: 5, reason: 'Low HB, Low BP issue' },
      { date: '6 DEC 24', donors: 32, accepted: 26, rejected: 6, reason: 'Underweight' },
      { date: '7 DEC 24', donors: 25, accepted: 21, rejected: 4, reason: 'Recent illness' }
    ]);

    // Donors
    setDonors([
      { id: 1, name: 'Ayushi Sharma', bloodGroup: 'O+', phone: '9876543210', email: 'ayushi@email.com', lastDonation: '2024-10-15', eligible: true, location: 'Jaipur', distance: '2.5 km' },
      { id: 2, name: 'Nirmal Kumar', bloodGroup: 'A+', phone: '9876543211', email: 'nirmal@email.com', lastDonation: '2024-09-20', eligible: true, location: 'Jaipur', distance: '3.8 km' },
      { id: 3, name: 'Deepak Singh', bloodGroup: 'B+', phone: '9876543212', email: 'deepak@email.com', lastDonation: '2024-11-01', eligible: true, location: 'Jaipur', distance: '1.2 km' },
      { id: 4, name: 'Sambhav Gupta', bloodGroup: 'AB+', phone: '9876543213', email: 'sambhav@email.com', lastDonation: '2024-08-10', eligible: true, location: 'Jaipur', distance: '5.0 km' }
    ]);

    // Notifications
    setNotifications([
      { id: 1, type: 'urgent', message: 'Critical: O- blood needed for emergency', time: '5 min ago' },
      { id: 2, type: 'info', message: 'AB- stock running low (2 units)', time: '1 hour ago' },
      { id: 3, type: 'success', message: 'New donor registered: Ayushi Sharma', time: '3 hours ago' }
    ]);
  };

  const LoginModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Login</h2>
          <button onClick={() => setShowLogin(false)} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">User Type</label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
              <option>Donor</option>
              <option>Hospital</option>
              <option>Admin</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input type="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="your@email.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input type="password" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="••••••••" />
          </div>
          <button onClick={() => { setIsLoggedIn(true); setUserType('admin'); setShowLogin(false); setCurrentUser({ name: 'Admin User', type: 'admin' }); }} className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-lg font-semibold hover:from-red-600 hover:to-red-700 transition-all">
            Login
          </button>
          <p className="text-center text-sm text-gray-600">
            Don't have an account? <button onClick={() => { setShowLogin(false); setShowRegister(true); }} className="text-red-600 font-semibold hover:text-red-700">Register</button>
          </p>
        </div>
      </div>
    </div>
  );

  const RegisterModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Register</h2>
          <button onClick={() => setShowRegister(false)} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Register As</label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
              <option>Donor</option>
              <option>Hospital</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="John Doe" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Blood Group</label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
              <option>A+</option>
              <option>A-</option>
              <option>B+</option>
              <option>B-</option>
              <option>AB+</option>
              <option>AB-</option>
              <option>O+</option>
              <option>O-</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <input type="tel" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="+91 98765 43210" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input type="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="your@email.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="City, State" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input type="password" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="••••••••" />
          </div>
          <button onClick={() => { setShowRegister(false); alert('Registration successful! Please login.'); }} className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-lg font-semibold hover:from-red-600 hover:to-red-700 transition-all">
            Register
          </button>
        </div>
      </div>
    </div>
  );

  const Dashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm">Total Blood Units</p>
              <p className="text-3xl font-bold mt-2">{inventory.reduce((sum, item) => sum + item.units, 0)}</p>
            </div>
            <Droplet className="w-12 h-12 text-red-200" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Registered Donors</p>
              <p className="text-3xl font-bold mt-2">{donors.length}</p>
            </div>
            <Users className="w-12 h-12 text-blue-200" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Active Requests</p>
              <p className="text-3xl font-bold mt-2">{bloodRequests.filter(r => r.status === 'pending').length}</p>
            </div>
            <Activity className="w-12 h-12 text-green-200" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Emergency Cases</p>
              <p className="text-3xl font-bold mt-2">{emergencyCases.length}</p>
            </div>
            <AlertCircle className="w-12 h-12 text-purple-200" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <AlertCircle className="w-6 h-6 text-red-600" />
            Critical Stock Alerts
          </h3>
          <div className="space-y-3">
            {inventory.filter(item => item.status === 'critical' || item.status === 'low').map(item => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <Droplet className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{item.bloodGroup}</p>
                    <p className="text-sm text-gray-600">{item.units} units remaining</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${item.status === 'critical' ? 'bg-red-200 text-red-800' : 'bg-yellow-200 text-yellow-800'}`}>
                  {item.status.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Bell className="w-6 h-6 text-blue-600" />
            Recent Notifications
          </h3>
          <div className="space-y-3">
            {notifications.map(notif => (
              <div key={notif.id} className={`p-3 rounded-lg border ${notif.type === 'urgent' ? 'bg-red-50 border-red-200' : notif.type === 'success' ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'}`}>
                <p className="text-sm font-medium text-gray-800">{notif.message}</p>
                <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-green-600" />
          Daily Collection Report
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Donors</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Accepted</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Rejected</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Reason</th>
              </tr>
            </thead>
            <tbody>
              {dailyCollections.map((day, idx) => (
                <tr key={idx} className="border-t border-gray-200">
                  <td className="px-4 py-3 text-sm text-gray-800">{day.date}</td>
                  <td className="px-4 py-3 text-sm text-gray-800">{day.donors}</td>
                  <td className="px-4 py-3 text-sm text-green-600 font-semibold">{day.accepted}</td>
                  <td className="px-4 py-3 text-sm text-red-600 font-semibold">{day.rejected}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{day.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <AlertCircle className="w-6 h-6 text-red-600" />
          Emergency Cases Log
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Case Type</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Blood Group</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Units</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Response Time</th>
              </tr>
            </thead>
            <tbody>
              {emergencyCases.map((emergency) => (
                <tr key={emergency.id} className="border-t border-gray-200">
                  <td className="px-4 py-3 text-sm text-gray-800">{emergency.date}</td>
                  <td className="px-4 py-3 text-sm text-gray-800">{emergency.caseType}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-semibold">
                      {emergency.bloodGroup}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-800">{emergency.units}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-green-600">{emergency.responseTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const DonorManagement = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Donor Management</h2>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input type="text" placeholder="Search donors..." className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" />
          </div>
          <button className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-700 transition-colors">
            <Plus className="w-5 h-5" />
            Register Donor
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {donors.map(donor => (
          <div key={donor.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {donor.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">{donor.name}</h3>
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-semibold mt-1">
                    <Droplet className="w-3 h-3" />
                    {donor.bloodGroup}
                  </span>
                </div>
              </div>
              {donor.eligible && (
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                  Eligible
                </span>
              )}
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Phone className="w-4 h-4" />
                <span>{donor.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Mail className="w-4 h-4" />
                <span>{donor.email}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{donor.location} ({donor.distance})</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>Last Donation: {donor.lastDonation}</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2">
                <Bell className="w-4 h-4" />
                Request Donation
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Donor Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-800">{donors.length}</p>
            <p className="text-sm text-gray-600 mt-1">Total Donors</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">{donors.filter(d => d.eligible).length}</p>
            <p className="text-sm text-gray-600 mt-1">Eligible Now</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">8</p>
            <p className="text-sm text-gray-600 mt-1">Blood Groups</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">2.8 km</p>
            <p className="text-sm text-gray-600 mt-1">Avg Distance</p>
          </div>
        </div>
      </div>
    </div>
  );

  const HospitalManagement = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Hospital Management</h2>
        <button className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-700 transition-colors">
          <Plus className="w-5 h-5" />
          Add Hospital
        </button>
      </div>

      {hospitals.map(hospital => (
        <div key={hospital.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 text-white">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <Building2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">{hospital.name}</h3>
                <p className="text-red-100 mt-1">Blood Bank License: {hospital.license}</p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-800 text-lg">Contact Information</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="text-gray-800">{hospital.address}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Contact Person</p>
                      <p className="text-gray-800">{hospital.contact}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Phone Number</p>
                      <p className="text-gray-800">{hospital.phone}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-800 text-lg">Quick Actions</h4>
                <div className="grid grid-cols-2 gap-3">
                  <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700">
                    View Inventory
                  </button>
                  <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700">
                    View Requests
                  </button>
                  <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700">
                    Contact Hospital
                  </button>
                  <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700">
                    View Location
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <MapPin className="w-6 h-6 text-blue-600" />
          GPS Geolocation - Nearby Hospitals
        </h3>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <p className="text-gray-700 font-medium">GPS tracking enabled</p>
              <p className="text-sm text-gray-600 mt-2">Instantly locate nearest blood banks within specific radius</p>
              <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Find Nearest Hospitals
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50">
        {showLogin && <LoginModal />}
        {showRegister && <RegisterModal />}
        
        <nav className="bg-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                  <Heart className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">Digital Blood Bank</h1>
                  <p className="text-sm text-gray-600">Saving Lives, One Drop at a Time</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowLogin(true)} className="px-6 py-2 border-2 border-red-600 text-red-600 rounded-lg font-semibold hover:bg-red-50 transition-colors">
                  Login
                </button>
                <button onClick={() => setShowRegister(true)} className="px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-semibold hover:from-red-600 hover:to-red-700 transition-all">
                  Register
                </button>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-800 mb-4">Revolutionizing Blood Donation</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Connecting donors, patients, and hospitals instantly to save lives in emergencies</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Droplet className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Quick Connection</h3>
              <p className="text-gray-600">Instantly connect patients and hospitals with available donors in emergencies</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">GPS Tracking</h3>
              <p className="text-gray-600">Locate nearest blood banks and donors within specific radius using GPS</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Activity className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Real-time Updates</h3>
              <p className="text-gray-600">Live blood stock status and instant alerts for inventory management</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-2xl p-8 mb-16">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">The Challenge We Solve</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-red-50 rounded-lg">
                <AlertCircle className="w-8 h-8 text-red-600 mb-3" />
                <h4 className="font-bold text-gray-800 mb-2">Delay in Emergencies</h4>
                <p className="text-sm text-gray-600">Traditional systems take too long to find rare blood types manually</p>
              </div>
              <div className="p-6 bg-red-50 rounded-lg">
                <Clock className="w-8 h-8 text-red-600 mb-3" />
                <h4 className="font-bold text-gray-800 mb-2">Poor Communication</h4>
                <p className="text-sm text-gray-600">Lack of communication between donors and patients causes preventable deaths</p>
              </div>
              <div className="p-6 bg-red-50 rounded-lg">
                <Package className="w-8 h-8 text-red-600 mb-3" />
                <h4 className="font-bold text-gray-800 mb-2">Blood Wastage</h4>
                <p className="text-sm text-gray-600">Significant blood expires due to poor inventory tracking and management</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl shadow-2xl p-12 text-white text-center">
            <h3 className="text-3xl font-bold mb-4">Join Our Life-Saving Community</h3>
            <p className="text-xl mb-8 text-red-100">Register as a donor or hospital to start making a difference today</p>
            <button onClick={() => setShowRegister(true)} className="bg-white text-red-600 px-8 py-3 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors">
              Get Started Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Digital Blood Bank</h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Bell className="w-6 h-6 text-gray-600 cursor-pointer hover:text-red-600 transition-colors" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 rounded-full text-white text-xs flex items-center justify-center">
                  {notifications.length}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white font-bold">
                  A
                </div>
                <span className="text-sm font-medium text-gray-700">Admin User</span>
              </div>
              <button onClick={() => { setIsLoggedIn(false); setUserType(null); }} className="px-4 py-2 text-sm text-gray-600 hover:text-red-600 transition-colors">
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        <aside className="w-64 bg-white shadow-lg min-h-screen sticky top-16">
          <nav className="p-4 space-y-2">
            <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'dashboard' ? 'bg-red-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}>
              <Activity className="w-5 h-5" />
              <span className="font-medium">Dashboard</span>
            </button>
            <button onClick={() => setActiveTab('inventory')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'inventory' ? 'bg-red-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}>
              <Droplet className="w-5 h-5" />
              <span className="font-medium">Blood Inventory</span>
            </button>
            <button onClick={() => setActiveTab('requests')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'requests' ? 'bg-red-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}>
              <Heart className="w-5 h-5" />
              <span className="font-medium">Blood Requests</span>
            </button>
            <button onClick={() => setActiveTab('donors')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'donors' ? 'bg-red-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}>
              <Users className="w-5 h-5" />
              <span className="font-medium">Donors</span>
            </button>
            <button onClick={() => setActiveTab('hospitals')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'hospitals' ? 'bg-red-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}>
              <Building2 className="w-5 h-5" />
              <span className="font-medium">Hospitals</span>
            </button>
          </nav>
        </aside>

        <main className="flex-1 p-8">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'inventory' && <InventoryManagement />}
          {activeTab === 'requests' && <BloodRequests />}
          {activeTab === 'donors' && <DonorManagement />}
          {activeTab === 'hospitals' && <HospitalManagement />}
        </main>
      </div>
    </div>
  );
};

export default BloodBankApp;

  const InventoryManagement = (inventory) => {
 if (!Array.isArray(inventory)) {
    return <div className="text-center py-8"><p>Loading...</p></div>;
  }
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Blood Inventory Management</h2>
        <button className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-700 transition-colors">
          <Plus className="w-5 h-5" />
          Add Stock
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {inventory.map(item => (
          <div key={item.id} className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <Droplet className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">{item.bloodGroup}</h3>
                  <p className="text-sm text-gray-500">Blood Type</p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Available Units</span>
                <span className="text-lg font-bold text-gray-800">{item.units}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Expiry</span>
                <span className="text-sm text-gray-800">{item.expiry}</span>
              </div>
              <div className="mt-3">
                <p className="text-xs text-gray-500 mb-1">Storage Type</p>
                <p className="text-xs text-gray-700">{item.storage}</p>
              </div>
              <div className="mt-3">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  item.status === 'good' ? 'bg-green-100 text-green-800' :
                  item.status === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  item.status === 'low' ? 'bg-orange-100 text-orange-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {item.status.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Stock Update Process</h3>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Package className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-xs mt-2 text-gray-600">Blood Stock Update</p>
              </div>
              <div className="flex-1 h-1 bg-blue-200"></div>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-xs mt-2 text-gray-600">Recipient Need</p>
              </div>
              <div className="flex-1 h-1 bg-blue-200"></div>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Activity className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-xs mt-2 text-gray-600">Blood Request</p>
              </div>
              <div className="flex-1 h-1 bg-blue-200"></div>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-xs mt-2 text-gray-600">Admin Approval</p>
              </div>
              <div className="flex-1 h-1 bg-blue-200"></div>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Check className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-xs mt-2 text-gray-600">Blood Issued</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  };

  const BloodRequests = (bloodRequests) => {
if (!Array.isArray(bloodRequests)) {
    return <div className="text-center py-8"><p>Loading...</p></div>;
  }

    return (

    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Blood Requests</h2>
        <button className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-700 transition-colors">
          <Plus className="w-5 h-5" />
          New Request
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Request ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Patient Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Blood Group</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Units</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Time Taken</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bloodRequests.map((request) => (
                <tr key={request.id} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-800">{request.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">{request.patientName}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
                      <Droplet className="w-4 h-4" />
                      {request.bloodGroup}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">{request.units}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      request.status === 'approved' ? 'bg-green-100 text-green-800' :
                      request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {request.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">{request.time}</td>
                  <td className="px-6 py-4">
                    {request.status === 'pending' && (
                      <div className="flex gap-2">
                        <button className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700">
                          Approve
                        </button>
                        <button className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700">
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
  };

      
