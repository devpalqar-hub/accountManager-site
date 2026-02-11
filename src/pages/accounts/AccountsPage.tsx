import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Wallet, TrendingUp, Edit, Trash2, Star } from 'lucide-react';
import { accountApi } from '@/services/api';
import { Account } from '@/types';

export const AccountsPage: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    setLoading(true);
    try {
      const response = await accountApi.getAll();
      setAccounts(response.data);
    } catch (error) {
      console.error('Failed to load accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, accountName: string) => {
    if (!window.confirm(`Are you sure you want to delete account "${accountName}"?`)) {
      return;
    }

    try {
      await accountApi.delete(id);
      setAccounts(accounts.filter(acc => acc.id !== id));
    } catch (error) {
      console.error('Failed to delete account:', error);
      alert('Failed to delete account. It may have related transactions.');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const totalBalance = accounts.reduce((sum, acc) => sum + Number(acc.currentBalance || 0), 0);

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
          <h1 className="page-header">Accounts</h1>
          <p className="text-gray-600">Manage your bank accounts and balances</p>
        </div>
        <Link to="/accounts/new" className="btn btn-primary flex items-center gap-2 justify-center">
          <Plus className="w-5 h-5" />
          New Account
        </Link>
      </div>

      {/* Total Balance Card */}
      <div className="card bg-gradient-to-r from-primary-500 to-primary-600 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Wallet className="w-6 h-6" />
          <h3 className="text-lg font-medium">Total Balance</h3>
        </div>
        <p className="text-4xl font-bold mb-1">{formatCurrency(totalBalance)}</p>
        <p className="text-primary-100 text-sm">Across {accounts.length} account(s)</p>
      </div>

      {/* Accounts List */}
      {accounts.length === 0 ? (
        <div className="card text-center py-12">
          <Wallet className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">No accounts yet</p>
          <Link to="/accounts/new" className="btn btn-primary inline-flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Create Your First Account
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accounts.map((account) => (
            <div key={account.id} className="card hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {account.accountName}
                    </h3>
                    {account.isPrimary && (
                      <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-700">
                        <Star className="w-3 h-3" fill="currentColor" />
                        Primary
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{account.accountHolderName}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  account.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {account.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                {account.bankName && (
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Bank:</span> {account.bankName}
                  </p>
                )}
                {account.accountNumber && (
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">A/C No:</span> ****{account.accountNumber.slice(-4)}
                  </p>
                )}
                {account.accountType && (
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Type:</span> {account.accountType}
                  </p>
                )}
              </div>

              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-600">Current Balance</span>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-lg font-bold text-gray-900">
                      {formatCurrency(account.currentBalance)}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/accounts/edit/${account.id}`)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-primary-700 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(account.id, account.accountName)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
