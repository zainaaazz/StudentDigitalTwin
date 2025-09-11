// Dummy data for Student Analytics Dashboard

export const mockStudentProfile = {
  id: 'STU001',
  name: 'Alex Johnson',
  academicLevel: 'Junior',
  major: 'Computer Science',
  currentGPA: 3.67,
  riskLevel: 'medium',
  personalityType: 'Extroverted Learner',
  participationScore: 78
};

export const mockEngagementHistory = [
  {
    week: 'W1',
    date: new Date('2024-01-08'),
    interactionFrequency: 8.5,
    socialNetworkPosition: 0.72,
    collaborationScore: 85,
    overallRiskScore: 25,
    sessionCount: 5
  },
  {
    week: 'W2',
    date: new Date('2024-01-15'),
    interactionFrequency: 7.8,
    socialNetworkPosition: 0.68,
    collaborationScore: 82,
    overallRiskScore: 30,
    sessionCount: 4
  },
  {
    week: 'W3',
    date: new Date('2024-01-22'),
    interactionFrequency: 9.2,
    socialNetworkPosition: 0.75,
    collaborationScore: 88,
    overallRiskScore: 20,
    sessionCount: 6
  },
  {
    week: 'W4',
    date: new Date('2024-01-29'),
    interactionFrequency: 6.5,
    socialNetworkPosition: 0.61,
    collaborationScore: 75,
    overallRiskScore: 35,
    sessionCount: 3
  },
  {
    week: 'W5',
    date: new Date('2024-02-05'),
    interactionFrequency: 8.9,
    socialNetworkPosition: 0.73,
    collaborationScore: 86,
    overallRiskScore: 22,
    sessionCount: 5
  },
  {
    week: 'W6',
    date: new Date('2024-02-12'),
    interactionFrequency: 9.5,
    socialNetworkPosition: 0.78,
    collaborationScore: 91,
    overallRiskScore: 18,
    sessionCount: 6
  }
];

export const mockRecentInteractions = {
  totalInteractions: 127,
  averageDuration: 285, // seconds
  topInteractionPartners: [
    { studentId: 'STU015', name: 'Emma Davis', count: 23 },
    { studentId: 'STU032', name: 'Michael Chen', count: 18 },
    { studentId: 'STU007', name: 'Sarah Williams', count: 16 },
    { studentId: 'STU041', name: 'James Rodriguez', count: 14 },
    { studentId: 'STU028', name: 'Lisa Kim', count: 12 }
  ],
  interactionTypes: {
    discussion: 45,
    collaboration: 38,
    social: 28,
    'help-seeking': 16
  }
};

export const mockCurrentStats = {
  weeklyEngagement: 86,
  networkCentrality: 0.73,
  participationTrend: 'increasing',
  riskLevel: 'medium',
  lastActiveSession: new Date('2024-02-12T14:30:00'),
  sessionsThisWeek: 5
};

export const mockDashboardData = {
  student: mockStudentProfile,
  engagementHistory: mockEngagementHistory,
  recentInteractions: mockRecentInteractions,
  currentStats: mockCurrentStats,
  lastUpdated: new Date()
};

// Dummy interaction events for timeline
export const mockInteractionEvents = [
  {
    id: 'INT001',
    sessionId: 'SES123456',
    studentId1: 'STU001',
    studentId2: 'STU015',
    startTime: new Date('2024-02-12T10:15:00'),
    endTime: new Date('2024-02-12T10:23:00'),
    duration: 480,
    avgDistance: 1.2,
    avgOrientationDiff: 45,
    confidence: 0.92,
    interactionType: 'discussion',
    context: 'lecture'
  },
  {
    id: 'INT002',
    sessionId: 'SES123456',
    studentId1: 'STU001',
    studentId2: 'STU032',
    startTime: new Date('2024-02-12T11:30:00'),
    endTime: new Date('2024-02-12T11:37:00'),
    duration: 420,
    avgDistance: 0.8,
    avgOrientationDiff: 30,
    confidence: 0.87,
    interactionType: 'collaboration',
    context: 'group-work'
  },
  {
    id: 'INT003',
    sessionId: 'SES123457',
    studentId1: 'STU001',
    studentId2: 'STU007',
    startTime: new Date('2024-02-11T14:20:00'),
    endTime: new Date('2024-02-11T14:28:00'),
    duration: 480,
    avgDistance: 1.5,
    avgOrientationDiff: 60,
    confidence: 0.89,
    interactionType: 'help-seeking',
    context: 'lab'
  },
  {
    id: 'INT004',
    sessionId: 'SES123458',
    studentId1: 'STU001',
    studentId2: 'STU041',
    startTime: new Date('2024-02-11T12:45:00'),
    endTime: new Date('2024-02-11T12:52:00'),
    duration: 420,
    avgDistance: 1.1,
    avgOrientationDiff: 35,
    confidence: 0.94,
    interactionType: 'social',
    context: 'break'
  },
  {
    id: 'INT005',
    sessionId: 'SES123459',
    studentId1: 'STU001',
    studentId2: 'STU028',
    startTime: new Date('2024-02-10T15:10:00'),
    endTime: new Date('2024-02-10T15:18:00'),
    duration: 480,
    avgDistance: 0.9,
    avgOrientationDiff: 25,
    confidence: 0.91,
    interactionType: 'collaboration',
    context: 'group-work'
  }
];

export const mockInteractionStats = {
  totalInteractions: 127,
  dateRange: {
    start: new Date('2024-01-08'),
    end: new Date('2024-02-12')
  },
  averageDuration: 445,
  interactionsByType: {
    discussion: 45,
    collaboration: 38,
    social: 28,
    'help-seeking': 16
  },
  interactionsByContext: {
    lecture: 42,
    'group-work': 35,
    lab: 31,
    break: 19
  },
  uniquePartners: 28
};

export const mockInteractionData = {
  interactions: mockInteractionEvents,
  stats: mockInteractionStats,
  pagination: {
    total: 127,
    limit: 20,
    offset: 0,
    hasMore: true
  }
};