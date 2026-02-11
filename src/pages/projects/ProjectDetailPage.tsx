import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Package, CreditCard, TrendingDown, TrendingUp, DollarSign, Calendar, AlertCircle, Edit2, Trash2 } from 'lucide-react';
import { projectApi, workPackageApi, paymentApi, expenseApi } from '@/services/api';
import { Project, WorkPackage, Payment, Expense } from '@/types';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';

export const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<Project | null>(null);
  const [workPackages, setWorkPackages] = useState<WorkPackage[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'work-packages' | 'payments' | 'expenses'>('overview');

  // Pagination states
  const [wpPage, setWpPage] = useState(1);
  const [paymentPage, setPaymentPage] = useState(1);
  const [expensePage, setExpensePage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (id) {
      loadProjectDetails();
    }
  }, [id]);

  const loadProjectDetails = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const [projectRes, wpRes, paymentsRes, expensesRes] = await Promise.all([
        projectApi.getById(id),
        workPackageApi.getByProject(id),
        paymentApi.getByProject(id),
        expenseApi.getByProject(id),
      ]);

      setProject(projectRes.data);
      setWorkPackages(wpRes.data);
      setPayments(paymentsRes.data);
      setExpenses(expensesRes.data);
    } catch (error) {
      console.error('Failed to load project details:', error);
      toast.error('Failed to load project details');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteWorkPackage = async (wpId: string) => {
    if (!window.confirm('Are you sure you want to delete this work package?')) return;
    
    try {
      await workPackageApi.delete(wpId);
      toast.success('Work package deleted successfully');
      loadProjectDetails();
    } catch (error) {
      console.error('Failed to delete work package:', error);
      toast.error('Failed to delete work package');
    }
  };

  const handleDeletePayment = async (paymentId: string) => {
    if (!window.confirm('Are you sure you want to delete this payment?')) return;
    
    try {
      await paymentApi.delete(paymentId);
      toast.success('Payment deleted successfully');
      loadProjectDetails();
    } catch (error) {
      console.error('Failed to delete payment:', error);
      toast.error('Failed to delete payment');
    }
  };

  const handleDeleteExpense = async (expenseId: string) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) return;
    
    try {
      await expenseApi.delete(expenseId);
      toast.success('Expense deleted successfully');
      loadProjectDetails();
    } catch (error) {
      console.error('Failed to delete expense:', error);
      toast.error('Failed to delete expense');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return format(new Date(date), 'dd MMM yyyy');
  };

  // Calculate totals
  const totalWorkPackageAmount = workPackages.reduce((sum, wp) => sum + Number(wp.amount || 0), 0);
  const totalPaymentsReceived = payments.reduce((sum, p) => sum + Number(p.amount || 0), 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
  const pendingAmount = totalWorkPackageAmount - totalPaymentsReceived - totalExpenses;
  const netProfit = totalPaymentsReceived - totalExpenses;

  // Pagination helpers
  const paginateData = <T,>(data: T[], page: number) => {
    const startIndex = (page - 1) * itemsPerPage;
    return data.slice(startIndex, startIndex + itemsPerPage);
  };

  const getTotalPages = (total: number) => Math.ceil(total / itemsPerPage);

  const PaginationControls: React.FC<{ 
    currentPage: number; 
    totalItems: number; 
    onPageChange: (page: number) => void 
  }> = ({ currentPage, totalItems, onPageChange }) => {
    const totalPages = getTotalPages(totalItems);
    if (totalPages <= 1) return null;

    return (
      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
        <div className="text-sm text-gray-700">
          Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} results
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>
          <span className="px-3 py-1 text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900">Project not found</h3>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/projects')} className="btn btn-outline p-2">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{project.title}</h1>
          <p className="text-gray-600">{project.clientDetails}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          project.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {project.status}
        </span>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <div className="card">
          <div className="flex items-center gap-2 mb-2">
            <Package className="w-5 h-5 text-blue-600" />
            <p className="text-sm text-gray-600">Budget</p>
          </div>
          <p className="text-xl font-bold text-gray-900">{formatCurrency(project.budget || 0)}</p>
        </div>

        <div className="card">
          <div className="flex items-center gap-2 mb-2">
            <Package className="w-5 h-5 text-purple-600" />
            <p className="text-sm text-gray-600">Work Packages</p>
          </div>
          <p className="text-xl font-bold text-gray-900">{formatCurrency(totalWorkPackageAmount)}</p>
          <p className="text-xs text-gray-500">{workPackages.length} packages</p>
        </div>

        <div className="card">
          <div className="flex items-center gap-2 mb-2">
            <CreditCard className="w-5 h-5 text-green-600" />
            <p className="text-sm text-gray-600">Payments</p>
          </div>
          <p className="text-xl font-bold text-green-600">{formatCurrency(totalPaymentsReceived)}</p>
          <p className="text-xs text-gray-500">{payments.length} payments</p>
        </div>

        <div className="card">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-5 h-5 text-red-600" />
            <p className="text-sm text-gray-600">Expenses</p>
          </div>
          <p className="text-xl font-bold text-red-600">{formatCurrency(totalExpenses)}</p>
          <p className="text-xs text-gray-500">{expenses.length} expenses</p>
        </div>

        <div className="card">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-orange-600" />
            <p className="text-sm text-gray-600">Net Pending</p>
          </div>
          <p className={`text-xl font-bold ${pendingAmount >= 0 ? 'text-orange-600' : 'text-red-600'}`}>
            {formatCurrency(pendingAmount)}
          </p>
          <p className="text-xs text-gray-500">After expenses</p>
        </div>

        <div className="card">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            <p className="text-sm text-gray-600">Net Profit</p>
          </div>
          <p className={`text-xl font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(netProfit)}
          </p>
          <p className="text-xs text-gray-500">Revenue - Expenses</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="card p-0">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {[
              { id: 'overview', label: 'Overview', icon: Calendar },
              { id: 'work-packages', label: `Work Packages (${workPackages.length})`, icon: Package },
              { id: 'payments', label: `Payments (${payments.length})`, icon: CreditCard },
              { id: 'expenses', label: `Expenses (${expenses.length})`, icon: TrendingDown },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-3 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Project Details</h3>
                  <dl className="space-y-2">
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Start Date:</dt>
                      <dd className="font-medium">{project.startDate ? formatDate(project.startDate) : '-'}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">End Date:</dt>
                      <dd className="font-medium">{project.endDate ? formatDate(project.endDate) : '-'}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Created:</dt>
                      <dd className="font-medium">{formatDate(project.createdAt)}</dd>
                    </div>
                  </dl>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Financial Summary</h3>
                  <dl className="space-y-2">
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Total Revenue:</dt>
                      <dd className="font-medium text-green-600">{formatCurrency(totalPaymentsReceived)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Total Expenses:</dt>
                      <dd className="font-medium text-red-600">{formatCurrency(totalExpenses)}</dd>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <dt className="text-gray-900 font-semibold">Net Profit:</dt>
                      <dd className={`font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(netProfit)}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              {project.description && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-600">{project.description}</p>
                </div>
              )}
            </div>
          )}

          {/* Work Packages Tab */}
          {activeTab === 'work-packages' && (
            <div>
              {workPackages.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No work packages found</div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Package Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Advance</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Version</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {paginateData(workPackages, wpPage).map((wp) => (
                          <tr key={wp.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{wp.workPackageName}</td>
                            <td className="px-6 py-4 text-sm text-gray-900">{formatCurrency(wp.amount)}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">{formatCurrency(wp.advanceAmount || 0)}</td>
                            <td className="px-6 py-4 text-sm">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                wp.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                wp.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {wp.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">{wp.version || '-'}</td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Link to={`/work-packages/edit/${wp.id}`} className="text-primary-600 hover:text-primary-800">
                                  <Edit2 className="w-4 h-4" />
                                </Link>
                                <button onClick={() => handleDeleteWorkPackage(wp.id)} className="text-red-600 hover:text-red-800">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <PaginationControls
                    currentPage={wpPage}
                    totalItems={workPackages.length}
                    onPageChange={setWpPage}
                  />
                </>
              )}
            </div>
          )}

          {/* Payments Tab */}
          {activeTab === 'payments' && (
            <div>
              {payments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No payments found</div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Account</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reference</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {paginateData(payments, paymentPage).map((payment) => (
                          <tr key={payment.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatDate(payment.paymentDate)}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                              {payment.description || '-'}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">{payment.account?.accountName}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                              {formatCurrency(payment.amount)}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">{payment.transactionRef || '-'}</td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Link to={`/payments/edit/${payment.id}`} className="text-primary-600 hover:text-primary-800">
                                  <Edit2 className="w-4 h-4" />
                                </Link>
                                <button onClick={() => handleDeletePayment(payment.id)} className="text-red-600 hover:text-red-800">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <PaginationControls
                    currentPage={paymentPage}
                    totalItems={payments.length}
                    onPageChange={setPaymentPage}
                  />
                </>
              )}
            </div>
          )}

          {/* Expenses Tab */}
          {activeTab === 'expenses' && (
            <div>
              {expenses.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No expenses found</div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Account</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {paginateData(expenses, expensePage).map((expense) => (
                          <tr key={expense.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatDate(expense.expenseDate)}
                            </td>
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{expense.title}</td>
                            <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                              {expense.description}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">{expense.account?.accountName}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-red-600">
                              {formatCurrency(expense.amount)}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Link to={`/expenses/edit/${expense.id}`} className="text-primary-600 hover:text-primary-800">
                                  <Edit2 className="w-4 h-4" />
                                </Link>
                                <button onClick={() => handleDeleteExpense(expense.id)} className="text-red-600 hover:text-red-800">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <PaginationControls
                    currentPage={expensePage}
                    totalItems={expenses.length}
                    onPageChange={setExpensePage}
                  />
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
