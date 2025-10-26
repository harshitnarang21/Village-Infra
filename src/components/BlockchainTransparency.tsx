import React, { useState, useEffect } from 'react';
import { 
  ShieldCheckIcon, 
  CurrencyRupeeIcon, 
  DocumentTextIcon,
  LinkIcon,
  CheckBadgeIcon,
  ClockIcon,
  EyeIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

interface Transaction {
  id: string;
  type: 'budget_allocation' | 'work_order' | 'payment' | 'audit';
  amount: string;
  description: string;
  timestamp: string;
  blockHash: string;
  status: 'pending' | 'confirmed' | 'completed';
  vendor?: string;
  publicKey: string;
}

interface SmartContract {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'pending' | 'completed';
  amount: string;
  vendor: string;
  conditions: string[];
  progress: number;
}

const BlockchainTransparency: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [contracts, setContracts] = useState<SmartContract[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'transactions' | 'contracts' | 'audit'>('transactions');

  useEffect(() => {
    // Simulate blockchain data loading
    setTimeout(() => {
      setTransactions([
        {
          id: 'TX001',
          type: 'budget_allocation',
          amount: '₹5,00,000',
          description: 'Road Repair Project - Main Street',
          timestamp: '2025-01-15 14:30:00',
          blockHash: '0x1a2b3c4d5e6f7890abcdef1234567890',
          status: 'confirmed',
          publicKey: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh'
        },
        {
          id: 'TX002',
          type: 'payment',
          amount: '₹1,50,000',
          description: 'Water Tank Maintenance Payment',
          timestamp: '2025-01-14 11:15:00',
          blockHash: '0x9876543210fedcba0987654321abcdef',
          status: 'completed',
          vendor: 'AquaTech Solutions',
          publicKey: 'bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4'
        },
        {
          id: 'TX003',
          type: 'work_order',
          amount: '₹75,000',
          description: 'Solar Panel Installation - Community Center',
          timestamp: '2025-01-13 09:45:00',
          blockHash: '0xabcdef1234567890fedcba0987654321',
          status: 'pending',
          vendor: 'GreenEnergy Corp',
          publicKey: 'bc1qrp33g0q5c5txsp9arysrx4k6zdkfs4nce4xj0gdcccefvpysxf3qccfmv3'
        }
      ]);

      setContracts([
        {
          id: 'SC001',
          name: 'Road Construction Contract',
          type: 'Infrastructure Development',
          status: 'active',
          amount: '₹12,00,000',
          vendor: 'BuildRight Construction',
          conditions: [
            'Material quality verification ✓',
            'Environmental clearance ✓',
            'Progress milestone 1 (25%) ✓',
            'Progress milestone 2 (50%) - Pending',
            'Final inspection - Pending'
          ],
          progress: 35
        },
        {
          id: 'SC002',
          name: 'Water Supply Upgrade',
          type: 'Utility Enhancement',
          status: 'pending',
          amount: '₹8,50,000',
          vendor: 'HydroTech Systems',
          conditions: [
            'Technical specifications review - Pending',
            'Budget approval - Pending',
            'Vendor verification - Pending'
          ],
          progress: 0
        },
        {
          id: 'SC003',
          name: 'LED Street Light Installation',
          type: 'Energy Efficiency',
          status: 'completed',
          amount: '₹3,25,000',
          vendor: 'LightTech Solutions',
          conditions: [
            'Installation completed ✓',
            'Quality testing ✓',
            'Warranty registration ✓',
            'Final payment processed ✓'
          ],
          progress: 100
        }
      ]);
      setIsLoading(false);
    }, 1200);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'active': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'pending': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'budget_allocation': return <CurrencyRupeeIcon className="h-5 w-5 text-green-600" />;
      case 'payment': return <CheckBadgeIcon className="h-5 w-5 text-blue-600" />;
      case 'work_order': return <DocumentTextIcon className="h-5 w-5 text-purple-600" />;
      case 'audit': return <ShieldCheckIcon className="h-5 w-5 text-red-600" />;
      default: return <DocumentTextIcon className="h-5 w-5 text-gray-600" />;
    }
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-3">
            <LinkIcon className="h-8 w-8 text-blue-600 animate-pulse" />
            <span className="text-lg font-medium text-gray-600">Loading blockchain data...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl">
          <ShieldCheckIcon className="h-8 w-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Blockchain Transparency Layer</h1>
          <p className="text-gray-600 mt-1">Immutable audit trails and smart contract automation</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Transactions</p>
              <p className="text-3xl font-bold text-blue-600">1,247</p>
            </div>
            <LinkIcon className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg border border-green-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Smart Contracts</p>
              <p className="text-3xl font-bold text-green-600">47</p>
            </div>
            <DocumentTextIcon className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg border border-purple-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Transparency Score</p>
              <p className="text-3xl font-bold text-purple-600">98%</p>
            </div>
            <EyeIcon className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg border border-orange-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Public Access</p>
              <p className="text-3xl font-bold text-orange-600">24/7</p>
            </div>
            <UserGroupIcon className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-100 rounded-xl p-1">
        {[
          { id: 'transactions', label: 'Transaction Ledger', icon: '🔗' },
          { id: 'contracts', label: 'Smart Contracts', icon: '📋' },
          { id: 'audit', label: 'Public Audit Trail', icon: '🔍' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all ${
              selectedTab === tab.id
                ? 'bg-white text-blue-600 shadow-md'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content based on selected tab */}
      {selectedTab === 'transactions' && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">🔗 Immutable Transaction Ledger</h2>
          <div className="space-y-4">
            {transactions.map((tx) => (
              <div key={tx.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    {getTypeIcon(tx.type)}
                    <div>
                      <h3 className="font-semibold text-gray-900">{tx.description}</h3>
                      <p className="text-gray-600 text-sm">Transaction ID: {tx.id}</p>
                      <p className="text-gray-500 text-xs mt-1">
                        Block: {tx.blockHash.substring(0, 20)}...
                      </p>
                      {tx.vendor && (
                        <p className="text-gray-500 text-xs">Vendor: {tx.vendor}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(tx.status)}`}>
                      {tx.status.toUpperCase()}
                    </span>
                    <p className="text-lg font-bold text-gray-900 mt-2">{tx.amount}</p>
                    <p className="text-xs text-gray-500">{tx.timestamp}</p>
                    <button className="text-blue-600 hover:text-blue-800 text-xs mt-1 flex items-center gap-1">
                      <EyeIcon className="h-3 w-3" />
                      View on Explorer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedTab === 'contracts' && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">📋 Smart Contract Management</h2>
          <div className="space-y-6">
            {contracts.map((contract) => (
              <div key={contract.id} className="border border-gray-200 rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{contract.name}</h3>
                    <p className="text-gray-600">{contract.type}</p>
                    <p className="text-sm text-gray-500">Vendor: {contract.vendor}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(contract.status)}`}>
                      {contract.status.toUpperCase()}
                    </span>
                    <p className="text-xl font-bold text-gray-900 mt-2">{contract.amount}</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Contract Progress</span>
                    <span className="font-semibold">{contract.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full ${contract.progress === 100 ? 'bg-green-500' : contract.progress > 0 ? 'bg-blue-500' : 'bg-gray-400'}`}
                      style={{ width: `${contract.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Conditions */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Contract Conditions:</h4>
                  <ul className="space-y-1">
                    {contract.conditions.map((condition, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-xs mt-1">•</span>
                        <span>{condition}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedTab === 'audit' && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">🔍 Public Audit Trail</h2>
          
          {/* Public Access Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-blue-800 mb-2">🌐 Public Blockchain Explorer</h3>
            <p className="text-blue-700 text-sm mb-3">
              All transactions and contracts are publicly accessible on our blockchain network. 
              Citizens can verify any transaction independently.
            </p>
            <div className="flex gap-3">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                Open Block Explorer
              </button>
              <button className="border border-blue-600 text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors">
                Download Audit Report
              </button>
            </div>
          </div>

          {/* Audit Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-xl border border-green-200">
              <div className="text-3xl font-bold text-green-600">100%</div>
              <div className="text-sm text-green-700 font-medium">Transactions Verified</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="text-3xl font-bold text-blue-600">0</div>
              <div className="text-sm text-blue-700 font-medium">Disputed Transactions</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-xl border border-purple-200">
              <div className="text-3xl font-bold text-purple-600">24/7</div>
              <div className="text-sm text-purple-700 font-medium">Public Access</div>
            </div>
          </div>

          {/* Recent Audit Activities */}
          <div className="mt-6">
            <h3 className="font-semibold text-gray-800 mb-4">Recent Audit Activities</h3>
            <div className="space-y-3">
              {[
                { time: '2 hours ago', action: 'Citizen verified road repair payment transaction', user: 'Anonymous User' },
                { time: '5 hours ago', action: 'External auditor downloaded quarterly financial report', user: 'State Audit Office' },
                { time: '1 day ago', action: 'Smart contract milestone automatically verified', user: 'System' },
                { time: '2 days ago', action: 'Public query submitted for water project expenses', user: 'Village Committee' }
              ].map((activity, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <ClockIcon className="h-4 w-4 text-gray-500 mt-1" />
                  <div>
                    <p className="text-sm text-gray-800">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.time} • {activity.user}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlockchainTransparency;
