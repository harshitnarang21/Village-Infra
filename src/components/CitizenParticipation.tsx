import React, { useState, useEffect } from 'react';
import { 
  HandRaisedIcon, 
  CameraIcon, 
  VideoCameraIcon,
  StarIcon,
  TrophyIcon,
  ChatBubbleLeftRightIcon,
  MapPinIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface VotingProposal {
  id: string;
  title: string;
  description: string;
  category: string;
  budget: string;
  votes: {
    for: number;
    against: number;
    abstain: number;
  };
  deadline: string;
  status: 'active' | 'passed' | 'rejected' | 'pending';
  submittedBy: string;
}

interface IssueReport {
  id: string;
  title: string;
  description: string;
  category: 'water' | 'electricity' | 'roads' | 'waste' | 'other';
  location: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'reported' | 'acknowledged' | 'in_progress' | 'resolved';
  reportedBy: string;
  timestamp: string;
  hasPhoto: boolean;
  hasVideo: boolean;
  upvotes: number;
}

interface CitizenReward {
  id: string;
  citizen: string;
  points: number;
  level: string;
  badges: string[];
  contributions: number;
}

const CitizenParticipation: React.FC = () => {
  const [proposals, setProposals] = useState<VotingProposal[]>([]);
  const [issues, setIssues] = useState<IssueReport[]>([]);
  const [rewards, setRewards] = useState<CitizenReward[]>([]);
  const [selectedTab, setSelectedTab] = useState<'voting' | 'issues' | 'rewards'>('voting');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    setTimeout(() => {
      setProposals([
        {
          id: 'P001',
          title: 'New Community Park Development',
          description: 'Proposal to develop a 2-acre community park with playground, walking tracks, and green spaces.',
          category: 'Recreation',
          budget: '₹15,00,000',
          votes: { for: 234, against: 45, abstain: 12 },
          deadline: '2025-01-25',
          status: 'active',
          submittedBy: 'Village Development Committee'
        },
        {
          id: 'P002',
          title: 'Solar Street Light Installation',
          description: 'Install 50 solar-powered LED street lights along main roads and residential areas.',
          category: 'Infrastructure',
          budget: '₹8,50,000',
          votes: { for: 189, against: 23, abstain: 8 },
          deadline: '2025-01-22',
          status: 'active',
          submittedBy: 'Citizens Collective'
        },
        {
          id: 'P003',
          title: 'Water Quality Testing Lab',
          description: 'Establish a local water quality testing facility for regular monitoring.',
          category: 'Health & Safety',
          budget: '₹12,00,000',
          votes: { for: 156, against: 67, abstain: 15 },
          deadline: '2025-01-20',
          status: 'passed',
          submittedBy: 'Health Committee'
        }
      ]);

      setIssues([
        {
          id: 'I001',
          title: 'Water Leakage on Main Street',
          description: 'Large water pipe leak causing road damage and water wastage near the market area.',
          category: 'water',
          location: 'Main Street, Near Market',
          priority: 'high',
          status: 'in_progress',
          reportedBy: 'Rajesh Kumar',
          timestamp: '2025-01-15 09:30',
          hasPhoto: true,
          hasVideo: false,
          upvotes: 23
        },
        {
          id: 'I002',
          title: 'Broken Street Light',
          description: 'Street light pole damaged after recent storm, creating safety hazard.',
          category: 'electricity',
          location: 'Residential Area Block C',
          priority: 'medium',
          status: 'acknowledged',
          reportedBy: 'Priya Sharma',
          timestamp: '2025-01-14 18:45',
          hasPhoto: true,
          hasVideo: true,
          upvotes: 15
        },
        {
          id: 'I003',
          title: 'Garbage Collection Missed',
          description: 'Waste collection truck has not visited our area for 3 days, causing hygiene issues.',
          category: 'waste',
          location: 'Sector 7, Lane 3',
          priority: 'critical',
          status: 'reported',
          reportedBy: 'Amit Patel',
          timestamp: '2025-01-13 07:20',
          hasPhoto: false,
          hasVideo: false,
          upvotes: 31
        }
      ]);

      setRewards([
        {
          id: 'R001',
          citizen: 'Rajesh Kumar',
          points: 1250,
          level: 'Village Champion',
          badges: ['Issue Reporter', 'Community Voter', 'Photo Contributor'],
          contributions: 15
        },
        {
          id: 'R002',
          citizen: 'Priya Sharma',
          points: 890,
          level: 'Active Citizen',
          badges: ['Video Reporter', 'Proposal Supporter'],
          contributions: 12
        },
        {
          id: 'R003',
          citizen: 'Amit Patel',
          points: 650,
          level: 'Engaged Resident',
          badges: ['Issue Reporter', 'Community Voter'],
          contributions: 8
        }
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'water': return '💧';
      case 'electricity': return '⚡';
      case 'roads': return '🛣️';
      case 'waste': return '🗑️';
      default: return '📋';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'acknowledged': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'reported': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'passed': return 'bg-green-100 text-green-800 border-green-200';
      case 'active': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-3">
            <HandRaisedIcon className="h-8 w-8 text-green-600 animate-pulse" />
            <span className="text-lg font-medium text-gray-600">Loading citizen participation data...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl">
          <HandRaisedIcon className="h-8 w-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Citizen Participatory Planning</h1>
          <p className="text-gray-600 mt-1">Empowering community voices in infrastructure decisions</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-lg border border-green-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Voters</p>
              <p className="text-3xl font-bold text-green-600">1,247</p>
            </div>
            <HandRaisedIcon className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Issues Reported</p>
              <p className="text-3xl font-bold text-blue-600">89</p>
            </div>
            <ExclamationTriangleIcon className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg border border-purple-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Engagement Rate</p>
              <p className="text-3xl font-bold text-purple-600">78%</p>
            </div>
            <ChatBubbleLeftRightIcon className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg border border-orange-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Rewards Earned</p>
              <p className="text-3xl font-bold text-orange-600">15,420</p>
            </div>
            <TrophyIcon className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-100 rounded-xl p-1">
        {[
          { id: 'voting', label: 'Community Voting', icon: '🗳️' },
          { id: 'issues', label: 'Issue Reporting', icon: '📸' },
          { id: 'rewards', label: 'Citizen Rewards', icon: '🏆' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all ${
              selectedTab === tab.id
                ? 'bg-white text-green-600 shadow-md'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content based on selected tab */}
      {selectedTab === 'voting' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">🗳️ Community Voting on Infrastructure Priorities</h2>
            <button className="bg-green-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-green-700 transition-colors">
              Submit New Proposal
            </button>
          </div>
          
          <div className="space-y-4">
            {proposals.map((proposal) => (
              <div key={proposal.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{proposal.title}</h3>
                    <p className="text-gray-600 mt-1">{proposal.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span>Category: {proposal.category}</span>
                      <span>Budget: {proposal.budget}</span>
                      <span>By: {proposal.submittedBy}</span>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(proposal.status)}`}>
                    {proposal.status.toUpperCase()}
                  </span>
                </div>

                {/* Voting Results */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Voting Results</span>
                    <span className="text-gray-500">Deadline: {proposal.deadline}</span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="text-green-600 font-medium w-16">For:</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${(proposal.votes.for / (proposal.votes.for + proposal.votes.against + proposal.votes.abstain)) * 100}%` }}
                        ></div>
                      </div>
                      <span className="font-semibold w-12">{proposal.votes.for}</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className="text-red-600 font-medium w-16">Against:</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-red-500 h-2 rounded-full"
                          style={{ width: `${(proposal.votes.against / (proposal.votes.for + proposal.votes.against + proposal.votes.abstain)) * 100}%` }}
                        ></div>
                      </div>
                      <span className="font-semibold w-12">{proposal.votes.against}</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className="text-gray-600 font-medium w-16">Abstain:</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gray-500 h-2 rounded-full"
                          style={{ width: `${(proposal.votes.abstain / (proposal.votes.for + proposal.votes.against + proposal.votes.abstain)) * 100}%` }}
                        ></div>
                      </div>
                      <span className="font-semibold w-12">{proposal.votes.abstain}</span>
                    </div>
                  </div>

                  {proposal.status === 'active' && (
                    <div className="flex gap-3 mt-4">
                      <button className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors">
                        Vote For
                      </button>
                      <button className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors">
                        Vote Against
                      </button>
                      <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                        Abstain
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedTab === 'issues' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">📸 Citizen Issue Reporting</h2>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-blue-700 transition-colors">
              Report New Issue
            </button>
          </div>
          
          <div className="space-y-4">
            {issues.map((issue) => (
              <div key={issue.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">{getCategoryIcon(issue.category)}</div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{issue.title}</h3>
                      <p className="text-gray-600 mt-1">{issue.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <MapPinIcon className="h-4 w-4" />
                          {issue.location}
                        </span>
                        <span>By: {issue.reportedBy}</span>
                        <span>{issue.timestamp}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(issue.priority)}`}>
                      {issue.priority.toUpperCase()}
                    </span>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(issue.status)}`}>
                      {issue.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {issue.hasPhoto && (
                      <div className="flex items-center gap-1 text-blue-600">
                        <CameraIcon className="h-4 w-4" />
                        <span className="text-sm">Photo</span>
                      </div>
                    )}
                    {issue.hasVideo && (
                      <div className="flex items-center gap-1 text-purple-600">
                        <VideoCameraIcon className="h-4 w-4" />
                        <span className="text-sm">Video</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="flex items-center gap-1 text-green-600 hover:text-green-700">
                      <HandRaisedIcon className="h-4 w-4" />
                      <span className="text-sm font-medium">{issue.upvotes} upvotes</span>
                    </button>
                    <button className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedTab === 'rewards' && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900">🏆 Gamified Citizen Engagement Rewards</h2>
          
          {/* Reward System Info */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-6">
            <h3 className="font-bold text-yellow-800 mb-3">🎮 How to Earn Rewards</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-green-600">+50 points</span>
                <span className="text-yellow-700">Report an issue with photo</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-600">+30 points</span>
                <span className="text-yellow-700">Vote on community proposals</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-600">+100 points</span>
                <span className="text-yellow-700">Submit approved proposal</span>
              </div>
            </div>
          </div>

          {/* Leaderboard */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">🥇 Community Leaderboard</h3>
            <div className="space-y-4">
              {rewards.map((reward, index) => (
                <div key={reward.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                      index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-500' : 'bg-blue-500'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{reward.citizen}</h4>
                      <p className="text-sm text-gray-600">{reward.level}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-1">
                      <StarIcon className="h-4 w-4 text-yellow-500" />
                      <span className="font-bold text-lg">{reward.points}</span>
                    </div>
                    <div className="flex gap-1">
                      {reward.badges.map((badge, i) => (
                        <span key={i} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          {badge}
                        </span>
                      ))}
                    </div>
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

export default CitizenParticipation;
