import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { LoginPage } from '@/pages/auth/LoginPage';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { MainLayout } from '@/components/layout/MainLayout';
import { DashboardPage } from '@/pages/dashboard/DashboardPage';
import { ProjectsPage } from '@/pages/projects/ProjectsPage';
import { ProjectDetailPage } from '@/pages/projects/ProjectDetailPage';
import { CreateProjectPage } from '@/pages/projects/CreateProjectPage';
import { EditProjectPage } from '@/pages/projects/EditProjectPage';
import { AccountsPage } from '@/pages/accounts/AccountsPage';
import { CreateAccountPage } from '@/pages/accounts/CreateAccountPage';
import { EditAccountPage } from '@/pages/accounts/EditAccountPage';
import { PaymentsPage } from '@/pages/payments/PaymentsPage';
import { CreatePaymentPage } from '@/pages/payments/CreatePaymentPage';
import { EditPaymentPage } from '@/pages/payments/EditPaymentPage';
import { ExpensesPage } from '@/pages/expenses/ExpensesPage';
import { CreateExpensePage } from '@/pages/expenses/CreateExpensePage';
import { EditExpensePage } from '@/pages/expenses/EditExpensePage';
import { WorkPackagesPage } from '@/pages/work-packages/WorkPackagesPage';
import { CreateWorkPackagePage } from '@/pages/work-packages/CreateWorkPackagePage';
import { EditWorkPackagePage } from '@/pages/work-packages/EditWorkPackagePage';
import { UsersPage } from '@/pages/users/UsersPage';
import EmployeesPage from '@/pages/employees/EmployeesPage';
import CreateEmployeePage from '@/pages/employees/CreateEmployeePage';
import EditEmployeePage from '@/pages/employees/EditEmployeePage';
import EmployeeDetailPage from '@/pages/employees/EmployeeDetailPage';
import LeaveManagementPage from '@/pages/employees/LeaveManagementPage';
import SalaryProcessingPage from '@/pages/employees/SalaryProcessingPage';
import { AnalyticsPage } from '@/pages/analytics/AnalyticsPage';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/projects/new" element={<CreateProjectPage />} />
              <Route path="/projects/edit/:id" element={<EditProjectPage />} />
              <Route path="/projects/:id" element={<ProjectDetailPage />} />
              
              <Route path="/accounts" element={<AccountsPage />} />
              <Route path="/accounts/new" element={<CreateAccountPage />} />
              <Route path="/accounts/edit/:id" element={<EditAccountPage />} />
              
              <Route path="/payments" element={<PaymentsPage />} />
              <Route path="/payments/new" element={<CreatePaymentPage />} />
              <Route path="/payments/edit/:id" element={<EditPaymentPage />} />
              
              <Route path="/expenses" element={<ExpensesPage />} />
              <Route path="/expenses/create" element={<CreateExpensePage />} />
              <Route path="/expenses/edit/:id" element={<EditExpensePage />} />
              
              <Route path="/work-packages" element={<WorkPackagesPage />} />
              <Route path="/work-packages/new" element={<CreateWorkPackagePage />} />
              <Route path="/work-packages/edit/:id" element={<EditWorkPackagePage />} />
              
              <Route path="/employees" element={<EmployeesPage />} />
              <Route path="/employees/new" element={<CreateEmployeePage />} />
              <Route path="/employees/edit/:id" element={<EditEmployeePage />} />
              <Route path="/employees/:id" element={<EmployeeDetailPage />} />
              <Route path="/employees/:id/leaves" element={<LeaveManagementPage />} />
              <Route path="/employees/salary" element={<SalaryProcessingPage />} />
              
              <Route path="/users" element={<UsersPage />} />
              
              <Route path="/analytics" element={<AnalyticsPage />} />
            </Route>
          </Route>
          
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </>
  );
}

export default App;
