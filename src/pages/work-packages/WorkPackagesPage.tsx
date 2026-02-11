import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Package, Edit2, Trash2 } from 'lucide-react';
import { workPackageApi } from '@/services/api';
import { WorkPackage } from '@/types';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';

export const WorkPackagesPage: React.FC = () => {
  const [workPackages, setWorkPackages] = useState<WorkPackage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWorkPackages();
  }, []);

  const loadWorkPackages = async () => {
    setLoading(true);
    try {
      const response = await workPackageApi.getAll();
      setWorkPackages(response.data);
    } catch (error) {
      console.error('Failed to load work packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this work package?')) {
      return;
    }

    try {
      await workPackageApi.delete(id);
      toast.success('Work package deleted successfully');
      loadWorkPackages();
    } catch (error) {
      console.error('Failed to delete work package:', error);
      toast.error('Failed to delete work package');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-700';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-700';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-700';
      case 'ON_HOLD':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const totalAmount = workPackages.reduce((sum, wp) => sum + Number(wp.amount || 0), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="page-header">Work Packages</h1>
          <p className="text-gray-600">Manage project work packages and deliverables</p>
        </div>
        <Link to="/work-packages/new" className="btn btn-primary flex items-center gap-2 justify-center">
          <Plus className="w-5 h-5" />
          New Work Package
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <h3 className="text-sm text-gray-600 mb-2">Total Packages</h3>
          <p className="text-3xl font-bold text-gray-900">{workPackages.length}</p>
        </div>
        <div className="card">
          <h3 className="text-sm text-gray-600 mb-2">Total Value</h3>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalAmount)}</p>
        </div>
        <div className="card">
          <h3 className="text-sm text-gray-600 mb-2">Completed</h3>
          <p className="text-3xl font-bold text-green-600">
            {workPackages.filter(wp => wp.status === 'COMPLETED').length}
          </p>
        </div>
        <div className="card">
          <h3 className="text-sm text-gray-600 mb-2">In Progress</h3>
          <p className="text-3xl font-bold text-blue-600">
            {workPackages.filter(wp => wp.status === 'IN_PROGRESS').length}
          </p>
        </div>
      </div>

      {/* Work Packages Grid */}
      {workPackages.length === 0 ? (
        <div className="card text-center py-12">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">No work packages yet</p>
          <Link to="/work-packages/new" className="btn btn-primary inline-flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Create Your First Work Package
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workPackages.map((wp) => (
            <div key={wp.id} className="card hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex-1 line-clamp-2">
                  {wp.workPackageName}
                </h3>
                <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ml-2 ${getStatusColor(wp.status)}`}>
                  {wp.status.replace('_', ' ')}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Amount:</span>
                  <span className="text-sm font-semibold text-gray-900">{formatCurrency(wp.amount)}</span>
                </div>
                {wp.advanceAmount && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Advance:</span>
                    <span className="text-sm text-green-600">{formatCurrency(wp.advanceAmount)}</span>
                  </div>
                )}
                {wp.version && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Version:</span>
                    <span className="text-sm text-gray-900">{wp.version}</span>
                  </div>
                )}
              </div>

              {(wp.startDate || wp.completionDate) && (
                <div className="pt-3 border-t border-gray-100 text-sm text-gray-600">
                  {wp.startDate && (
                    <p>Start: {format(new Date(wp.startDate), 'MMM dd, yyyy')}</p>
                  )}
                  {wp.completionDate && (
                    <p>End: {format(new Date(wp.completionDate), 'MMM dd, yyyy')}</p>
                  )}
                </div>
              )}

              <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
                <Link
                  to={`/work-packages/edit/${wp.id}`}
                  className="btn btn-outline flex-1 flex items-center justify-center gap-2 text-sm py-2"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(wp.id)}
                  className="btn btn-outline flex-1 flex items-center justify-center gap-2 text-sm py-2 text-red-600 hover:bg-red-50 border-red-200"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
