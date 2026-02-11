import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Calendar as CalendarIcon } from 'lucide-react';
import { employeeApi, leaveApi, compensatoryLeaveApi } from '@/services/api';
import { Employee, Leave, CompensatoryLeave } from '@/types';

export default function LeaveManagementPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [compensatoryLeaves, setCompensatoryLeaves] = useState<CompensatoryLeave[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Leave form
  const [leaveDate, setLeaveDate] = useState('');
  const [leaveType, setLeaveType] = useState<'FULL_DAY' | 'HALF_DAY'>('FULL_DAY');
  const [reason, setReason] = useState('');
  const [isCompensatory, setIsCompensatory] = useState(false);
  const [selectedCompLeaveId, setSelectedCompLeaveId] = useState('');

  // Compensatory leave form
  const [showCompLeaveForm, setShowCompLeaveForm] = useState(false);
  const [compLeaveReason, setCompLeaveReason] = useState('');
  const [compLeaveExpiry, setCompLeaveExpiry] = useState('');

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const fetchData = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const [empRes, leavesRes, compLeavesRes] = await Promise.all([
        employeeApi.getById(id),
        leaveApi.getByEmployee(id),
        compensatoryLeaveApi.getByEmployee(id),
      ]);

      setEmployee(empRes.data);
      setLeaves(leavesRes.data);
      setCompensatoryLeaves(compLeavesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Failed to load data');
      navigate('/employees');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkLeave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id) return;

    try {
      setSubmitting(true);
      await leaveApi.create({
        employeeId: id,
        leaveDate,
        leaveType,
        reason,
        isCompensatory: isCompensatory && !!selectedCompLeaveId,
        compensatoryReason: isCompensatory && selectedCompLeaveId ? compensatoryLeaves.find(cl => cl.id === selectedCompLeaveId)?.reason : undefined,
      });

      // Reset form
      setLeaveDate('');
      setReason('');
      setIsCompensatory(false);
      setSelectedCompLeaveId('');
      
      // Refresh data
      await fetchData();
      
      alert('Leave marked successfully');
    } catch (error: any) {
      console.error('Error marking leave:', error);
      alert(error.response?.data?.message || 'Failed to mark leave');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddCompLeave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id) return;

    try {
      setSubmitting(true);
      await compensatoryLeaveApi.create({
        employeeId: id,
        reason: compLeaveReason,
        grantedDate: new Date().toISOString(),
        expiryDate: compLeaveExpiry,
      });

      // Reset form
      setCompLeaveReason('');
      setCompLeaveExpiry('');
      setShowCompLeaveForm(false);
      
      // Refresh data
      await fetchData();
      
      alert('Compensatory leave added successfully');
    } catch (error: any) {
      console.error('Error adding compensatory leave:', error);
      alert(error.response?.data?.message || 'Failed to add compensatory leave');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteLeave = async (leaveId: string) => {
    if (!confirm('Are you sure you want to delete this leave?')) return;

    try {
      await leaveApi.delete(leaveId);
      await fetchData();
      alert('Leave deleted successfully');
    } catch (error) {
      console.error('Error deleting leave:', error);
      alert('Failed to delete leave');
    }
  };

  const handleDeleteCompLeave = async (compLeaveId: string) => {
    if (!confirm('Are you sure you want to delete this compensatory leave?')) return;

    try {
      await compensatoryLeaveApi.delete(compLeaveId);
      await fetchData();
      alert('Compensatory leave deleted successfully');
    } catch (error) {
      console.error('Error deleting compensatory leave:', error);
      alert('Failed to delete compensatory leave');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const availableCompLeaves = compensatoryLeaves.filter(
    (cl) => !cl.isUsed && new Date(cl.expiryDate) > new Date()
  );

  if (loading) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-600">Employee not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate(`/employees/${id}`)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Employee
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Leave Management</h1>
        <p className="text-gray-600 mt-1">{employee.name} - {employee.designation}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Forms */}
        <div className="lg:col-span-1 space-y-6">
          {/* Mark Leave Form */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Mark Leave</h2>
            <form onSubmit={handleMarkLeave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={leaveDate}
                  onChange={(e) => setLeaveDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Leave Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value as 'FULL_DAY' | 'HALF_DAY')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="FULL_DAY">Full Day</option>
                  <option value="HALF_DAY">Half Day</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter reason for leave"
                />
              </div>

              {availableCompLeaves.length > 0 && (
                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isCompensatory}
                      onChange={(e) => {
                        setIsCompensatory(e.target.checked);
                        if (!e.target.checked) setSelectedCompLeaveId('');
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Use Compensatory Leave</span>
                  </label>

                  {isCompensatory && (
                    <select
                      value={selectedCompLeaveId}
                      onChange={(e) => setSelectedCompLeaveId(e.target.value)}
                      className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required={isCompensatory}
                    >
                      <option value="">Select Compensatory Leave</option>
                      {availableCompLeaves.map((cl) => (
                        <option key={cl.id} value={cl.id}>
                          {cl.reason} (Expires: {formatDate(cl.expiryDate)})
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
              >
                {submitting ? 'Marking...' : 'Mark Leave'}
              </button>
            </form>
          </div>

          {/* Add Compensatory Leave */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Compensatory Leave</h2>
              {!showCompLeaveForm && (
                <button
                  onClick={() => setShowCompLeaveForm(true)}
                  className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              )}
            </div>

            {showCompLeaveForm ? (
              <form onSubmit={handleAddCompLeave} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reason <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    value={compLeaveReason}
                    onChange={(e) => setCompLeaveReason(e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Weekend work, Holiday work"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={compLeaveExpiry}
                    onChange={(e) => setCompLeaveExpiry(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCompLeaveForm(false);
                      setCompLeaveReason('');
                      setCompLeaveExpiry('');
                    }}
                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors disabled:bg-green-400"
                  >
                    {submitting ? 'Adding...' : 'Add'}
                  </button>
                </div>
              </form>
            ) : (
              <p className="text-sm text-gray-600">
                Available: {availableCompLeaves.length}
              </p>
            )}
          </div>
        </div>

        {/* Right Column - Leave History */}
        <div className="lg:col-span-2 space-y-6">
          {/* Leave History */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Leave History</h2>
            </div>
            <div className="p-6">
              {leaves.length === 0 ? (
                <p className="text-gray-600 text-center py-8">No leaves recorded</p>
              ) : (
                <div className="space-y-3">
                  {leaves.map((leave) => (
                    <div key={leave.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <CalendarIcon className="w-4 h-4 text-gray-400" />
                            <span className="font-medium text-gray-900">{formatDate(leave.leaveDate)}</span>
                            <span
                              className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                                leave.leaveType === 'FULL_DAY'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}
                            >
                              {leave.leaveType === 'FULL_DAY' ? 'Full Day' : 'Half Day'}
                            </span>
                            {leave.isCompensatory && (
                              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                Compensatory
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{leave.reason}</p>
                        </div>
                        <button
                          onClick={() => handleDeleteLeave(leave.id)}
                          className="text-red-600 hover:text-red-700 ml-4"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Compensatory Leaves List */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Compensatory Leaves</h2>
            </div>
            <div className="p-6">
              {compensatoryLeaves.length === 0 ? (
                <p className="text-gray-600 text-center py-8">No compensatory leaves</p>
              ) : (
                <div className="space-y-3">
                  {compensatoryLeaves.map((cl) => {
                    const isExpired = new Date(cl.expiryDate) <= new Date();
                    const isAvailable = !cl.isUsed && !isExpired;

                    return (
                      <div
                        key={cl.id}
                        className={`border rounded-lg p-4 ${
                          isAvailable
                            ? 'border-green-200 bg-green-50'
                            : cl.isUsed
                            ? 'border-gray-200 bg-gray-50'
                            : 'border-red-200 bg-red-50'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-medium text-gray-900">{cl.reason}</span>
                              <span
                                className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                                  isAvailable
                                    ? 'bg-green-100 text-green-800'
                                    : cl.isUsed
                                    ? 'bg-gray-100 text-gray-800'
                                    : 'bg-red-100 text-red-800'
                                }`}
                              >
                                {isAvailable ? 'Available' : cl.isUsed ? 'Used' : 'Expired'}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">
                              Granted: {formatDate(cl.grantedDate)} • Expires: {formatDate(cl.expiryDate)}
                              {cl.isUsed && cl.usedDate && ` • Used: ${formatDate(cl.usedDate)}`}
                            </p>
                          </div>
                          {isAvailable && (
                            <button
                              onClick={() => handleDeleteCompLeave(cl.id)}
                              className="text-red-600 hover:text-red-700 ml-4"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
