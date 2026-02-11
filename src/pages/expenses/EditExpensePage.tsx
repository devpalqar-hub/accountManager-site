import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { expenseApi, accountApi, projectApi } from '@/services/api';
import { Account, Project } from '@/types';
import { toast } from 'react-hot-toast';

export const EditExpensePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    amount: '',
    accountId: '',
    projectId: '',
    expenseDate: '',
    reference: '',
  });

  useEffect(() => {
    loadData();
    if (id) {
      loadExpense();
    }
  }, [id]);

  const loadData = async () => {
    try {
      const [accountsRes, projectsRes] = await Promise.all([
        accountApi.getAll(),
        projectApi.getAll(),
      ]);
      setAccounts(accountsRes.data);
      setProjects(projectsRes.data);
    } catch (error) {
      console.error('Failed to load data:', error);
      toast.error('Failed to load accounts and projects');
    }
  };

  const loadExpense = async () => {
    if (!id) return;
    
    setFetching(true);
    try {
      const response = await expenseApi.getById(id);
      const expense = response.data;
      
      setFormData({
        title: expense.title || '',
        description: expense.description || '',
        amount: expense.amount ? expense.amount.toString() : '',
        accountId: expense.accountId || '',
        projectId: expense.projectId || '',
        expenseDate: expense.expenseDate ? expense.expenseDate.split('T')[0] : '',
        reference: expense.reference || '',
      });
    } catch (error) {
      console.error('Failed to load expense:', error);
      toast.error('Failed to load expense');
      navigate('/expenses');
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setLoading(true);
    try {
      await expenseApi.update(id, {
        title: formData.title,
        description: formData.description,
        amount: parseFloat(formData.amount),
        accountId: formData.accountId,
        projectId: formData.projectId || undefined,
        expenseDate: formData.expenseDate,
        reference: formData.reference || undefined,
      });

      toast.success('Expense updated successfully');
      navigate('/expenses');
    } catch (error) {
      console.error('Failed to update expense:', error);
      toast.error('Failed to update expense');
    } finally {
      setLoading(false);
    }
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
        <button
          onClick={() => navigate('/expenses')}
          className="btn btn-outline p-2"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="page-header">Edit Expense</h1>
          <p className="text-gray-600">Update expense details</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Expense Title *
            </label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="input"
              placeholder="e.g., Office Supplies"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input"
              rows={3}
              placeholder="Detailed description of the expense"
              required
            />
          </div>

          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
              Amount (₹) *
            </label>
            <input
              id="amount"
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="input"
              placeholder="0.00"
              required
            />
          </div>

          <div>
            <label htmlFor="expenseDate" className="block text-sm font-medium text-gray-700 mb-2">
              Expense Date *
            </label>
            <input
              id="expenseDate"
              type="date"
              value={formData.expenseDate}
              onChange={(e) => setFormData({ ...formData, expenseDate: e.target.value })}
              className="input"
              required
            />
          </div>

          <div>
            <label htmlFor="accountId" className="block text-sm font-medium text-gray-700 mb-2">
              Deduct From Account *
            </label>
            <select
              id="accountId"
              value={formData.accountId}
              onChange={(e) => setFormData({ ...formData, accountId: e.target.value })}
              className="input"
              required
            >
              <option value="">Select Account</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.accountName} - {account.accountHolderName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="projectId" className="block text-sm font-medium text-gray-700 mb-2">
              Project (Optional)
            </label>
            <select
              id="projectId"
              value={formData.projectId}
              onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
              className="input"
            >
              <option value="">No Project</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.title}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label htmlFor="reference" className="block text-sm font-medium text-gray-700 mb-2">
              Reference (Optional)
            </label>
            <input
              id="reference"
              type="text"
              value={formData.reference}
              onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
              className="input"
              placeholder="Invoice number or reference"
            />
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={() => navigate('/expenses')}
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
            {loading ? 'Updating...' : 'Update Expense'}
          </button>
        </div>
      </form>
    </div>
  );
};
