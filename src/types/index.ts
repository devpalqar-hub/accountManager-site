export interface User {
  id: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Account {
  id: string;
  accountName: string;
  accountHolderName: string;
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
  accountType?: string;
  openingBalance: number;
  currentBalance: number;
  isPrimary: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  title: string;
  clientDetails?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  status: string;
  budget?: number;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: User;
}

export interface WorkPackage {
  id: string;
  workPackageName: string;
  amount: number;
  projectId: string;
  version?: string;
  startDate?: string;
  completionDate?: string;
  advanceAmount?: number;
  miscellaneousAmount?: number;
  ongoingCost?: number;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD';
  description?: string;
  createdAt: string;
  updatedAt: string;
  project?: Project;
}

export interface Payment {
  id: string;
  amount: number;
  accountId: string;
  projectId: string;
  paymentDate: string;
  description?: string;
  transactionRef?: string;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  account?: Account;
  project?: Project;
  createdBy?: User;
}

export interface Expense {
  id: string;
  title: string;
  description: string;
  amount: number;
  expenseDate: string;
  reference?: string;
  accountId: string;
  projectId?: string;
  addedBy: string;
  createdAt: string;
  updatedAt: string;
  account?: Account;
  project?: Project;
  user?: User;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone?: string;
  designation?: string;
  joiningDate: string;
  monthlySalary: number;
  dailySalary: number;
  paidLeavesPerMonth: number;
  workingDays: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  leaves?: Leave[];
  compensatoryLeaves?: CompensatoryLeave[];
  salaryRecords?: SalaryRecord[];
  _count?: {
    leaves: number;
    compensatoryLeaves: number;
    salaryRecords: number;
  };
}

export interface Leave {
  id: string;
  employeeId: string;
  leaveDate: string;
  leaveType: 'FULL_DAY' | 'HALF_DAY';
  reason: string;
  isCompensatory: boolean;
  compensatoryReason?: string;
  createdAt: string;
  updatedAt: string;
  employee?: Employee;
}

export interface CompensatoryLeave {
  id: string;
  employeeId: string;
  reason: string;
  grantedDate: string;
  expiryDate: string;
  isUsed: boolean;
  usedDate?: string;
  createdAt: string;
  updatedAt: string;
  employee?: Employee;
}

export interface SalaryRecord {
  id: string;
  employeeId: string;
  month: number;
  year: number;
  workingDays: number;
  presentDays: number;
  halfDays: number;
  paidLeaves: number;
  unpaidLeaves: number;
  compensatoryLeaves: number;
  totalSalary: number;
  deductions: number;
  netSalary: number;
  isProcessed: boolean;
  processedDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  employee?: Employee;
}

export interface SalaryCalculation {
  employeeId: string;
  month: number;
  year: number;
  workingDays: number;
  presentDays: number;
  halfDays: number;
  paidLeaves: number;
  unpaidLeaves: number;
  compensatoryLeaves: number;
  dailySalary: number;
  totalSalary: number;
  deductions: number;
  netSalary: number;
}

export interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  totalAccounts: number;
  activeAccounts: number;
  recentPayments: Payment[];
  recentProjects: Project[];
}

export interface FinancialAnalytics {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  monthlyData: Array<{
    month: string;
    income: number;
    expense: number;
  }>;
}

export interface ProjectAnalytics {
  totalProjects: number;
  byStatus: Array<{
    status: string;
    count: number;
  }>;
  topProjects: Array<{
    id: string;
    title: string;
    totalPayments: number;
    totalWorkPackages: number;
  }>;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  statusCode?: number;
}

export interface LoginRequest {
  email: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface TransactionLog {
  id: string;
  transactionType: 'CREDIT' | 'DEBIT';
  amount: number;
  accountId: string;
  accountName: string;
  performedBy: string;
  performedByEmail: string;
  action: string;
  description?: string;
  referenceId?: string;
  referenceType?: string;
  projectId?: string;
  projectTitle?: string;
  createdAt: string;
}
