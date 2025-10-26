import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import {
  ChartBarIcon,
  UserGroupIcon,
  BanknotesIcon,
  WrenchScrewdriverIcon,
  HomeIcon,
  DocumentChartBarIcon,
  CurrencyRupeeIcon,
  CheckBadgeIcon,
  UserIcon,
  MapPinIcon,
  GlobeAltIcon,
  BoltIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginPage from './components/LoginPage';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Reports from './pages/Reports';
import Profile from './pages/Profile';
import PredictiveMaintenance from './components/PredictiveMaintenance';
import DatabasePredictiveMaintenance from './components/DatabasePredictiveMaintenance';
import BlockchainTransparency from './components/BlockchainTransparency';
import CitizenParticipation from './components/CitizenParticipation';
import SustainabilityDashboard from './components/SustainabilityDashboard';
import OfflineManager from './components/OfflineManager';
import EnhancedVoiceInterface from './components/EnhancedVoiceInterface';
import SmartChatbot from './components/SmartChatbot';
import SmartVillageMap from './components/SmartVillageMap';
import MapUSPShowcase from './components/MapUSPShowcase';
import SmartEnergyDashboard from './components/SmartEnergyDashboard';
import AgriculturalIntelligence from './components/AgriculturalIntelligence';
import EmergencyResponseSystem from './components/EmergencyResponseSystem';
import WaterResourceManagement from './components/WaterResourceManagement';
import IssueReportingService from './components/IssueReportingService';
import AdminIssuesDashboard from './components/AdminIssuesDashboard';

const sidebarLinks = [
  { icon: <HomeIcon className="h-5 w-5" />, emoji: "🏠", label: "Dashboard", path: "/dashboard" },
  { icon: <MapPinIcon className="h-5 w-5" />, emoji: "🗺️", label: "Smart Map", path: "/map" },
  { icon: <BoltIcon className="h-5 w-5" />, emoji: "⚡", label: "Energy", path: "/energy" },
  { icon: <UserIcon className="h-5 w-5" />, emoji: "💧", label: "Water", path: "/water" },
  { icon: <UserIcon className="h-5 w-5" />, emoji: "🌾", label: "Agriculture", path: "/agriculture" },
  { icon: <UserIcon className="h-5 w-5" />, emoji: "🚨", label: "Emergency", path: "/emergency" },
  { icon: <CheckBadgeIcon className="h-5 w-5" />, emoji: "🗳️", label: "Citizens", path: "/citizen" },
  { icon: <UserIcon className="h-5 w-5" />, emoji: "🤖", label: "AI Chatbot", path: "/chatbot" },
  { icon: <DocumentChartBarIcon className="h-5 w-5" />, emoji: "📋", label: "Report Issue", path: "/report-issue" },
  { icon: <DocumentChartBarIcon className="h-5 w-5" />, emoji: "👨‍💼", label: "Admin Issues", path: "/admin-issues" },
  { icon: <DocumentChartBarIcon className="h-5 w-5" />, emoji: "🤖", label: "Maintenance", path: "/ai-maintenance" },
  { icon: <UserIcon className="h-5 w-5" />, emoji: "👤", label: "Profile", path: "/profile" },
];

const stats = [
  { icon: <UserGroupIcon className="h-6 w-6 text-white" />, label: "Village Population", value: "3,810", color: "from-blue-500 to-blue-600" },
  { icon: <WrenchScrewdriverIcon className="h-6 w-6 text-white" />, label: "Infrastructure Health", value: "96%", color: "from-green-500 to-green-600" },
  { icon: <BanknotesIcon className="h-6 w-6 text-white" />, label: "Annual Budget", value: "₹2.1Cr", color: "from-yellow-500 to-yellow-600" },
  { icon: <ChartBarIcon className="h-6 w-6 text-white" />, label: "Connected Villages", value: "24", color: "from-purple-500 to-purple-600" },
];

const cards = [
  { icon: "🤖", title: "AI Maintenance", desc: "Smart predictions for infrastructure health and maintenance scheduling.", path: "/maintenance" },
  { icon: "💰", title: "Budget Tracker", desc: "Transparent budget allocation and expense tracking.", path: "/budget" },
  { icon: "🗳️", title: "Community Voting", desc: "Real-time community decision making platform.", path: "/voting" },
  { icon: "🌱", title: "Sustainability Score", desc: "Environmental impact and carbon footprint tracking.", path: "/sustainability" },
];

const activityFeed = [
  { time: "2 min ago", text: "Water tank maintenance scheduled for Sector A", type: "maintenance", icon: "💧" },
  { time: "5 min ago", text: "Budget allocation of ₹50,000 approved for road repair", type: "budget", icon: "💰" },
  { time: "12 min ago", text: "Community voted on new playground proposal", type: "voting", icon: "🗳️" },
  { time: "23 min ago", text: "Solar panel efficiency increased by 12%", type: "sustainability", icon: "🌱" },
];

// Main Dashboard Component
function DashboardContent() {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPageContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardStats />;
      case 'ai maintenance':
        return <PredictiveMaintenance />;
      case 'db maintenance':
        return <DatabasePredictiveMaintenance />;
      case 'blockchain':
        return <BlockchainTransparency />;
      case 'citizen portal':
        return <CitizenParticipation />;
      case 'sustainability':
        return <SustainabilityDashboard />;
      case 'offline mode':
        return <OfflineManager />;
      case 'voice interface':
        return <EnhancedVoiceInterface />;
      case 'smart map':
        return <SmartVillageMap />;
      case 'map usps':
        return <MapUSPShowcase />;
      case 'energy':
        return <SmartEnergyDashboard />;
      case 'water':
        return <WaterResourceManagement />;
      case 'agriculture':
        return <AgriculturalIntelligence />;
      case 'emergency':
        return <EmergencyResponseSystem />;
      case 'citizens':
        return <CitizenParticipation />;
      case 'ai chatbot':
        return <SmartChatbot />;
      case 'report issue':
        return <IssueReportingService />;
      case 'admin issues':
        return <AdminIssuesDashboard />;
      case 'voice ai':
        return <EnhancedVoiceInterface />;
      case 'maintenance':
        return <PredictiveMaintenance />;
      case 'analytics':
        return <Analytics />;
      case 'profile':
        return <Profile />;
      default:
        return <DashboardStats />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Sidebar */}
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      
      {/* Main Content */}
      <div className="ml-0 md:ml-72 min-h-screen">
        {/* Header */}
        <Header />
        
        {/* Page Content */}
        <main className="p-6">
          {renderPageContent()}
        </main>
      </div>
    </div>
  );
}

// Dashboard Stats Component
function DashboardStats() {
  return (
    <div className="space-y-8">
      {/* Village Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-lg border border-green-100 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-lg border border-green-100 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{card.icon}</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{card.title}</h3>
            <p className="text-gray-600 text-sm">{card.desc}</p>
          </div>
        ))}
      </div>

      {/* Activity Feed */}
      <div className="bg-white rounded-2xl shadow-lg border border-green-100 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Village Activities</h3>
        <div className="space-y-4">
          {activityFeed.map((activity, i) => (
            <div key={i} className="flex items-start gap-4 p-4 rounded-xl hover:bg-green-50 transition-colors duration-200">
              <div className="text-2xl">{activity.icon}</div>
              <div className="flex-1">
                <p className="text-gray-800 font-medium">{activity.text}</p>
                <p className="text-gray-500 text-sm mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
// Sidebar Component
function Sidebar({ currentPage, setCurrentPage }: { currentPage: string; setCurrentPage: (page: string) => void }) {
  const { user, logout } = useAuth();

  return (
    <div className="fixed left-0 top-0 h-full w-72 bg-white shadow-2xl border-r border-green-100 z-40">
      {/* Logo */}
      <div className="p-6 border-b border-green-100">
        <div className="flex items-center gap-3">
          <div className="text-3xl">🌾</div>
          <div>
            <h1 className="text-2xl font-bold text-green-800">Sudarshan</h1>
            <p className="text-sm text-green-600">Village Infrastructure</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {sidebarLinks.map((link) => (
          <button
            key={link.path}
            onClick={() => setCurrentPage(link.label.toLowerCase())}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${
              currentPage === link.label.toLowerCase()
                ? 'bg-green-100 text-green-800 shadow-md'
                : 'text-gray-600 hover:bg-green-50 hover:text-green-700'
            }`}
          >
            <div className="text-xl">{link.emoji}</div>
            <span className="font-medium">{link.label}</span>
          </button>
        ))}
      </nav>

      {/* User Info & Logout */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-green-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-green-200 flex items-center justify-center text-green-800 font-semibold">
            {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
          </div>
          <div>
            <p className="font-semibold text-gray-800">{user?.name}</p>
            <p className="text-sm text-green-600 capitalize">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors duration-200"
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}

// Header Component
function Header() {
  const { user } = useAuth();
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getPersonalizedMessage = () => {
    const greeting = getGreeting();
    const firstName = user?.name?.split(' ')[0] || 'User';
    return `${greeting}, ${firstName}!`;
  };
  
  return (
    <header className="bg-white shadow-sm border-b border-green-100 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-green-800">Village Dashboard</h2>
          <p className="text-green-600 mt-1">
            {getPersonalizedMessage()} Ready to manage your village infrastructure today?
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <button className="p-2 text-green-600 hover:bg-green-50 rounded-xl transition-colors duration-200">
              <div className="text-2xl">🔔</div>
            </button>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </header>
  );
}

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <LoginPage />;
  }
  
  return <>{children}</>;
}

// Main App Component
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/*" element={
              <ProtectedRoute>
                <DashboardContent />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
