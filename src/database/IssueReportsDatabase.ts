// Issue Reports Database Service
export interface IssueReport {
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
  attachments: string[]; // File names/paths
  status: 'Submitted' | 'Under Review' | 'In Progress' | 'Resolved' | 'Closed';
  assignedTo?: string;
  adminNotes?: string;
  resolutionDate?: Date;
  resolutionDetails?: string;
}

class IssueReportsDatabase {
  private static instance: IssueReportsDatabase;
  private readonly STORAGE_KEY = 'sudarshan_issue_reports';

  private constructor() {}

  public static getInstance(): IssueReportsDatabase {
    if (!IssueReportsDatabase.instance) {
      IssueReportsDatabase.instance = new IssueReportsDatabase();
    }
    return IssueReportsDatabase.instance;
  }

  // Save a new issue report
  public async saveReport(report: IssueReport): Promise<boolean> {
    try {
      const reports = this.getAllReports();
      reports.push(report);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(reports));
      
      // Simulate API call to backend
      console.log('📝 Issue Report Saved:', report.id);
      return true;
    } catch (error) {
      console.error('Error saving issue report:', error);
      return false;
    }
  }

  // Get all reports
  public getAllReports(): IssueReport[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return this.getInitialReports();
      
      const reports = JSON.parse(stored);
      // Convert date strings back to Date objects
      return reports.map((report: any) => ({
        ...report,
        dateReported: new Date(report.dateReported),
        resolutionDate: report.resolutionDate ? new Date(report.resolutionDate) : undefined
      }));
    } catch (error) {
      console.error('Error loading reports:', error);
      return this.getInitialReports();
    }
  }

  // Get reports by status
  public getReportsByStatus(status: IssueReport['status']): IssueReport[] {
    return this.getAllReports().filter(report => report.status === status);
  }

  // Get reports by urgency
  public getReportsByUrgency(urgency: IssueReport['urgency']): IssueReport[] {
    return this.getAllReports().filter(report => report.urgency === urgency);
  }

  // Get reports by category
  public getReportsByCategory(category: string): IssueReport[] {
    return this.getAllReports().filter(report => report.category === category);
  }

  // Get reports by city
  public getReportsByCity(city: string): IssueReport[] {
    return this.getAllReports().filter(report => report.city === city);
  }

  // Update report status
  public async updateReportStatus(
    reportId: string, 
    status: IssueReport['status'], 
    adminNotes?: string,
    assignedTo?: string
  ): Promise<boolean> {
    try {
      const reports = this.getAllReports();
      const reportIndex = reports.findIndex(r => r.id === reportId);
      
      if (reportIndex === -1) return false;
      
      reports[reportIndex].status = status;
      if (adminNotes) reports[reportIndex].adminNotes = adminNotes;
      if (assignedTo) reports[reportIndex].assignedTo = assignedTo;
      
      // Set resolution date if resolved
      if (status === 'Resolved' || status === 'Closed') {
        reports[reportIndex].resolutionDate = new Date();
      }
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(reports));
      console.log('📊 Report Status Updated:', reportId, status);
      return true;
    } catch (error) {
      console.error('Error updating report status:', error);
      return false;
    }
  }

  // Add resolution details
  public async addResolutionDetails(reportId: string, resolutionDetails: string): Promise<boolean> {
    try {
      const reports = this.getAllReports();
      const reportIndex = reports.findIndex(r => r.id === reportId);
      
      if (reportIndex === -1) return false;
      
      reports[reportIndex].resolutionDetails = resolutionDetails;
      reports[reportIndex].resolutionDate = new Date();
      reports[reportIndex].status = 'Resolved';
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(reports));
      return true;
    } catch (error) {
      console.error('Error adding resolution details:', error);
      return false;
    }
  }

  // Get report by ID
  public getReportById(reportId: string): IssueReport | null {
    const reports = this.getAllReports();
    return reports.find(r => r.id === reportId) || null;
  }

  // Get dashboard statistics
  public getDashboardStats() {
    const reports = this.getAllReports();
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    return {
      total: reports.length,
      submitted: reports.filter(r => r.status === 'Submitted').length,
      underReview: reports.filter(r => r.status === 'Under Review').length,
      inProgress: reports.filter(r => r.status === 'In Progress').length,
      resolved: reports.filter(r => r.status === 'Resolved').length,
      closed: reports.filter(r => r.status === 'Closed').length,
      critical: reports.filter(r => r.urgency === 'Critical').length,
      high: reports.filter(r => r.urgency === 'High').length,
      todayReports: reports.filter(r => r.dateReported >= today).length,
      weekReports: reports.filter(r => r.dateReported >= thisWeek).length,
      monthReports: reports.filter(r => r.dateReported >= thisMonth).length,
      categoryBreakdown: this.getCategoryBreakdown(reports),
      cityBreakdown: this.getCityBreakdown(reports)
    };
  }

  private getCategoryBreakdown(reports: IssueReport[]) {
    const breakdown: Record<string, number> = {};
    reports.forEach(report => {
      breakdown[report.category] = (breakdown[report.category] || 0) + 1;
    });
    return breakdown;
  }

  private getCityBreakdown(reports: IssueReport[]) {
    const breakdown: Record<string, number> = {};
    reports.forEach(report => {
      breakdown[report.city] = (breakdown[report.city] || 0) + 1;
    });
    return breakdown;
  }

  // Search reports
  public searchReports(query: string): IssueReport[] {
    const reports = this.getAllReports();
    const lowerQuery = query.toLowerCase();
    
    return reports.filter(report => 
      report.id.toLowerCase().includes(lowerQuery) ||
      report.reporterName.toLowerCase().includes(lowerQuery) ||
      report.issueTitle.toLowerCase().includes(lowerQuery) ||
      report.issueDescription.toLowerCase().includes(lowerQuery) ||
      report.category.toLowerCase().includes(lowerQuery) ||
      report.city.toLowerCase().includes(lowerQuery)
    );
  }

  // Get initial demo reports
  private getInitialReports(): IssueReport[] {
    const now = new Date();
    return [
      {
        id: 'SUD-DEMO-001',
        reporterName: 'Rajesh Kumar',
        reporterPhone: '+91-9876543210',
        reporterEmail: 'rajesh.kumar@email.com',
        city: 'Sudarshan Village',
        completeAddress: 'Near Village Square, Main Road, Sudarshan Village, Pune - 411001',
        category: 'Infrastructure',
        subCategory: 'Street Lighting',
        issueTitle: 'Street Light Not Working',
        issueDescription: 'The street light near the village square has been non-functional for the past 3 days. This is causing safety issues during night time.',
        urgency: 'High',
        dateReported: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        expectedResolution: 'Please repair or replace the faulty street light',
        attachments: ['streetlight_photo.jpg'],
        status: 'Under Review',
        assignedTo: 'Electrical Department'
      },
      {
        id: 'SUD-DEMO-002',
        reporterName: 'Priya Sharma',
        reporterPhone: '+91-9876543211',
        reporterEmail: 'priya.sharma@email.com',
        city: 'Sudarshan Village',
        completeAddress: 'House No. 45, Residential Area, Sudarshan Village, Pune - 411001',
        category: 'Public Services',
        subCategory: 'Water Supply',
        issueTitle: 'Irregular Water Supply',
        issueDescription: 'Water supply has been irregular for the past week. We are getting water only for 2 hours in the morning.',
        urgency: 'Medium',
        dateReported: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        expectedResolution: 'Ensure regular water supply as per schedule',
        attachments: [],
        status: 'In Progress',
        assignedTo: 'Water Department',
        adminNotes: 'Pump maintenance scheduled for tomorrow'
      },
      {
        id: 'SUD-DEMO-003',
        reporterName: 'Amit Patil',
        reporterPhone: '+91-9876543212',
        reporterEmail: 'amit.patil@email.com',
        city: 'Sudarshan Village',
        completeAddress: 'Shop No. 12, Market Area, Sudarshan Village, Pune - 411001',
        category: 'Environment',
        subCategory: 'Waste Management',
        issueTitle: 'Garbage Not Collected',
        issueDescription: 'Garbage has not been collected from our area for the past 4 days. It is creating hygiene issues and bad smell.',
        urgency: 'Critical',
        dateReported: new Date(now.getTime() - 4 * 60 * 60 * 1000), // 4 hours ago
        expectedResolution: 'Immediate garbage collection and regular schedule maintenance',
        attachments: ['garbage_pile.jpg'],
        status: 'Submitted'
      },
      {
        id: 'SUD-DEMO-004',
        reporterName: 'Sunita Desai',
        reporterPhone: '+91-9876543213',
        reporterEmail: 'sunita.desai@email.com',
        city: 'Sudarshan Village',
        completeAddress: 'Near School, Education Area, Sudarshan Village, Pune - 411001',
        category: 'Civic Issues',
        subCategory: 'Traffic Management',
        issueTitle: 'Traffic Congestion Near School',
        issueDescription: 'Heavy traffic congestion occurs near the school during pickup and drop-off times, causing safety issues for children.',
        urgency: 'Medium',
        dateReported: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        expectedResolution: 'Install traffic signals or assign traffic police during school hours',
        attachments: [],
        status: 'Resolved',
        assignedTo: 'Traffic Department',
        resolutionDate: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
        resolutionDetails: 'Traffic police has been assigned during school hours. Traffic cones installed for better flow.'
      }
    ];
  }
}

export default IssueReportsDatabase;
