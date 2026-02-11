import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { accountApi } from '@/services/api';
import { toast } from 'react-hot-toast';

export const CreateAccountPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    accountName: '',
    accountHolderName: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    accountType: 'Current',
    openingBalance: '',
    isPrimary: false,
    isActive: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await accountApi.create({
        ...formData,
        openingBalance: formData.openingBalance ? parseFloat(formData.openingBalance) : 0,
        isPrimary: formData.isPrimary,
      });
      toast.success('Account created successfully!');
      navigate('/accounts');
    } catch (error) {
      console.error('Failed to create account:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/accounts')} className="p-2 rounded-lg hover:bg-gray-100">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create New Account</h1>
          <p className="text-gray-600">Add a new bank account to the system</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Account Name *
          </label>
          <input
            name="accountName"
            type="text"
            value={formData.accountName}
            onChange={handleChange}
            className="input"
            placeholder="HDFC Business Account"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Account Holder Name *
          </label>
          <input
            name="accountHolderName"
            type="text"
            value={formData.accountHolderName}
            onChange={handleChange}
            className="input"
            placeholder="John Doe"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bank Name
            </label>
            <input
              name="bankName"
              type="text"
              value={formData.bankName}
              onChange={handleChange}
              className="input"
              placeholder="HDFC Bank"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Type
            </label>
            <select
              name="accountType"
              value={formData.accountType}
              onChange={handleChange}
              className="input"
            >
              <option value="Savings">Savings</option>
              <option value="Current">Current</option>
              <option value="Business">Business</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Number
            </label>
            <input
              name="accountNumber"
              type="text"
              value={formData.accountNumber}
              onChange={handleChange}
              className="input"
              placeholder="1234567890123456"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              IFSC Code
            </label>
            <input
              name="ifscCode"
              type="text"
              value={formData.ifscCode}
              onChange={handleChange}
              className="input"
              placeholder="HDFC0001234"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Opening Balance (₹)
          </label>
          <input
            name="openingBalance"
            type="number"
            step="0.01"
            value={formData.openingBalance}
            onChange={handleChange}
            className="input"
            placeholder="10000.00"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <input
              name="isPrimary"
              type="checkbox"
              checked={formData.isPrimary}
              onChange={handleChange}
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <label className="text-sm font-medium text-gray-700">
              Set as Primary Account (for salary payments)
            </label>
          </div>

          <div className="flex items-center gap-2">
            <input
              name="isActive"
              type="checkbox"
              checked={formData.isActive}
              onChange={handleChange}
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <label className="text-sm font-medium text-gray-700">
              Account is active
            </label>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button type="button" onClick={() => navigate('/accounts')} className="btn btn-outline flex-1">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="btn btn-primary flex-1 flex items-center justify-center gap-2">
            <Save className="w-5 h-5" />
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </div>
      </form>
    </div>
  );
};
