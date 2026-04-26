/* ─── Rich State Data for GeoView ─── */

export interface StatePlan {
  id: string;
  name: string;
  ministry: string;
  amount: number;
  status: 'approved' | 'pending' | 'in-review';
  date: string;
}

export interface StateBudgetBreakdown {
  sector: string;
  allocated: number;
  spent: number;
  color: string;
}

export interface StateAnalytics {
  gdpGrowth: number;
  employmentRate: number;
  literacyRate: number;
  healthIndex: number;
  infraScore: number;
  digitalPenetration: number;
}

export interface StateDetail {
  name: string;
  pos: [number, number, number];
  size: number;
  heat: number;
  budget: number;
  population: string;
  capital: string;
  districts: number;
  analytics: StateAnalytics;
  budgetBreakdown: StateBudgetBreakdown[];
  approvedPlans: StatePlan[];
}

export const stateDetails: StateDetail[] = [
  {
    name: 'Maharashtra', pos: [-1.2, -0.8, 0], size: 0.22, heat: 0.9, budget: 4200,
    population: '12.5 Cr', capital: 'Mumbai', districts: 36,
    analytics: { gdpGrowth: 7.2, employmentRate: 68, literacyRate: 84, healthIndex: 78, infraScore: 85, digitalPenetration: 72 },
    budgetBreakdown: [
      { sector: 'Infrastructure', allocated: 1200, spent: 1080, color: '#ff6b00' },
      { sector: 'Education', allocated: 850, spent: 720, color: '#1a73e8' },
      { sector: 'Healthcare', allocated: 780, spent: 690, color: '#00c853' },
      { sector: 'Agriculture', allocated: 620, spent: 510, color: '#ffc107' },
      { sector: 'IT & Digital', allocated: 450, spent: 400, color: '#9c27b0' },
      { sector: 'Defence & Security', allocated: 300, spent: 280, color: '#ff1744' },
    ],
    approvedPlans: [
      { id: 'MH-01', name: 'Mumbai Metro Phase IV', ministry: 'Urban Development', amount: 520, status: 'approved', date: '2025-03-15' },
      { id: 'MH-02', name: 'Pune Smart City Expansion', ministry: 'IT & Electronics', amount: 340, status: 'approved', date: '2025-02-28' },
      { id: 'MH-03', name: 'Vidarbha Irrigation Project', ministry: 'Agriculture', amount: 280, status: 'in-review', date: '2025-04-01' },
      { id: 'MH-04', name: 'Nagpur Health Corridor', ministry: 'Health', amount: 190, status: 'approved', date: '2025-01-20' },
      { id: 'MH-05', name: 'Rural Electrification Drive', ministry: 'Power', amount: 150, status: 'pending', date: '2025-04-10' },
    ],
  },
  {
    name: 'Uttar Pradesh', pos: [0.2, 1.2, 0], size: 0.28, heat: 0.65, budget: 5100,
    population: '23.1 Cr', capital: 'Lucknow', districts: 75,
    analytics: { gdpGrowth: 5.8, employmentRate: 52, literacyRate: 73, healthIndex: 58, infraScore: 55, digitalPenetration: 45 },
    budgetBreakdown: [
      { sector: 'Infrastructure', allocated: 1500, spent: 980, color: '#ff6b00' },
      { sector: 'Education', allocated: 1100, spent: 740, color: '#1a73e8' },
      { sector: 'Healthcare', allocated: 900, spent: 580, color: '#00c853' },
      { sector: 'Agriculture', allocated: 800, spent: 520, color: '#ffc107' },
      { sector: 'IT & Digital', allocated: 400, spent: 210, color: '#9c27b0' },
      { sector: 'Rural Dev', allocated: 400, spent: 300, color: '#ff1744' },
    ],
    approvedPlans: [
      { id: 'UP-01', name: 'Expressway Network Phase II', ministry: 'Transport', amount: 680, status: 'approved', date: '2025-03-01' },
      { id: 'UP-02', name: 'Primary School Modernization', ministry: 'Education', amount: 420, status: 'approved', date: '2025-02-15' },
      { id: 'UP-03', name: 'Bundelkhand Water Project', ministry: 'Jal Shakti', amount: 350, status: 'in-review', date: '2025-03-20' },
      { id: 'UP-04', name: 'Varanasi Heritage Corridor', ministry: 'Culture', amount: 180, status: 'approved', date: '2025-01-10' },
    ],
  },
  {
    name: 'Tamil Nadu', pos: [-0.6, -2.0, 0], size: 0.18, heat: 0.95, budget: 2800,
    population: '7.7 Cr', capital: 'Chennai', districts: 38,
    analytics: { gdpGrowth: 8.1, employmentRate: 72, literacyRate: 82, healthIndex: 82, infraScore: 80, digitalPenetration: 68 },
    budgetBreakdown: [
      { sector: 'Infrastructure', allocated: 800, spent: 760, color: '#ff6b00' },
      { sector: 'Education', allocated: 600, spent: 570, color: '#1a73e8' },
      { sector: 'Healthcare', allocated: 520, spent: 500, color: '#00c853' },
      { sector: 'Agriculture', allocated: 380, spent: 350, color: '#ffc107' },
      { sector: 'IT & Digital', allocated: 300, spent: 290, color: '#9c27b0' },
      { sector: 'Social Welfare', allocated: 200, spent: 185, color: '#ff1744' },
    ],
    approvedPlans: [
      { id: 'TN-01', name: 'Chennai Desalination Plant III', ministry: 'Jal Shakti', amount: 380, status: 'approved', date: '2025-03-08' },
      { id: 'TN-02', name: 'Coimbatore Tech Park', ministry: 'IT & Electronics', amount: 260, status: 'approved', date: '2025-02-20' },
      { id: 'TN-03', name: 'Delta Flood Mitigation', ministry: 'Agriculture', amount: 190, status: 'approved', date: '2025-01-25' },
    ],
  },
  {
    name: 'Karnataka', pos: [-1.0, -1.4, 0], size: 0.17, heat: 0.88, budget: 2400,
    population: '6.7 Cr', capital: 'Bengaluru', districts: 31,
    analytics: { gdpGrowth: 7.8, employmentRate: 70, literacyRate: 78, healthIndex: 74, infraScore: 78, digitalPenetration: 75 },
    budgetBreakdown: [
      { sector: 'Infrastructure', allocated: 700, spent: 620, color: '#ff6b00' },
      { sector: 'Education', allocated: 480, spent: 430, color: '#1a73e8' },
      { sector: 'Healthcare', allocated: 420, spent: 370, color: '#00c853' },
      { sector: 'IT & Digital', allocated: 400, spent: 380, color: '#9c27b0' },
      { sector: 'Agriculture', allocated: 250, spent: 200, color: '#ffc107' },
      { sector: 'Rural Dev', allocated: 150, spent: 120, color: '#ff1744' },
    ],
    approvedPlans: [
      { id: 'KA-01', name: 'Bengaluru Suburban Rail', ministry: 'Railways', amount: 450, status: 'approved', date: '2025-03-12' },
      { id: 'KA-02', name: 'AI Research Hub', ministry: 'IT & Electronics', amount: 220, status: 'approved', date: '2025-02-05' },
      { id: 'KA-03', name: 'Cauvery Water Mgmt', ministry: 'Jal Shakti', amount: 180, status: 'in-review', date: '2025-04-05' },
    ],
  },
  {
    name: 'Bihar', pos: [1.0, 1.0, 0], size: 0.2, heat: 0.55, budget: 3200,
    population: '12.4 Cr', capital: 'Patna', districts: 38,
    analytics: { gdpGrowth: 4.2, employmentRate: 42, literacyRate: 65, healthIndex: 48, infraScore: 38, digitalPenetration: 32 },
    budgetBreakdown: [
      { sector: 'Infrastructure', allocated: 950, spent: 520, color: '#ff6b00' },
      { sector: 'Education', allocated: 780, spent: 430, color: '#1a73e8' },
      { sector: 'Healthcare', allocated: 600, spent: 330, color: '#00c853' },
      { sector: 'Agriculture', allocated: 480, spent: 260, color: '#ffc107' },
      { sector: 'Rural Dev', allocated: 250, spent: 140, color: '#9c27b0' },
      { sector: 'Social Welfare', allocated: 140, spent: 75, color: '#ff1744' },
    ],
    approvedPlans: [
      { id: 'BR-01', name: 'Ganga Bridge Network', ministry: 'Transport', amount: 520, status: 'approved', date: '2025-03-18' },
      { id: 'BR-02', name: 'Flood Relief Infrastructure', ministry: 'Home Affairs', amount: 310, status: 'approved', date: '2025-01-30' },
      { id: 'BR-03', name: 'District Hospital Upgrade', ministry: 'Health', amount: 240, status: 'pending', date: '2025-04-08' },
    ],
  },
  {
    name: 'Rajasthan', pos: [-1.2, 0.8, 0], size: 0.24, heat: 0.78, budget: 2600,
    population: '7.9 Cr', capital: 'Jaipur', districts: 33,
    analytics: { gdpGrowth: 6.1, employmentRate: 58, literacyRate: 70, healthIndex: 62, infraScore: 60, digitalPenetration: 48 },
    budgetBreakdown: [
      { sector: 'Infrastructure', allocated: 750, spent: 580, color: '#ff6b00' },
      { sector: 'Education', allocated: 520, spent: 410, color: '#1a73e8' },
      { sector: 'Healthcare', allocated: 450, spent: 350, color: '#00c853' },
      { sector: 'Agriculture', allocated: 400, spent: 310, color: '#ffc107' },
      { sector: 'Tourism', allocated: 280, spent: 230, color: '#9c27b0' },
      { sector: 'Solar Energy', allocated: 200, spent: 180, color: '#ff1744' },
    ],
    approvedPlans: [
      { id: 'RJ-01', name: 'Solar Park Expansion', ministry: 'New & Renewable Energy', amount: 380, status: 'approved', date: '2025-02-22' },
      { id: 'RJ-02', name: 'Desert Water Pipeline', ministry: 'Jal Shakti', amount: 290, status: 'approved', date: '2025-03-05' },
      { id: 'RJ-03', name: 'Heritage Tourism Circuit', ministry: 'Tourism', amount: 150, status: 'in-review', date: '2025-04-02' },
    ],
  },
  {
    name: 'W. Bengal', pos: [1.6, 0.5, 0], size: 0.18, heat: 0.72, budget: 2900,
    population: '9.9 Cr', capital: 'Kolkata', districts: 23,
    analytics: { gdpGrowth: 5.5, employmentRate: 55, literacyRate: 78, healthIndex: 64, infraScore: 58, digitalPenetration: 50 },
    budgetBreakdown: [
      { sector: 'Infrastructure', allocated: 820, spent: 590, color: '#ff6b00' },
      { sector: 'Education', allocated: 650, spent: 470, color: '#1a73e8' },
      { sector: 'Healthcare', allocated: 520, spent: 375, color: '#00c853' },
      { sector: 'Agriculture', allocated: 450, spent: 324, color: '#ffc107' },
      { sector: 'IT & Digital', allocated: 280, spent: 202, color: '#9c27b0' },
      { sector: 'Social Welfare', allocated: 180, spent: 130, color: '#ff1744' },
    ],
    approvedPlans: [
      { id: 'WB-01', name: 'Kolkata East-West Metro', ministry: 'Railways', amount: 420, status: 'approved', date: '2025-02-10' },
      { id: 'WB-02', name: 'Sundarbans Eco Restoration', ministry: 'Environment', amount: 180, status: 'approved', date: '2025-03-25' },
    ],
  },
  {
    name: 'Gujarat', pos: [-2.0, 0.2, 0], size: 0.2, heat: 0.85, budget: 2200,
    population: '6.4 Cr', capital: 'Gandhinagar', districts: 33,
    analytics: { gdpGrowth: 7.5, employmentRate: 66, literacyRate: 80, healthIndex: 72, infraScore: 82, digitalPenetration: 65 },
    budgetBreakdown: [
      { sector: 'Infrastructure', allocated: 650, spent: 555, color: '#ff6b00' },
      { sector: 'Education', allocated: 400, spent: 340, color: '#1a73e8' },
      { sector: 'Healthcare', allocated: 350, spent: 298, color: '#00c853' },
      { sector: 'Industry', allocated: 380, spent: 330, color: '#ffc107' },
      { sector: 'IT & Digital', allocated: 250, spent: 215, color: '#9c27b0' },
      { sector: 'Ports & Shipping', allocated: 170, spent: 150, color: '#ff1744' },
    ],
    approvedPlans: [
      { id: 'GJ-01', name: 'GIFT City Phase III', ministry: 'Finance', amount: 350, status: 'approved', date: '2025-03-10' },
      { id: 'GJ-02', name: 'Renewable Energy Grid', ministry: 'Power', amount: 280, status: 'approved', date: '2025-02-18' },
      { id: 'GJ-03', name: 'Kutch Industrial Zone', ministry: 'Commerce', amount: 200, status: 'in-review', date: '2025-04-12' },
    ],
  },
  {
    name: 'Madhya Pradesh', pos: [-0.4, 0.4, 0], size: 0.25, heat: 0.62, budget: 3000,
    population: '8.5 Cr', capital: 'Bhopal', districts: 52,
    analytics: { gdpGrowth: 5.0, employmentRate: 50, literacyRate: 72, healthIndex: 56, infraScore: 50, digitalPenetration: 40 },
    budgetBreakdown: [
      { sector: 'Infrastructure', allocated: 880, spent: 545, color: '#ff6b00' },
      { sector: 'Education', allocated: 680, spent: 420, color: '#1a73e8' },
      { sector: 'Healthcare', allocated: 550, spent: 340, color: '#00c853' },
      { sector: 'Agriculture', allocated: 480, spent: 298, color: '#ffc107' },
      { sector: 'Tribal Welfare', allocated: 250, spent: 155, color: '#9c27b0' },
      { sector: 'Tourism', allocated: 160, spent: 100, color: '#ff1744' },
    ],
    approvedPlans: [
      { id: 'MP-01', name: 'Ken-Betwa River Link', ministry: 'Jal Shakti', amount: 440, status: 'approved', date: '2025-01-15' },
      { id: 'MP-02', name: 'Tribal Area Road Network', ministry: 'Rural Development', amount: 280, status: 'approved', date: '2025-03-22' },
    ],
  },
  {
    name: 'Kerala', pos: [-0.8, -2.4, 0], size: 0.12, heat: 0.92, budget: 1500,
    population: '3.5 Cr', capital: 'Thiruvananthapuram', districts: 14,
    analytics: { gdpGrowth: 6.8, employmentRate: 62, literacyRate: 96, healthIndex: 88, infraScore: 75, digitalPenetration: 78 },
    budgetBreakdown: [
      { sector: 'Infrastructure', allocated: 400, spent: 370, color: '#ff6b00' },
      { sector: 'Education', allocated: 320, spent: 300, color: '#1a73e8' },
      { sector: 'Healthcare', allocated: 300, spent: 280, color: '#00c853' },
      { sector: 'IT & Digital', allocated: 220, spent: 205, color: '#9c27b0' },
      { sector: 'Tourism', allocated: 160, spent: 145, color: '#ffc107' },
      { sector: 'Flood Mgmt', allocated: 100, spent: 92, color: '#ff1744' },
    ],
    approvedPlans: [
      { id: 'KL-01', name: 'SilverLine Semi-HSR', ministry: 'Railways', amount: 580, status: 'in-review', date: '2025-04-01' },
      { id: 'KL-02', name: 'Kochi Water Metro Phase II', ministry: 'Urban Development', amount: 190, status: 'approved', date: '2025-02-12' },
      { id: 'KL-03', name: 'Digital Literacy Mission', ministry: 'Education', amount: 120, status: 'approved', date: '2025-03-28' },
    ],
  },
  {
    name: 'Punjab', pos: [-0.6, 2.0, 0], size: 0.14, heat: 0.82, budget: 1800,
    population: '3.1 Cr', capital: 'Chandigarh', districts: 23,
    analytics: { gdpGrowth: 5.9, employmentRate: 60, literacyRate: 77, healthIndex: 70, infraScore: 68, digitalPenetration: 55 },
    budgetBreakdown: [
      { sector: 'Infrastructure', allocated: 500, spent: 410, color: '#ff6b00' },
      { sector: 'Education', allocated: 350, spent: 288, color: '#1a73e8' },
      { sector: 'Healthcare', allocated: 320, spent: 263, color: '#00c853' },
      { sector: 'Agriculture', allocated: 350, spent: 290, color: '#ffc107' },
      { sector: 'Industry', allocated: 180, spent: 148, color: '#9c27b0' },
      { sector: 'Social Welfare', allocated: 100, spent: 82, color: '#ff1744' },
    ],
    approvedPlans: [
      { id: 'PB-01', name: 'Stubble Management Program', ministry: 'Agriculture', amount: 220, status: 'approved', date: '2025-02-25' },
      { id: 'PB-02', name: 'Amritsar Smart City', ministry: 'Urban Development', amount: 180, status: 'approved', date: '2025-03-15' },
    ],
  },
  {
    name: 'Telangana', pos: [-0.4, -1.2, 0], size: 0.16, heat: 0.87, budget: 2000,
    population: '3.9 Cr', capital: 'Hyderabad', districts: 33,
    analytics: { gdpGrowth: 7.6, employmentRate: 65, literacyRate: 72, healthIndex: 70, infraScore: 76, digitalPenetration: 70 },
    budgetBreakdown: [
      { sector: 'Infrastructure', allocated: 580, spent: 505, color: '#ff6b00' },
      { sector: 'Education', allocated: 380, spent: 330, color: '#1a73e8' },
      { sector: 'Healthcare', allocated: 340, spent: 296, color: '#00c853' },
      { sector: 'IT & Digital', allocated: 350, spent: 310, color: '#9c27b0' },
      { sector: 'Agriculture', allocated: 220, spent: 190, color: '#ffc107' },
      { sector: 'Irrigation', allocated: 130, spent: 113, color: '#ff1744' },
    ],
    approvedPlans: [
      { id: 'TS-01', name: 'Hyderabad Pharma City', ministry: 'Commerce', amount: 320, status: 'approved', date: '2025-03-02' },
      { id: 'TS-02', name: 'Kaleshwaram Lift Irrigation', ministry: 'Jal Shakti', amount: 480, status: 'approved', date: '2025-01-18' },
    ],
  },
  {
    name: 'Delhi', pos: [0.0, 1.6, 0], size: 0.1, heat: 0.93, budget: 800,
    population: '2.1 Cr', capital: 'New Delhi', districts: 11,
    analytics: { gdpGrowth: 8.5, employmentRate: 74, literacyRate: 88, healthIndex: 76, infraScore: 88, digitalPenetration: 85 },
    budgetBreakdown: [
      { sector: 'Infrastructure', allocated: 250, spent: 233, color: '#ff6b00' },
      { sector: 'Education', allocated: 150, spent: 140, color: '#1a73e8' },
      { sector: 'Healthcare', allocated: 140, spent: 130, color: '#00c853' },
      { sector: 'Transport', allocated: 130, spent: 122, color: '#ffc107' },
      { sector: 'Environment', allocated: 80, spent: 72, color: '#9c27b0' },
      { sector: 'Smart City', allocated: 50, spent: 47, color: '#ff1744' },
    ],
    approvedPlans: [
      { id: 'DL-01', name: 'Delhi Metro Phase V', ministry: 'Urban Development', amount: 380, status: 'approved', date: '2025-03-20' },
      { id: 'DL-02', name: 'Air Quality Mission', ministry: 'Environment', amount: 150, status: 'approved', date: '2025-02-08' },
      { id: 'DL-03', name: 'Yamuna Rejuvenation', ministry: 'Jal Shakti', amount: 220, status: 'in-review', date: '2025-04-15' },
    ],
  },
  {
    name: 'Odisha', pos: [1.0, -0.2, 0], size: 0.18, heat: 0.58, budget: 2100,
    population: '4.6 Cr', capital: 'Bhubaneswar', districts: 30,
    analytics: { gdpGrowth: 4.8, employmentRate: 48, literacyRate: 74, healthIndex: 52, infraScore: 48, digitalPenetration: 38 },
    budgetBreakdown: [
      { sector: 'Infrastructure', allocated: 620, spent: 360, color: '#ff6b00' },
      { sector: 'Education', allocated: 450, spent: 260, color: '#1a73e8' },
      { sector: 'Healthcare', allocated: 380, spent: 220, color: '#00c853' },
      { sector: 'Agriculture', allocated: 320, spent: 186, color: '#ffc107' },
      { sector: 'Tribal Welfare', allocated: 200, spent: 116, color: '#9c27b0' },
      { sector: 'Disaster Mgmt', allocated: 130, spent: 76, color: '#ff1744' },
    ],
    approvedPlans: [
      { id: 'OR-01', name: 'Cyclone Resilience Infra', ministry: 'Home Affairs', amount: 280, status: 'approved', date: '2025-02-28' },
      { id: 'OR-02', name: 'Tribal Education Centers', ministry: 'Education', amount: 160, status: 'approved', date: '2025-03-12' },
    ],
  },
  {
    name: 'Assam', pos: [2.4, 1.2, 0], size: 0.15, heat: 0.52, budget: 1600,
    population: '3.5 Cr', capital: 'Dispur', districts: 35,
    analytics: { gdpGrowth: 3.8, employmentRate: 44, literacyRate: 74, healthIndex: 50, infraScore: 42, digitalPenetration: 35 },
    budgetBreakdown: [
      { sector: 'Infrastructure', allocated: 480, spent: 250, color: '#ff6b00' },
      { sector: 'Education', allocated: 350, spent: 182, color: '#1a73e8' },
      { sector: 'Healthcare', allocated: 290, spent: 151, color: '#00c853' },
      { sector: 'Agriculture', allocated: 240, spent: 125, color: '#ffc107' },
      { sector: 'Flood Mgmt', allocated: 150, spent: 78, color: '#9c27b0' },
      { sector: 'Tea Industry', allocated: 90, spent: 47, color: '#ff1744' },
    ],
    approvedPlans: [
      { id: 'AS-01', name: 'Brahmaputra Flood Shield', ministry: 'Jal Shakti', amount: 350, status: 'approved', date: '2025-01-22' },
      { id: 'AS-02', name: 'NE Connectivity Roads', ministry: 'DoNER', amount: 220, status: 'in-review', date: '2025-03-30' },
    ],
  },
];
