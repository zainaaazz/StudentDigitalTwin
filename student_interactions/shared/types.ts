export interface Student {
  id: string;
  name: string;
  academicLevel: "undergraduate" | "postgraduate";
  major: string;
  currentGPA: number;
  riskLevel: "low" | "medium" | "high";
  personalityType: "extrovert" | "introvert" | "ambivert";
  participationScore: number; // 0-100
}

export interface InteractionEvent {
  id: string;
  sessionId: string;
  studentId1: string;
  studentId2: string;
  startTime: Date;
  endTime: Date;
  duration: number; // seconds
  avgDistance: number; // meters
  avgOrientationDiff: number; // degrees
  confidence: number; // 0-1
  interactionType: "discussion" | "collaboration" | "social" | "help-seeking";
  context: "lecture" | "group-work" | "break" | "lab";
}

export interface NetworkMetrics {
  timestamp: Date;
  totalStudents: number;
  totalInteractions: number;
  networkDensity: number;
  avgClusteringCoeff: number;
  numComponents: number;
  centralityScores: {
    [studentId: string]: {
      degree: number;
      betweenness: number;
      closeness: number;
      eigenvector: number;
    };
  };
}

export interface ClassSession {
  id: string;
  courseId: string;
  date: Date;
  duration: number; // minutes
  sessionType: "lecture" | "tutorial" | "lab" | "group-work";
  students: Student[];
  interactions: InteractionEvent[];
  networkMetrics: NetworkMetrics;
}

export interface StudentEngagementMetrics {
  studentId: string;
  sessionId: string;
  timestamp: Date;

  // Social engagement indicators
  interactionFrequency: number; // interactions per hour
  averageInteractionDuration: number; // seconds
  socialNetworkPosition: number; // centrality score 0-1

  // Behavioral patterns
  initiatesInteractions: boolean;
  respondsToInteractions: boolean;
  isolationRisk: number; // 0-1 scale

  // Predictive features for SDT
  collaborationScore: number; // 0-100
  helpSeekingBehavior: number; // 0-100
  peerInfluenceLevel: number; // 0-100

  // Academic correlation signals
  engagementTrend: "increasing" | "decreasing" | "stable";
  participationGap: number; // deviation from class average

  // Risk indicators
  academicRiskFlags: string[];
  socialRiskFlags: string[];
  overallRiskScore: number; // 0-100
}

export interface SessionParams {
  courseId: string;
  sessionType: "lecture" | "tutorial" | "lab" | "group-work";
  duration: number; // minutes
  studentIds: string[];
  parameters?: {
    interactionProbability?: number;
    extrovertBonus?: number;
    academicCorrelation?: number;
  };
}

export interface SimulationConfig {
  baseInteractionProbability: number;
  personalityFactors: {
    extrovert: number;
    introvert: number;
    ambivert: number;
  };
  contextFactors: {
    lecture: number;
    tutorial: number;
    lab: number;
    "group-work": number;
  };
  riskFactors: {
    high: number;
    medium: number;
    low: number;
  };
}

export interface RiskAssessment {
  studentId: string;
  currentRiskLevel: number; // 0-100
  riskFactors: string[];
  engagementTrend: "increasing" | "decreasing" | "stable";
  recommendations: string[];
  lastUpdated: Date;
}

export interface NetworkData {
  nodes: Array<{
    id: string;
    name: string;
    group: number;
    centrality: number;
    riskLevel: string;
  }>;
  links: Array<{
    source: string;
    target: string;
    weight: number;
    interactionType: string;
  }>;
  metrics: NetworkMetrics;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface WebSocketMessage {
  type: string;
  timestamp: Date;
  data: any;
}

export interface EngagementUpdate extends WebSocketMessage {
  type: "engagement_update";
  data: {
    studentId: string;
    sessionId: string;
    metrics: Partial<StudentEngagementMetrics>;
    flags: string[];
    trend: "increasing" | "decreasing" | "stable";
  };
}