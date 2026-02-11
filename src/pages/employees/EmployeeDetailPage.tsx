import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit2, 
  Calendar, 
  DollarSign, 
  Gift,
  Mail,
  Phone,
  CalendarCheck,
  TrendingUp
} from 'lucide-react';
import { employeeApi, leaveApi, compensatoryLeaveApi, salaryApi } from '@/services/api';
import { Employee, Leave, CompensatoryLeave, SalaryRecord } from '@/types';

export default function EmployeeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [compensatoryLeaves, setCompensatoryLeaves] = useState<CompensatoryLeave[]>([]);
  const [salaryRecords, setSalaryRecords] = useState<SalaryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'leaves' | 'compensatory' | 'salary'>('overview');

  useEffect(() => {
    if (id) {
      fetchEmployeeDetails();
    }
  }, [id]);

  const fetchEmployeeDetails = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const [empRes, leavesRes, compLeavesRes, salaryRes] = await Promise.all([
        employeeApi.getById(id),
        leaveApi.getByEmployee(id),
        compensatoryLeaveApi.getByEmployee(id),
        salaryApi.getRecords(id),
      ]);

      setEmployee(empRes.data);
      setLeaves(leavesRes.data);
      setCompensatoryLeaves(compLeavesRes.data);
      setSalaryRecords(salaryRes.data);
    } catch (error) {
      console.error('Error fetching employee details:', error);
      alert('Failed to load employee details');
      navigate('/employees');
    } finally {
      setLoading(false);
    }
  };

  const getWorkingDaysLabel = (workingDays: string) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const workingDayNumbers = workingDays.split(',').map(Number);
    return workingDayNumbers.map((day) => days[day]).join(', ');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getMonthName = (month: number) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[month - 1];
  };

  const availableCompLeaves = compensatoryLeaves.filter(
    (cl) => !cl.isUsed && new Date(cl.expiryDate) > new Date()
  );
  const usedCompLeaves = compensatoryLeaves.filter((cl) => cl.isUsed);
  const expiredCompLeaves = compensatoryLeaves.filter(
    (cl) => !cl.isUsed && new Date(cl.expiryDate) <= new Date()
  );

  if (loading) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-600">Loading employee details...</p>
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
          onClick={() => navigate('/employees')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Employees
        </button>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{employee.name}</h1>
            <p className="text-gray-600 mt-1">{employee.designation || 'Employee'}</p>
          </div>
          <div className="flex gap-3">
            <Link
              to={`/employees/${id}/leaves`}
              className="flex items-center gap-2 px-4 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Calendar className="w-4 h-4" />
              Manage Leaves
            </Link>
            <Link
              to={`/employees/edit/${id}`}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              Edit
            </Link>
          </div>
        </div>
      </div>

      {/* Employee Info Card */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium text-gray-900">{employee.email}</p>
            </div>
          </div>

          {employee.phone && (
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-medium text-gray-900">{employee.phone}</p>
              </div>
            </div>
          )}

          <div className="flex items-start gap-3">
            <CalendarCheck className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-600">Joining Date</p>
              <p className="font-medium text-gray-900">{formatDate(employee.joiningDate)}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <DollarSign className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-600">Daily Salary</p>
              <p className="font-medium text-gray-900">₹{employee.dailySalary.toLocaleString()}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-600">Working Days</p>
              <p className="font-medium text-gray-900">{getWorkingDaysLabel(employee.workingDays)}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Gift className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-600">Paid Leaves/Month</p>
              <p className="font-medium text-gray-900">{employee.paidLeavesPerMonth}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <span
                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  employee.isActive
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {employee.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('leaves')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'leaves'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Leaves ({leaves.length})
            </button>
            <button
              onClick={() => setActiveTab('compensatory')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'compensatory'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Compensatory Leaves ({availableCompLeaves.length})
            </button>
            <button
              onClick={() => setActiveTab('salary')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'salary'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Salary Records ({salaryRecords.length})
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 rounded-lg p-6">
                <p className="text-sm text-blue-600 mb-1">Total Leaves</p>
                <p className="text-3xl font-bold text-blue-900">{leaves.length}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-6">
                <p className="text-sm text-green-600 mb-1">Available Comp Leaves</p>
                <p className="text-3xl font-bold text-green-900">{availableCompLeaves.length}</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-6">
                <p className="text-sm text-purple-600 mb-1">Processed Salaries</p>
                <p className="text-3xl font-bold text-purple-900">
                  {salaryRecords.filter((s) => s.isProcessed).length}
                </p>
              </div>
            </div>
          )}

          {/* Leaves Tab */}
          {activeTab === 'leaves' && (
            <div>
              {leaves.length === 0 ? (
                <p className="text-gray-600 text-center py-8">No leaves recorded</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Compensatory</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {leaves.map((leave) => (
                        <tr key={leave.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatDate(leave.leaveDate)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                leave.leaveType === 'FULL_DAY'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}
                            >
                              {leave.leaveType === 'FULL_DAY' ? 'Full Day' : 'Half Day'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">{leave.reason}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {leave.isCompensatory ? (
                              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                Yes
                              </span>
                            ) : (
                              <span className="text-sm text-gray-500">No</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Compensatory Leaves Tab */}
          {activeTab === 'compensatory' && (
            <div className="space-y-6">
              {/* Available */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Available ({availableCompLeaves.length})</h3>
                {availableCompLeaves.length === 0 ? (
                  <p className="text-gray-600">No available compensatory leaves</p>
                ) : (
                  <div className="space-y-2">
                    {availableCompLeaves.map((cl) => (
                      <div key={cl.id} className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-900">{cl.reason}</p>
                            <p className="text-sm text-gray-600 mt-1">
                              Granted: {formatDate(cl.grantedDate)} • Expires: {formatDate(cl.expiryDate)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Used */}
              {usedCompLeaves.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Used ({usedCompLeaves.length})</h3>
                  <div className="space-y-2">
                    {usedCompLeaves.map((cl) => (
                      <div key={cl.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-900">{cl.reason}</p>
                            <p className="text-sm text-gray-600 mt-1">
                              Granted: {formatDate(cl.grantedDate)} • Used: {cl.usedDate ? formatDate(cl.usedDate) : 'N/A'}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Expired */}
              {expiredCompLeaves.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Expired ({expiredCompLeaves.length})</h3>
                  <div className="space-y-2">
                    {expiredCompLeaves.map((cl) => (
                      <div key={cl.id} className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-900">{cl.reason}</p>
                            <p className="text-sm text-gray-600 mt-1">
                              Granted: {formatDate(cl.grantedDate)} • Expired: {formatDate(cl.expiryDate)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Salary Records Tab */}
          {activeTab === 'salary' && (
            <div>
              {salaryRecords.length === 0 ? (
                <p className="text-gray-600 text-center py-8">No salary records</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Period</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Working Days</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Present</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Leaves</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Salary</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Deductions</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Net Salary</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {salaryRecords.map((record) => (
                        <tr key={record.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {getMonthName(record.month)} {record.year}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.workingDays}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.presentDays}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div className="text-xs">
                              <div>Paid: {record.paidLeaves}</div>
                              <div>Unpaid: {record.unpaidLeaves}</div>
                              <div>Comp: {record.compensatoryLeaves}</div>
                              <div>Half: {record.halfDays}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            ₹{record.totalSalary.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                            ₹{record.deductions.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">
                            ₹{record.netSalary.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                record.isProcessed
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}
                            >
                              {record.isProcessed ? 'Processed' : 'Pending'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
