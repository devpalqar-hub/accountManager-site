import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { paymentApi, projectApi, accountApi } from '@/services/api';
import { Project, Account } from '@/types';
import { toast } from 'react-hot-toast';

export const EditPaymentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [formData, setFormData] = useState({
    amount: '',
    accountId: '',
    projectId: '',
    paymentDate: '',
    description: '',
    transactionRef: '',
  });

  useEffect(() => {
    loadData();
    if (id) {
      loadPayment();
    }
  }, [id]);

  const loadData = async () => {
    try {
      const [projectsRes, accountsRes] = await Promise.all([
        projectApi.getAll(),
        accountApi.getAll(),
      ]);
      setProjects(projectsRes.data);
      setAccounts(accountsRes.data);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  const loadPayment = async () => {
    if (!id) return;
    
    setFetching(true);
    try {
      const response = await paymentApi.getById(id);
      const payment = response.data;
      
      setFormData({
        amount: payment.amount ? payment.amount.toString() : '',
        accountId: payment.accountId || '',
        projectId: payment.projectId || '',
        paymentDate: payment.paymentDate ? payment.paymentDate.split('T')[0] : '',
        description: payment.description || '',
        transactionRef: payment.transactionRef || '',
      });
    } catch (error) {
      console.error('Failed to load payment:', error);
      toast.error('Failed to load payment');
      navigate('/payments');
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setLoading(true);
    try {
      await paymentApi.update(id, {
        ...formData,
        amount: parseFloat(formData.amount),
      });
      toast.success('Payment updated successfully!');
      navigate('/payments');
    } catch (error) {
      console.error('Failed to update payment:', error);
      toast.error('Failed to update payment');
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
        <button onClick={() => navigate('/payments')} className="p-2 rounded-lg hover:bg-gray-100">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Payment</h1>
          <p className="text-gray-600">Update payment details</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Date *
            </label>
            <input
              name="paymentDate"
              type="date"
              value={formData.paymentDate}
              onChange={handleChange}
              className="input"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account *
            </label>
            <select
              name="accountId"
              value={formData.accountId}
              onChange={handleChange}
              className="input"
              required
            >
              <option value="">Select account...</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.accountName} - {account.bankName}
                </option>
              ))}
            </select>
          </div>

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
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Transaction Reference
          </label>
          <input
            name="transactionRef"
            type="text"
            value={formData.transactionRef}
            onChange={handleChange}
            className="input"
            placeholder="TXN123456789"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="input min-h-[100px]"
            placeholder="Payment for Phase 1 development - Invoice #123"
          />
        </div>

        <div className="flex gap-4 pt-4">
          <button type="button" onClick={() => navigate('/payments')} className="btn btn-outline flex-1">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="btn btn-primary flex-1 flex items-center justify-center gap-2">
            <Save className="w-5 h-5" />
            {loading ? 'Updating...' : 'Update Payment'}
          </button>
        </div>
      </form>
    </div>
  );
};
