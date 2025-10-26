import React, { useState, useEffect } from 'react';
import {
  ExclamationTriangleIcon,
  PhoneIcon,
  MapPinIcon,
  ClockIcon,
  UserGroupIcon,
  TruckIcon,
  HeartIcon,
  FireIcon,
  CloudIcon,
  BoltIcon,
  SpeakerWaveIcon,
  CameraIcon,
  DocumentTextIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

interface Emergency {
  id: string;
  type: 'fire' | 'flood' | 'medical' | 'accident' | 'power' | 'security' | 'natural_disaster';
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'reported' | 'dispatched' | 'in_progress' | 'resolved';
  location: string;
  coordinates: { lat: number; lng: number };
  description: string;
  reportedBy: string;
  reportedAt: string;
  estimatedResponseTime: number;
  assignedTeam?: string;
  resources: string[];
}

interface EmergencyContact {
  id: string;
  name: string;
  role: string;
  phone: string;
  available: boolean;
  location: string;
}

interface Resource {
  id: string;
  type: 'ambulance' | 'fire_truck' | 'police' | 'rescue_team' | 'medical_team';
  name: string;
  status: 'available' | 'deployed' | 'maintenance';
  location: string;
  eta?: number;
}

const EmergencyResponseSystem: React.FC = () => {
  const [emergencies, setEmergencies] = useState<Emergency[]>([]);
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [selectedEmergency, setSelectedEmergency] = useState<Emergency | null>(null);
  const [showReportForm, setShowReportForm] = useState(false);

  useEffect(() => {
    // Mock data
    const mockEmergencies: Emergency[] = [
      {
        id: 'EMG001',
        type: 'medical',
        severity: 'high',
        status: 'dispatched',
        location: 'Village Center, House #45',
        coordinates: { lat: 18.5204, lng: 73.8567 },
        description: 'Elderly person experiencing chest pain',
        reportedBy: 'Priya Sharma',
        reportedAt: '2024-12-15T14:30:00Z',
        estimatedResponseTime: 8,
        assignedTeam: 'Medical Team Alpha',
        resources: ['Ambulance', 'Paramedic Team']
      },
      {
        id: 'EMG002',
        type: 'fire',
        severity: 'critical',
        status: 'in_progress',
        location: 'Agricultural Field, Sector B',
        coordinates: { lat: 18.5214, lng: 73.8577 },
        description: 'Crop fire spreading rapidly',
        reportedBy: 'Ramesh Kumar',
        reportedAt: '2024-12-15T13:45:00Z',
        estimatedResponseTime: 15,
        assignedTeam: 'Fire Brigade Unit 1',
        resources: ['Fire Truck', 'Water Tanker', 'Fire Team']
      }
    ];

    const mockContacts: EmergencyContact[] = [
      { id: '1', name: 'Dr. Rajesh Patel', role: 'Chief Medical Officer', phone: '+91-9876543210', available: true, location: 'Health Center' },
      { id: '2', name: 'Inspector Suresh Kumar', role: 'Police Station In-charge', phone: '+91-9876543211', available: true, location: 'Police Station' },
      { id: '3', name: 'Fire Officer Mahesh Singh', role: 'Fire Department Head', phone: '+91-9876543212', available: false, location: 'Fire Station' }
    ];

    const mockResources: Resource[] = [
      { id: 'R001', type: 'ambulance', name: 'Ambulance Unit 1', status: 'deployed', location: 'En route to Village Center', eta: 5 },
      { id: 'R002', type: 'fire_truck', name: 'Fire Engine Alpha', status: 'deployed', location: 'Agricultural Field B', eta: 10 },
      { id: 'R003', type: 'police', name: 'Patrol Unit 1', status: 'available', location: 'Police Station' }
    ];

    setEmergencies(mockEmergencies);
    setContacts(mockContacts);
    setResources(mockResources);
  }, []);

  const getEmergencyIcon = (type: string) => {
    switch (type) {
      case 'fire': return <FireIcon className="h-6 w-6" />;
      case 'medical': return <HeartIcon className="h-6 w-6" />;
      case 'flood': return <CloudIcon className="h-6 w-6" />;
      case 'power': return <BoltIcon className="h-6 w-6" />;
      default: return <ExclamationTriangleIcon className="h-6 w-6" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'text-green-600 bg-green-100';
      case 'in_progress': return 'text-blue-600 bg-blue-100';
      case 'dispatched': return 'text-purple-600 bg-purple-100';
      case 'reported': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-r from-red-500 to-orange-600 rounded-2xl">
              <ExclamationTriangleIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Emergency Response System</h1>
              <p className="text-gray-600">24/7 emergency monitoring and rapid response coordination</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowReportForm(true)}
              className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium"
            >
              🚨 Report Emergency
            </button>
          </div>
        </div>
      </div>

      {/* Emergency Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-red-100 rounded-lg">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
            </div>
            <span className="text-sm text-red-600 font-medium">Active</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{emergencies.filter(e => e.status !== 'resolved').length}</div>
          <div className="text-gray-600">Active Emergencies</div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <span className="text-sm text-green-600 font-medium">Available</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{resources.filter(r => r.status === 'available').length}</div>
          <div className="text-gray-600">Available Resources</div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <UserGroupIcon className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-sm text-blue-600 font-medium">On duty</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{contacts.filter(c => c.available).length}</div>
          <div className="text-gray-600">Available Personnel</div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <ClockIcon className="h-6 w-6 text-purple-600" />
            </div>
            <span className="text-sm text-purple-600 font-medium">Average</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">6 min</div>
          <div className="text-gray-600">Response Time</div>
        </div>
      </div>

      {/* Active Emergencies */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Active Emergencies</h2>
          <div className="space-y-4">
            {emergencies.filter(e => e.status !== 'resolved').map((emergency) => (
              <div key={emergency.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                   onClick={() => setSelectedEmergency(emergency)}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${emergency.type === 'fire' ? 'bg-red-100 text-red-600' : 
                                                     emergency.type === 'medical' ? 'bg-blue-100 text-blue-600' : 
                                                     'bg-orange-100 text-orange-600'}`}>
                      {getEmergencyIcon(emergency.type)}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 capitalize">{emergency.type} Emergency</div>
                      <div className="text-sm text-gray-600">{emergency.location}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(emergency.severity)}`}>
                      {emergency.severity}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(emergency.status)}`}>
                      {emergency.status}
                    </span>
                  </div>
                </div>
                
                <p className="text-gray-700 text-sm mb-3">{emergency.description}</p>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <span className="text-gray-600">ETA: {emergency.estimatedResponseTime} min</span>
                    <span className="text-gray-600">Team: {emergency.assignedTeam}</span>
                  </div>
                  <span className="text-gray-500">{new Date(emergency.reportedAt).toLocaleTimeString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Contacts */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Emergency Contacts</h2>
          <div className="space-y-4">
            {contacts.map((contact) => (
              <div key={contact.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="font-medium text-gray-900">{contact.name}</div>
                    <div className="text-sm text-gray-600">{contact.role}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${contact.available ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    <span className="text-sm text-gray-600">{contact.available ? 'Available' : 'Busy'}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{contact.location}</span>
                  <a href={`tel:${contact.phone}`} 
                     className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                    <PhoneIcon className="h-4 w-4" />
                    Call
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Resources Status */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Resource Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {resources.map((resource) => (
            <div key={resource.id} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <TruckIcon className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-gray-900">{resource.name}</span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  resource.status === 'available' ? 'bg-green-100 text-green-800' :
                  resource.status === 'deployed' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {resource.status}
                </span>
              </div>
              <div className="text-sm text-gray-600">{resource.location}</div>
              {resource.eta && (
                <div className="text-sm text-blue-600 font-medium mt-1">ETA: {resource.eta} minutes</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Emergency Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="p-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all">
            <SpeakerWaveIcon className="h-6 w-6 mx-auto mb-2" />
            <div className="font-medium">Broadcast Alert</div>
          </button>
          
          <button className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all">
            <MapPinIcon className="h-6 w-6 mx-auto mb-2" />
            <div className="font-medium">Evacuation Routes</div>
          </button>
          
          <button className="p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all">
            <UserGroupIcon className="h-6 w-6 mx-auto mb-2" />
            <div className="font-medium">Mobilize Teams</div>
          </button>
          
          <button className="p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all">
            <DocumentTextIcon className="h-6 w-6 mx-auto mb-2" />
            <div className="font-medium">Incident Report</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmergencyResponseSystem;
