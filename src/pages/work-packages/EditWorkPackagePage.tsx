import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { workPackageApi, projectApi } from '@/services/api';
import { Project } from '@/types';
import { toast } from 'react-hot-toast';

export const EditWorkPackagePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [formData, setFormData] = useState({
    workPackageName: '',
    amount: '',
    projectId: '',
    version: '',
    startDate: '',
    completionDate: '',
    advanceAmount: '',
    miscellaneousAmount: '',
    ongoingCost: '',
    status: 'PENDING',
    description: '',
  });

  useEffect(() => {
    loadProjects();
    if (id) {
      loadWorkPackage();
    }
  }, [id]);

  const loadProjects = async () => {
    try {
      const response = await projectApi.getAll();
      setProjects(response.data);
    } catch (error) {
      console.error('Failed to load projects:', error);
    }
  };

  const loadWorkPackage = async () => {
    if (!id) return;
    
    setFetching(true);
    try {
      const response = await workPackageApi.getById(id);
      const wp = response.data;
      
      setFormData({
        workPackageName: wp.workPackageName || '',
        amount: wp.amount ? wp.amount.toString() : '',
        projectId: wp.projectId || '',
        version: wp.version || '',
        startDate: wp.startDate ? wp.startDate.split('T')[0] : '',
        completionDate: wp.completionDate ? wp.completionDate.split('T')[0] : '',
        advanceAmount: wp.advanceAmount ? wp.advanceAmount.toString() : '',
        miscellaneousAmount: wp.miscellaneousAmount ? wp.miscellaneousAmount.toString() : '',
        ongoingCost: wp.ongoingCost ? wp.ongoingCost.toString() : '',
        status: wp.status || 'PENDING',
        description: wp.description || '',
      });
    } catch (error) {
      console.error('Failed to load work package:', error);
      toast.error('Failed to load work package');
      navigate('/work-packages');
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setLoading(true);
    try {
      await workPackageApi.update(id, {
        workPackageName: formData.workPackageName,
        amount: parseFloat(formData.amount),
        projectId: formData.projectId,
        version: formData.version || undefined,
        startDate: formData.startDate || undefined,
        completionDate: formData.completionDate || undefined,
        advanceAmount: formData.advanceAmount ? parseFloat(formData.advanceAmount) : undefined,
        miscellaneousAmount: formData.miscellaneousAmount ? parseFloat(formData.miscellaneousAmount) : undefined,
        ongoingCost: formData.ongoingCost ? parseFloat(formData.ongoingCost) : undefined,
        status: formData.status as any,
        description: formData.description || undefined,
      });
      toast.success('Work package updated successfully!');
      navigate('/work-packages');
    } catch (error) {
      console.error('Failed to update work package:', error);
      toast.error('Failed to update work package');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/work-packages')} className="p-2 rounded-lg hover:bg-gray-100">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Work Package</h1>
          <p className="text-gray-600">Update work package details</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Work Package Name *
          </label>
          <input
            name="workPackageName"
            type="text"
            value={formData.workPackageName}
            onChange={handleChange}
            className="input"
            placeholder="Phase 1 - Foundation Development"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project *
            </label>
            <select
              name="projectId"
              value={formData.projectId}
              onChange={handleChange}
              className="input"
              required
            >
              <option value="">Select project...</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount (₹) *
            </label>
            <input
              name="amount"
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={handleChange}
              className="input"
              placeholder="25000.00"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Version
            </label>
            <input
              name="version"
              type="text"
              value={formData.version}
              onChange={handleChange}
              className="input"
              placeholder="1.0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="input"
            >
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="ON_HOLD">On Hold</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <input
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleChange}
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Completion Date
            </label>
            <input
              name="completionDate"
              type="date"
              value={formData.completionDate}
              onChange={handleChange}
              className="input"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Advance Amount (₹)
            </label>
            <input
              name="advanceAmount"
              type="number"
              step="0.01"
              value={formData.advanceAmount}
              onChange={handleChange}
              className="input"
              placeholder="5000.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Miscellaneous (₹)
            </label>
            <input
              name="miscellaneousAmount"
              type="number"
              step="0.01"
              value={formData.miscellaneousAmount}
              onChange={handleChange}
              className="input"
              placeholder="1000.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ongoing Cost (₹)
            </label>
            <input
              name="ongoingCost"
              type="number"
              step="0.01"
              value={formData.ongoingCost}
              onChange={handleChange}
              className="input"
              placeholder="2000.00"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="input min-h-[120px]"
            placeholder="Details about this work package..."
          />
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={() => navigate('/work-packages')}
            className="btn btn-outline flex-1"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary flex-1 flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            {loading ? 'Updating...' : 'Update Work Package'}
          </button>
        </div>
      </form>
    </div>
  );
};
