import { apiClient } from '@/lib/api-client';
import {
  LoginRequest,
  VerifyOtpRequest,
  AuthResponse,
  User,
  Account,
  Project,
  WorkPackage,
  Payment,
  Expense,
  DashboardStats,
  FinancialAnalytics,
  ProjectAnalytics,
  Employee,
  Leave,
  CompensatoryLeave,
  SalaryRecord,
  SalaryCalculation,
} from '@/types';

// ==================== AUTH APIs ====================
export const authApi = {
  sendOtp: (data: LoginRequest) => 
    apiClient.post('/auth/send-otp', data),
  
  verifyOtp: (data: VerifyOtpRequest) => 
    apiClient.post<AuthResponse>('/auth/verify-otp', data),
};

// ==================== USER APIs ====================
export const userApi = {
  getAll: () => 
    apiClient.get<User[]>('/users'),
  
  getById: (id: string) => 
    apiClient.get<User>(`/users/${id}`),
  
  create: (data: { email: string }) => 
    apiClient.post<User>('/users', data),
  
  update: (id: string, data: Partial<User>) => 
    apiClient.patch<User>(`/users/${id}`, data),
  
  delete: (id: string) => 
    apiClient.delete(`/users/${id}`),
};

// ==================== ACCOUNT APIs ====================
export const accountApi = {
  getAll: () => 
    apiClient.get<Account[]>('/accounts'),
  
  getById: (id: string) => 
    apiClient.get<Account>(`/accounts/${id}`),
  
  getBalance: (id: string) => 
    apiClient.get<{ currentBalance: number; openingBalance: number }>(`/accounts/${id}/balance`),
  
  create: (data: Partial<Account>) => 
    apiClient.post<Account>('/accounts', data),
  
  update: (id: string, data: Partial<Account>) => 
    apiClient.patch<Account>(`/accounts/${id}`, data),
  
  delete: (id: string) => 
    apiClient.delete(`/accounts/${id}`),
};

// ==================== PROJECT APIs ====================
export const projectApi = {
  getAll: () => 
    apiClient.get<Project[]>('/projects'),
  
  getMyProjects: () => 
    apiClient.get<Project[]>('/projects/my-projects'),
  
  getById: (id: string) => 
    apiClient.get<Project>(`/projects/${id}`),
  
  create: (data: Partial<Project>) => 
    apiClient.post<Project>('/projects', data),
  
  update: (id: string, data: Partial<Project>) => 
    apiClient.patch<Project>(`/projects/${id}`, data),
  
  delete: (id: string) => 
    apiClient.delete(`/projects/${id}`),
};

// ==================== WORK PACKAGE APIs ====================
export const workPackageApi = {
  getAll: () => 
    apiClient.get<WorkPackage[]>('/work-packages'),
  
  getById: (id: string) => 
    apiClient.get<WorkPackage>(`/work-packages/${id}`),
  
  getByProject: (projectId: string) => 
    apiClient.get<WorkPackage[]>(`/work-packages/project/${projectId}`),
  
  getStats: (projectId: string) => 
    apiClient.get(`/work-packages/project/${projectId}/stats`),
  
  create: (data: Partial<WorkPackage>) => 
    apiClient.post<WorkPackage>('/work-packages', data),
  
  update: (id: string, data: Partial<WorkPackage>) => 
    apiClient.patch<WorkPackage>(`/work-packages/${id}`, data),
  
  delete: (id: string) => 
    apiClient.delete(`/work-packages/${id}`),
};

// ==================== PAYMENT APIs ====================
export const paymentApi = {
  getAll: () => 
    apiClient.get<Payment[]>('/payments'),
  
  getById: (id: string) => 
    apiClient.get<Payment>(`/payments/${id}`),
  
  getByProject: (projectId: string) => 
    apiClient.get<Payment[]>(`/payments/project/${projectId}`),
  
  getByAccount: (accountId: string) => 
    apiClient.get<Payment[]>(`/payments/account/${accountId}`),
  
  getProjectSummary: (projectId: string) => 
    apiClient.get(`/payments/project/${projectId}/summary`),
  
  create: (data: Partial<Payment>) => 
    apiClient.post<Payment>('/payments', data),
  
  update: (id: string, data: Partial<Payment>) => 
    apiClient.patch<Payment>(`/payments/${id}`, data),
  
  delete: (id: string) => 
    apiClient.delete(`/payments/${id}`),
};

// ==================== EXPENSE APIs ====================
export const expenseApi = {
  getAll: () => 
    apiClient.get<Expense[]>('/expenses'),
  
  getById: (id: string) => 
    apiClient.get<Expense>(`/expenses/${id}`),
  
  getByProject: (projectId: string) => 
    apiClient.get<Expense[]>(`/expenses/project/${projectId}`),
  
  getByAccount: (accountId: string) => 
    apiClient.get<Expense[]>(`/expenses/account/${accountId}`),
  
  getTotalByProject: (projectId: string) => 
    apiClient.get(`/expenses/project/${projectId}/total`),
  
  getTotalByAccount: (accountId: string) => 
    apiClient.get(`/expenses/account/${accountId}/total`),
  
  create: (data: Partial<Expense>) => 
    apiClient.post<Expense>('/expenses', data),
  
  update: (id: string, data: Partial<Expense>) => 
    apiClient.patch<Expense>(`/expenses/${id}`, data),
  
  delete: (id: string) => 
    apiClient.delete(`/expenses/${id}`),
};

// ==================== ANALYTICS APIs ====================
export const analyticsApi = {
  getDashboard: () => 
    apiClient.get<DashboardStats>('/analytics/dashboard'),
  
  getProjects: () => 
    apiClient.get<ProjectAnalytics>('/analytics/projects'),
  
  getFinancial: (startDate?: string, endDate?: string) => 
    apiClient.get<FinancialAnalytics>('/analytics/financial', {
      params: { startDate, endDate },
    }),
  
  getWorkPackages: () => 
    apiClient.get('/analytics/work-packages'),
  
  getMonthlyReport: (year: number, month: number) => 
    apiClient.get('/analytics/reports/monthly', {
      params: { year, month },
    }),
  
  getYearlyReport: (year: number) => 
    apiClient.get('/analytics/reports/yearly', {
      params: { year },
    }),
};

// ==================== EMPLOYEE APIs ====================
export const employeeApi = {
  getAll: () => 
    apiClient.get<Employee[]>('/employees'),
  
  getById: (id: string) => 
    apiClient.get<Employee>(`/employees/${id}`),
  
  create: (data: Partial<Employee>) => 
    apiClient.post<Employee>('/employees', data),
  
  update: (id: string, data: Partial<Employee>) => 
    apiClient.patch<Employee>(`/employees/${id}`, data),
  
  delete: (id: string) => 
    apiClient.delete(`/employees/${id}`),
};

// ==================== LEAVE APIs ====================
export const leaveApi = {
  create: (data: Partial<Leave>) => 
    apiClient.post<Leave>('/employees/leaves', data),
  
  getByEmployee: (employeeId: string, month?: number, year?: number) => 
    apiClient.get<Leave[]>(`/employees/${employeeId}/leaves`, {
      params: { month, year },
    }),
  
  update: (id: string, data: Partial<Leave>) => 
    apiClient.patch<Leave>(`/employees/leaves/${id}`, data),
  
  delete: (id: string) => 
    apiClient.delete(`/employees/leaves/${id}`),
};

// ==================== COMPENSATORY LEAVE APIs ====================
export const compensatoryLeaveApi = {
  create: (data: Partial<CompensatoryLeave>) => 
    apiClient.post<CompensatoryLeave>('/employees/compensatory-leaves', data),
  
  getByEmployee: (employeeId: string) => 
    apiClient.get<CompensatoryLeave[]>(`/employees/${employeeId}/compensatory-leaves`),
  
  delete: (id: string) => 
    apiClient.delete(`/employees/compensatory-leaves/${id}`),
};

// ==================== SALARY APIs ====================
export const salaryApi = {
  calculate: (data: { employeeId: string; month: number; year: number }) => 
    apiClient.post<SalaryCalculation>('/employees/salary/calculate', data),
  
  process: (data: { employeeId: string; month: number; year: number; deductions?: number; notes?: string }) => 
    apiClient.post<SalaryRecord>('/employees/salary/process', data),
  
  getRecords: (employeeId?: string, year?: number) => 
    apiClient.get<SalaryRecord[]>('/employees/salary/records', {
      params: { employeeId, year },
    }),
  
  getRecord: (id: string) => 
    apiClient.get<SalaryRecord>(`/employees/salary/records/${id}`),
  
  update: (id: string, data: Partial<SalaryRecord>) => 
    apiClient.patch<SalaryRecord>(`/employees/salary/records/${id}`, data),
};

// ==================== TRANSACTION LOG APIs ====================
export const transactionLogApi = {
  getAll: (filters?: {
    transactionType?: 'CREDIT' | 'DEBIT';
    accountId?: string;
    performedBy?: string;
    action?: string;
    projectId?: string;
    startDate?: string;
    endDate?: string;
  }) => 
    apiClient.get('/transaction-logs', { params: filters }),
  
  getStats: () => 
    apiClient.get('/transaction-logs/stats'),
  
  getById: (id: string) => 
    apiClient.get(`/transaction-logs/${id}`),
};
