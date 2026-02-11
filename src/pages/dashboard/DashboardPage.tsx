import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  FolderKanban,
  CreditCard,
  ArrowRight,
  DollarSign,
} from 'lucide-react';
import { analyticsApi, projectApi, paymentApi } from '@/services/api';
import { DashboardStats, Project, Payment } from '@/types';
import { format } from 'date-fns';

export const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [recentPayments, setRecentPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [dashboardRes, projectsRes, paymentsRes] = await Promise.all([
        analyticsApi.getDashboard(),
        projectApi.getAll(),
        paymentApi.getAll(),
      ]);

      setStats(dashboardRes.data);
      setRecentProjects(projectsRes.data.slice(0, 5));
      setRecentPayments(paymentsRes.data.slice(0, 5));
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-header">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {/* Total Projects */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FolderKanban className="w-6 h-6 text-blue-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {stats?.totalProjects || 0}
          </h3>
          <p className="text-sm text-gray-600">Total Projects</p>
          <div className="mt-3 flex gap-2 text-xs">
            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full">
              {stats?.activeProjects || 0} Active
            </span>
            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
              {stats?.completedProjects || 0} Completed
            </span>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {formatCurrency(stats?.totalRevenue || 0)}
          </h3>
          <p className="text-sm text-gray-600">Total Revenue</p>
        </div>

        {/* Total Expenses */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-red-100 rounded-lg">
              <CreditCard className="w-6 h-6 text-red-600" />
            </div>
            <TrendingDown className="w-5 h-5 text-red-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {formatCurrency(stats?.totalExpenses || 0)}
          </h3>
          <p className="text-sm text-gray-600">Total Expenses</p>
        </div>

        {/* Net Profit */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Wallet className="w-6 h-6 text-purple-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {formatCurrency(stats?.netProfit || 0)}
          </h3>
          <p className="text-sm text-gray-600">Net Profit</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Recent Projects</h2>
            <Link
              to="/projects"
              className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-4">
            {recentProjects.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No projects yet</p>
            ) : (
              recentProjects.map((project) => (
                <Link
                  key={project.id}
                  to={`/projects/${project.id}`}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FolderKanban className="w-5 h-5 text-primary-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">
                      {project.title}
                    </h3>
                    <p className="text-sm text-gray-500 truncate">
                      {project.clientDetails || 'No client details'}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        project.status === 'ACTIVE'
                          ? 'bg-green-100 text-green-700'
                          : project.status === 'COMPLETED'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {project.status}
                      </span>
                      {project.budget && (
                        <span className="text-xs text-gray-500">
                          Budget: {formatCurrency(project.budget)}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Recent Payments */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Recent Payments</h2>
            <Link
              to="/payments"
              className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-4">
            {recentPayments.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No payments yet</p>
            ) : (
              recentPayments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50"
                >
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CreditCard className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900">
                          {formatCurrency(payment.amount)}
                        </h3>
                        <p className="text-sm text-gray-500 truncate">
                          {payment.description || 'No description'}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {format(new Date(payment.paymentDate), 'MMM dd, yyyy')}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
