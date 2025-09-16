// Interaction Simulation Engine for Student Digital Twin
// Generates realistic student interaction data based on personality and academic patterns

class InteractionSimulator {
  constructor(studentId) {
    this.studentId = studentId;
    this.sessionKey = `interaction_simulation_${studentId}`;
    this.personalityTypes = ['extroverted', 'introverted', 'balanced'];
    this.interactionTypes = ['discussion', 'collaboration', 'social', 'help-seeking'];
    this.contextTypes = ['lecture', 'lab', 'group-work', 'break', 'study-session'];

    // Clear any cached data for fresh start
    this.cachedDashboardData = null;

    // Clear existing session data to regenerate with anonymous names
    if (sessionStorage.getItem(this.sessionKey)) {
      sessionStorage.removeItem(this.sessionKey);
    }

    // Initialize or load existing simulation
    this.initializeSimulation();
  }

  initializeSimulation() {
    // Check if simulation data already exists in session storage
    const existingData = sessionStorage.getItem(this.sessionKey);

    if (existingData) {
      const parsedData = JSON.parse(existingData);
      this.studentProfile = parsedData.studentProfile;
      this.interactionHistory = parsedData.interactionHistory;
      this.engagementHistory = parsedData.engagementHistory;
      this.networkMetrics = parsedData.networkMetrics;
      this.currentStats = parsedData.currentStats;
      this.sessionSeed = parsedData.sessionSeed;
    } else {
      // Generate new session seed for this login session
      this.sessionSeed = Date.now() + Math.random();
      // Generate new simulation data
      this.generateSimulation();
      this.saveSimulation();
    }
  }

  generateSimulation() {
    // Generate student profile based on student ID
    this.studentProfile = this.generateStudentProfile();

    // Generate 6 weeks of engagement history
    this.engagementHistory = this.generateEngagementHistory();

    // Generate interaction events (last 30 days)
    this.interactionHistory = this.generateInteractionHistory();

    // Calculate network metrics
    this.networkMetrics = this.calculateNetworkMetrics();

    // Calculate current stats
    this.currentStats = this.calculateCurrentStats();
  }

  generateStudentProfile() {
    const seed = this.hashCode(this.studentId + this.sessionSeed);
    const random = this.seededRandom(seed);

    const personalityType = this.personalityTypes[Math.floor(random() * this.personalityTypes.length)];
    const academicLevels = ['Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate'];
    const majors = ['Computer Science', 'Engineering', 'Business', 'Psychology', 'Biology', 'Mathematics'];
    const currentGPA = Math.round((2.5 + random() * 1.5) * 100) / 100;
    const participationScore = Math.floor(50 + random() * 50);

    // Determine risk level based on GPA and participation (without circular dependency)
    let riskLevel = 'low';
    if (currentGPA < 2.5 || participationScore < 60) {
      riskLevel = 'high';
    } else if (currentGPA < 3.0 || participationScore < 75) {
      riskLevel = 'medium';
    }

    return {
      id: this.studentId,
      name: this.generateAnonymousName(this.studentId, random),
      academicLevel: academicLevels[Math.floor(random() * academicLevels.length)],
      major: majors[Math.floor(random() * majors.length)],
      currentGPA: currentGPA,
      riskLevel: riskLevel,
      personalityType: personalityType,
      participationScore: participationScore
    };
  }

  generateEngagementHistory() {
    const weeks = 6;
    const history = [];
    const seed = this.hashCode(this.studentId + 'engagement' + this.sessionSeed);
    const random = this.seededRandom(seed);

    const baseFrequency = this.studentProfile.personalityType === 'extroverted' ? 9 :
                         this.studentProfile.personalityType === 'introverted' ? 6 : 7.5;

    for (let i = 0; i < weeks; i++) {
      const weekDate = new Date();
      weekDate.setDate(weekDate.getDate() - (weeks - i) * 7);

      const trend = Math.sin(i * 0.5) * 0.3; // Natural variation
      const noise = (random() - 0.5) * 2;

      history.push({
        week: `W${i + 1}`,
        date: weekDate,
        interactionFrequency: Math.max(1, baseFrequency + trend + noise),
        socialNetworkPosition: Math.max(0.1, Math.min(1, 0.5 + (random() - 0.5) * 0.4)),
        collaborationScore: Math.floor(60 + random() * 30 + (this.studentProfile.currentGPA - 2.5) * 20),
        overallRiskScore: Math.floor(10 + random() * 40),
        sessionCount: Math.floor(3 + random() * 4)
      });
    }

    return history;
  }

  generateInteractionHistory() {
    const interactions = [];
    const seed = this.hashCode(this.studentId + 'interactions' + this.sessionSeed);
    const random = this.seededRandom(seed);

    // Generate 20-50 interactions over the last 30 days
    const numInteractions = Math.floor(20 + random() * 30);

    // Generate pool of interaction partners
    const partners = this.generateInteractionPartners(random);

    for (let i = 0; i < numInteractions; i++) {
      const daysAgo = random() * 30;
      const interactionDate = new Date();
      interactionDate.setDate(interactionDate.getDate() - daysAgo);

      const partner = partners[Math.floor(random() * partners.length)];
      const interactionType = this.selectInteractionType(random);
      const context = this.contextTypes[Math.floor(random() * this.contextTypes.length)];

      // Duration varies by type and personality
      const baseDuration = this.getBaseDuration(interactionType, context);
      const personalityMultiplier = this.studentProfile.personalityType === 'extroverted' ? 1.3 :
                                   this.studentProfile.personalityType === 'introverted' ? 0.8 : 1.0;
      const duration = Math.floor(baseDuration * personalityMultiplier * (0.8 + random() * 0.4));

      const endTime = new Date(interactionDate.getTime() + duration * 1000);

      interactions.push({
        id: `INT${String(i + 1).padStart(3, '0')}`,
        sessionId: `SES${Math.floor(random() * 999999).toString().padStart(6, '0')}`,
        studentId1: this.studentId,
        studentId2: partner.studentId,
        partnerName: partner.name,
        startTime: interactionDate,
        endTime: endTime,
        duration: duration,
        avgDistance: Math.round((0.8 + random() * 1.2) * 10) / 10,
        avgOrientationDiff: Math.floor(15 + random() * 60),
        confidence: Math.round((0.8 + random() * 0.2) * 100) / 100,
        interactionType: interactionType,
        context: context
      });
    }

    // Sort by date (newest first)
    return interactions.sort((a, b) => b.startTime - a.startTime);
  }

  generateInteractionPartners(random) {
    const partners = [];
    const numPartners = Math.floor(8 + random() * 12);

    for (let i = 0; i < numPartners; i++) {
      const partnerId = `STU_${String(Math.floor(random() * 999) + 1).padStart(3, '0')}`;
      if (partnerId !== this.studentId) {
        partners.push({
          studentId: partnerId,
          name: this.generateStudentName(partnerId, random)
        });
      }
    }

    return partners;
  }

  generateAnonymousName(studentId, random) {
    // Generate anonymous identifier for POPIA compliance
    // Use consistent anonymous naming: Student A, Student B, etc.
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const letterIndex = Math.floor(random() * letters.length);
    const number = Math.floor(random() * 99) + 1;

    return `Student ${letters[letterIndex]}${number.toString().padStart(2, '0')}`;
  }

  generateStudentName(studentId, random) {
    // Alias for backward compatibility
    return this.generateAnonymousName(studentId, random);
  }

  selectInteractionType(random) {
    // Weight interaction types based on personality
    let weights;
    if (this.studentProfile.personalityType === 'extroverted') {
      weights = { discussion: 0.4, collaboration: 0.3, social: 0.2, 'help-seeking': 0.1 };
    } else if (this.studentProfile.personalityType === 'introverted') {
      weights = { discussion: 0.2, collaboration: 0.4, social: 0.1, 'help-seeking': 0.3 };
    } else {
      weights = { discussion: 0.3, collaboration: 0.35, social: 0.2, 'help-seeking': 0.15 };
    }

    const rand = random();
    let cumulative = 0;

    for (const [type, weight] of Object.entries(weights)) {
      cumulative += weight;
      if (rand <= cumulative) {
        return type;
      }
    }

    return 'discussion';
  }

  getBaseDuration(interactionType, context) {
    const durations = {
      discussion: { lecture: 300, lab: 450, 'group-work': 600, break: 180, 'study-session': 480 },
      collaboration: { lecture: 240, lab: 720, 'group-work': 900, break: 150, 'study-session': 840 },
      social: { lecture: 120, lab: 180, 'group-work': 240, break: 300, 'study-session': 200 },
      'help-seeking': { lecture: 180, lab: 360, 'group-work': 420, break: 240, 'study-session': 480 }
    };

    return durations[interactionType]?.[context] || 300;
  }

  calculateNetworkMetrics() {
    // Calculate interaction frequency with different partners
    const partnerCounts = {};
    this.interactionHistory.forEach(interaction => {
      const partner = interaction.studentId2;
      partnerCounts[partner] = (partnerCounts[partner] || 0) + 1;
    });

    // Get top interaction partners
    const topPartners = Object.entries(partnerCounts)
      .map(([studentId, count]) => {
        const interaction = this.interactionHistory.find(i => i.studentId2 === studentId);
        return {
          studentId,
          name: interaction?.partnerName || `Student ${studentId}`,
          count
        };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Calculate interaction type distribution
    const typeDistribution = {};
    this.interactionTypes.forEach(type => {
      typeDistribution[type] = this.interactionHistory.filter(i => i.interactionType === type).length;
    });

    return {
      totalInteractions: this.interactionHistory.length,
      averageDuration: Math.floor(this.interactionHistory.reduce((sum, i) => sum + i.duration, 0) / this.interactionHistory.length),
      topInteractionPartners: topPartners,
      interactionTypes: typeDistribution
    };
  }

  calculateCurrentStats() {
    const recentInteractions = this.interactionHistory.filter(i => {
      const daysSince = (new Date() - i.startTime) / (1000 * 60 * 60 * 24);
      return daysSince <= 7;
    });

    const weeklyInteractions = recentInteractions.length;
    const gpa = this.studentProfile.currentGPA;
    const participationScore = this.studentProfile.participationScore;

    // Calculate risk score (replicated here to avoid circular dependency)
    let riskScore = 0;
    if (weeklyInteractions < 3) riskScore += 30;
    else if (weeklyInteractions < 6) riskScore += 15;
    if (gpa < 2.5) riskScore += 25;
    else if (gpa < 3.0) riskScore += 15;
    if (participationScore < 60) riskScore += 20;
    else if (participationScore < 75) riskScore += 10;
    riskScore = Math.min(100, riskScore);

    // Calculate trend based on recent vs older interactions
    const olderInteractions = this.interactionHistory.filter(i => {
      const daysSince = (new Date() - i.startTime) / (1000 * 60 * 60 * 24);
      return daysSince > 7 && daysSince <= 14;
    });

    let participationTrend = 'stable';
    if (weeklyInteractions > olderInteractions.length) {
      participationTrend = 'increasing';
    } else if (weeklyInteractions < olderInteractions.length) {
      participationTrend = 'decreasing';
    }

    // Calculate weekly engagement percentage (0-100)
    const maxPossibleInteractions = 20; // Assume max 20 interactions per week
    const weeklyEngagement = Math.min(100, Math.round((weeklyInteractions / maxPossibleInteractions) * 100));

    // Calculate network centrality (0-1) based on interaction diversity
    const totalUniquePartners = new Set(this.interactionHistory.map(i => i.studentId2)).size;
    const maxPossiblePartners = 25; // Assume class of ~25 students
    const networkCentrality = Math.min(1, totalUniquePartners / maxPossiblePartners);

    return {
      weeklyInteractions: weeklyInteractions,
      weeklyDuration: recentInteractions.reduce((sum, i) => sum + i.duration, 0),
      averageConfidence: Math.round(this.interactionHistory.reduce((sum, i) => sum + i.confidence, 0) / this.interactionHistory.length * 100) / 100,
      uniquePartners: totalUniquePartners,
      riskScore: riskScore,
      // Additional properties expected by the dashboard
      weeklyEngagement: weeklyEngagement,
      networkCentrality: networkCentrality,
      participationTrend: participationTrend,
      riskLevel: this.studentProfile.riskLevel,
      lastActiveSession: this.interactionHistory.length > 0 ? this.interactionHistory[0].endTime : new Date(),
      sessionsThisWeek: Math.floor(weeklyInteractions / 3) // Estimate sessions from interactions
    };
  }

  calculateRiskScore() {
    const weeklyInteractions = this.currentStats?.weeklyInteractions || 0;
    const gpa = this.studentProfile.currentGPA;
    const participationScore = this.studentProfile.participationScore;

    // Lower interactions, lower GPA, lower participation = higher risk
    let riskScore = 0;

    if (weeklyInteractions < 3) riskScore += 30;
    else if (weeklyInteractions < 6) riskScore += 15;

    if (gpa < 2.5) riskScore += 25;
    else if (gpa < 3.0) riskScore += 15;

    if (participationScore < 60) riskScore += 20;
    else if (participationScore < 75) riskScore += 10;

    return Math.min(100, riskScore);
  }


  // Utility functions for deterministic randomness
  hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }

  seededRandom(seed) {
    let currentSeed = seed;
    return function() {
      currentSeed = (currentSeed * 9301 + 49297) % 233280;
      return currentSeed / 233280;
    };
  }

  saveSimulation() {
    const simulationData = {
      studentProfile: this.studentProfile,
      interactionHistory: this.interactionHistory,
      engagementHistory: this.engagementHistory,
      networkMetrics: this.networkMetrics,
      currentStats: this.currentStats,
      sessionSeed: this.sessionSeed,
      generatedAt: new Date().toISOString()
    };

    sessionStorage.setItem(this.sessionKey, JSON.stringify(simulationData));
  }

  // Public methods to get simulated data
  getStudentProfile() {
    return this.studentProfile;
  }

  getEngagementHistory() {
    return this.engagementHistory;
  }

  getInteractionHistory() {
    return this.interactionHistory;
  }

  getNetworkMetrics() {
    return this.networkMetrics;
  }

  getCurrentStats() {
    return this.currentStats;
  }

  getDashboardData() {
    // Use cached data structure to prevent re-renders from Date objects
    if (!this.cachedDashboardData) {
      this.cachedDashboardData = {
        student: this.studentProfile,
        engagementHistory: this.engagementHistory,
        recentInteractions: this.networkMetrics,
        currentStats: this.currentStats,
        lastUpdated: new Date()
      };
    }
    return this.cachedDashboardData;
  }

  // Clear simulation (for logout)
  clearSimulation() {
    sessionStorage.removeItem(this.sessionKey);
    // Clear cached data to ensure fresh data for new login
    this.cachedDashboardData = null;
  }
}

export default InteractionSimulator;