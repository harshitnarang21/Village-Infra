import React, { useState } from 'react';
import {
  DocumentTextIcon,
  MapPinIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  CalendarIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  BuildingOfficeIcon,
  CameraIcon,
  ArrowDownTrayIcon,
  ClipboardDocumentIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import IssueReportsDatabase, { IssueReport } from '../database/IssueReportsDatabase';

interface IssueReportForm {
  id: string;
  reporterName: string;
  reporterPhone: string;
  reporterEmail: string;
  city: string;
  completeAddress: string;
  category: string;
  subCategory: string;
  issueTitle: string;
  issueDescription: string;
  urgency: 'Low' | 'Medium' | 'High' | 'Critical';
  dateReported: Date;
  expectedResolution: string;
  attachments: File[];
  status: 'Submitted' | 'Under Review' | 'In Progress' | 'Resolved';
}

const IssueReportingService: React.FC = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<Partial<IssueReportForm>>({
    reporterName: user?.name || '',
    reporterPhone: '',
    reporterEmail: user?.email || '',
    city: '',
    completeAddress: '',
    category: '',
    subCategory: '',
    issueTitle: '',
    issueDescription: '',
    urgency: 'Medium',
    expectedResolution: '',
    attachments: []
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [generatedReportId, setGeneratedReportId] = useState('');
  
  const database = IssueReportsDatabase.getInstance();

  const cities = [
    'Sudarshan Village',
    'Pune',
    'Mumbai',
    'Nashik',
    'Aurangabad',
    'Kolhapur',
    'Sangli',
    'Satara',
    'Solapur',
    'Ahmednagar'
  ];

  const issueCategories = {
    'Infrastructure': [
      'Road & Transportation',
      'Water Supply',
      'Electricity',
      'Drainage & Sewerage',
      'Street Lighting',
      'Public Buildings'
    ],
    'Public Services': [
      'Waste Management',
      'Healthcare Services',
      'Education',
      'Public Safety',
      'Fire Services',
      'Emergency Services'
    ],
    'Environment': [
      'Air Pollution',
      'Water Pollution',
      'Noise Pollution',
      'Waste Disposal',
      'Tree Cutting',
      'Environmental Hazards'
    ],
    'Civic Issues': [
      'Traffic Management',
      'Parking Issues',
      'Public Transport',
      'Market & Commerce',
      'Housing Issues',
      'Land Records'
    ],
    'Digital Services': [
      'Online Portal Issues',
      'Digital Payment Problems',
      'E-Governance Services',
      'Website Problems',
      'Mobile App Issues',
      'Data Errors'
    ]
  };

  const urgencyLevels = [
    { value: 'Low', color: 'text-green-600 bg-green-100', description: 'Can wait 7+ days' },
    { value: 'Medium', color: 'text-yellow-600 bg-yellow-100', description: 'Needs attention in 3-7 days' },
    { value: 'High', color: 'text-orange-600 bg-orange-100', description: 'Urgent - within 24-72 hours' },
    { value: 'Critical', color: 'text-red-600 bg-red-100', description: 'Emergency - immediate action needed' }
  ];

  const handleInputChange = (field: keyof IssueReportForm, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setFormData(prev => ({ 
      ...prev, 
      attachments: [...(prev.attachments || []), ...files] 
    }));
  };

  const generateReportId = () => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `SUD-${timestamp}-${random}`.toUpperCase();
  };

  const generatePDFReport = async (reportData: IssueReport) => {
    // Create PDF content as HTML string
    const pdfContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Issue Report - ${reportData.id}</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; line-height: 1.6; }
            .header { text-align: center; border-bottom: 3px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px; }
            .logo { font-size: 28px; font-weight: bold; color: #1e40af; margin-bottom: 10px; }
            .subtitle { font-size: 16px; color: #6b7280; margin-bottom: 5px; }
            .contact-info { font-size: 12px; color: #6b7280; margin-top: 10px; }
            .report-id { background: #dbeafe; padding: 10px; border-radius: 8px; text-align: center; margin: 20px 0; }
            .section { margin-bottom: 25px; }
            .section-title { font-size: 18px; font-weight: bold; color: #1e40af; border-bottom: 2px solid #e5e7eb; padding-bottom: 5px; margin-bottom: 15px; }
            .field-group { display: flex; margin-bottom: 10px; }
            .field-label { font-weight: bold; width: 150px; color: #374151; }
            .field-value { color: #6b7280; flex: 1; }
            .urgency-high { color: #dc2626; font-weight: bold; }
            .urgency-critical { color: #dc2626; font-weight: bold; background: #fee2e2; padding: 2px 8px; border-radius: 4px; }
            .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; text-align: center; }
            .status-badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; }
            .status-submitted { background: #dbeafe; color: #1e40af; }
        </style>
    </head>
    <body>
        <div class="header">
            <div class="logo">🏘️ SUDARSHAN VILLAGE</div>
            <div class="subtitle">Digital Infrastructure Management System</div>
            <div class="subtitle">Issue Reporting & Resolution Service</div>
            <div class="contact-info">
                📧 contact@sudarshan.gov.in | 📞 +91-9876543210 | 🌐 www.sudarshan.gov.in<br>
                📍 Sudarshan Village, Pune District, Maharashtra - 411001
            </div>
        </div>

        <div class="report-id">
            <strong>ISSUE REPORT ID: ${reportData.id}</strong><br>
            <span class="status-badge status-submitted">● ${reportData.status}</span>
        </div>

        <div class="section">
            <div class="section-title">📋 REPORT DETAILS</div>
            <div class="field-group">
                <div class="field-label">Report ID:</div>
                <div class="field-value">${reportData.id}</div>
            </div>
            <div class="field-group">
                <div class="field-label">Date Submitted:</div>
                <div class="field-value">${reportData.dateReported.toLocaleDateString('en-IN')} at ${reportData.dateReported.toLocaleTimeString('en-IN')}</div>
            </div>
            <div class="field-group">
                <div class="field-label">Status:</div>
                <div class="field-value">${reportData.status}</div>
            </div>
        </div>

        <div class="section">
            <div class="section-title">👤 REPORTER INFORMATION</div>
            <div class="field-group">
                <div class="field-label">Name:</div>
                <div class="field-value">${reportData.reporterName}</div>
            </div>
            <div class="field-group">
                <div class="field-label">Phone:</div>
                <div class="field-value">${reportData.reporterPhone}</div>
            </div>
            <div class="field-group">
                <div class="field-label">Email:</div>
                <div class="field-value">${reportData.reporterEmail}</div>
            </div>
        </div>

        <div class="section">
            <div class="section-title">📍 LOCATION DETAILS</div>
            <div class="field-group">
                <div class="field-label">City:</div>
                <div class="field-value">${reportData.city}</div>
            </div>
            <div class="field-group">
                <div class="field-label">Complete Address:</div>
                <div class="field-value">${reportData.completeAddress}</div>
            </div>
        </div>

        <div class="section">
            <div class="section-title">🔧 ISSUE INFORMATION</div>
            <div class="field-group">
                <div class="field-label">Category:</div>
                <div class="field-value">${reportData.category}</div>
            </div>
            <div class="field-group">
                <div class="field-label">Sub-Category:</div>
                <div class="field-value">${reportData.subCategory}</div>
            </div>
            <div class="field-group">
                <div class="field-label">Issue Title:</div>
                <div class="field-value">${reportData.issueTitle}</div>
            </div>
            <div class="field-group">
                <div class="field-label">Priority Level:</div>
                <div class="field-value ${reportData.urgency === 'Critical' ? 'urgency-critical' : reportData.urgency === 'High' ? 'urgency-high' : ''}">${reportData.urgency}</div>
            </div>
            <div class="field-group">
                <div class="field-label">Description:</div>
                <div class="field-value">${reportData.issueDescription}</div>
            </div>
            <div class="field-group">
                <div class="field-label">Expected Resolution:</div>
                <div class="field-value">${reportData.expectedResolution}</div>
            </div>
        </div>

        <div class="section">
            <div class="section-title">📎 ATTACHMENTS</div>
            <div class="field-value">
                ${reportData.attachments.length > 0 
                    ? reportData.attachments.map(fileName => `• ${fileName}`).join('<br>') 
                    : 'No attachments uploaded'}
            </div>
        </div>

        <div class="footer">
            <p><strong>SUDARSHAN VILLAGE ADMINISTRATION</strong></p>
            <p>This is an official report generated by the Sudarshan Digital Infrastructure Management System.</p>
            <p>For inquiries about this report, please contact us with Report ID: ${reportData.id}</p>
            <p>Generated on: ${new Date().toLocaleString('en-IN')}</p>
        </div>
    </body>
    </html>`;

    // Create and download PDF
    const blob = new Blob([pdfContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Sudarshan_Issue_Report_${reportData.id}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Generate report ID
      const reportId = generateReportId();
      
      // Convert File objects to file names for database storage
      const attachmentNames = (formData.attachments || []).map(file => file.name);
      
      // Create complete report data for database
      const completeReport: IssueReport = {
        id: reportId,
        reporterName: formData.reporterName || '',
        reporterPhone: formData.reporterPhone || '',
        reporterEmail: formData.reporterEmail || '',
        city: formData.city || '',
        completeAddress: formData.completeAddress || '',
        category: formData.category || '',
        subCategory: formData.subCategory || '',
        issueTitle: formData.issueTitle || '',
        issueDescription: formData.issueDescription || '',
        urgency: formData.urgency || 'Medium',
        expectedResolution: formData.expectedResolution || '',
        attachments: attachmentNames,
        dateReported: new Date(),
        status: 'Submitted'
      };

      // Save to database
      const saved = await database.saveReport(completeReport);
      if (!saved) {
        throw new Error('Failed to save report to database');
      }

      // Generate and download PDF
      await generatePDFReport(completeReport);

      setGeneratedReportId(reportId);
      setShowSuccess(true);
      
      // Reset form
      setFormData({
        reporterName: user?.name || '',
        reporterPhone: '',
        reporterEmail: user?.email || '',
        city: '',
        completeAddress: '',
        category: '',
        subCategory: '',
        issueTitle: '',
        issueDescription: '',
        urgency: 'Medium',
        expectedResolution: '',
        attachments: []
      });

    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Error submitting report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircleIcon className="h-12 w-12 text-green-600" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Report Submitted Successfully!</h1>
            
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
              <p className="text-lg font-semibold text-green-800 mb-2">Your Report ID:</p>
              <p className="text-2xl font-mono font-bold text-green-900">{generatedReportId}</p>
            </div>

            <div className="space-y-4 text-gray-700 mb-8">
              <p>✅ Your issue report has been successfully submitted to Sudarshan Village Administration</p>
              <p>📄 Official PDF report has been downloaded to your device</p>
              <p>📧 You will receive email updates on your report status</p>
              <p>🕐 Expected response time: 24-48 hours</p>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setShowSuccess(false)}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
              >
                Submit Another Report
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl">
              <DocumentTextIcon className="h-16 w-16 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Issue Reporting Service</h1>
          <p className="text-xl text-gray-600 mb-4">Sudarshan Village Digital Administration</p>
          <p className="text-gray-500">Report civic issues and get official documentation with tracking</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-2xl p-8">
          {/* Reporter Information */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-3">
              <UserIcon className="h-6 w-6 text-blue-600" />
              Reporter Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.reporterName}
                  onChange={(e) => handleInputChange('reporterName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={formData.reporterPhone}
                  onChange={(e) => handleInputChange('reporterPhone', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+91 9876543210"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                <input
                  type="email"
                  required
                  value={formData.reporterEmail}
                  onChange={(e) => handleInputChange('reporterEmail', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-3">
              <MapPinIcon className="h-6 w-6 text-blue-600" />
              Location Details
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City/Village *</label>
                <select
                  required
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select City/Village</option>
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Complete Address *</label>
                <textarea
                  required
                  value={formData.completeAddress}
                  onChange={(e) => handleInputChange('completeAddress', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter complete address with landmarks, area, pincode..."
                />
              </div>
            </div>
          </div>

          {/* Issue Information */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-3">
              <ExclamationTriangleIcon className="h-6 w-6 text-blue-600" />
              Issue Details
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Issue Category *</label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => {
                    handleInputChange('category', e.target.value);
                    handleInputChange('subCategory', ''); // Reset subcategory
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Category</option>
                  {Object.keys(issueCategories).map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sub-Category *</label>
                <select
                  required
                  value={formData.subCategory}
                  onChange={(e) => handleInputChange('subCategory', e.target.value)}
                  disabled={!formData.category}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                >
                  <option value="">Select Sub-Category</option>
                  {formData.category && issueCategories[formData.category as keyof typeof issueCategories]?.map(subCat => (
                    <option key={subCat} value={subCat}>{subCat}</option>
                  ))}
                </select>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Issue Title *</label>
                <input
                  type="text"
                  required
                  value={formData.issueTitle}
                  onChange={(e) => handleInputChange('issueTitle', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Brief title describing the issue"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Detailed Description *</label>
                <textarea
                  required
                  value={formData.issueDescription}
                  onChange={(e) => handleInputChange('issueDescription', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Provide detailed description of the issue, when it started, impact on community..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority Level *</label>
                <div className="space-y-2">
                  {urgencyLevels.map(level => (
                    <label key={level.value} className="flex items-center">
                      <input
                        type="radio"
                        name="urgency"
                        value={level.value}
                        checked={formData.urgency === level.value}
                        onChange={(e) => handleInputChange('urgency', e.target.value)}
                        className="mr-3"
                      />
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${level.color} mr-2`}>
                        {level.value}
                      </span>
                      <span className="text-sm text-gray-600">{level.description}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Expected Resolution</label>
                <textarea
                  value={formData.expectedResolution}
                  onChange={(e) => handleInputChange('expectedResolution', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="What do you expect as a solution? (Optional)"
                />
              </div>
            </div>
          </div>

          {/* File Attachments */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-3">
              <CameraIcon className="h-6 w-6 text-blue-600" />
              Attachments (Optional)
            </h2>
            
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
              <input
                type="file"
                multiple
                accept="image/*,.pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <CameraIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-700">Upload Photos or Documents</p>
                <p className="text-sm text-gray-500">PNG, JPG, PDF, DOC files up to 10MB each</p>
              </label>
              
              {formData.attachments && formData.attachments.length > 0 && (
                <div className="mt-4">
                  <p className="font-medium text-gray-700 mb-2">Uploaded Files:</p>
                  {formData.attachments.map((file, index) => (
                    <div key={index} className="text-sm text-gray-600">• {file.name}</div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 mx-auto"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Submitting Report...
                </>
              ) : (
                <>
                  <ArrowDownTrayIcon className="h-5 w-5" />
                  Submit Report & Download PDF
                </>
              )}
            </button>
            
            <p className="text-sm text-gray-500 mt-4">
              By submitting this report, you agree to provide accurate information and understand that false reporting may have legal consequences.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IssueReportingService;
