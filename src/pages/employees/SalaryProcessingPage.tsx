import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calculator, DollarSign, FileText } from 'lucide-react';
import { employeeApi, salaryApi } from '@/services/api';
import { Employee, SalaryCalculation, SalaryRecord } from '@/types';

export default function SalaryProcessingPage() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [calculation, setCalculation] = useState<SalaryCalculation | null>(null);
  const [deductions, setDeductions] = useState('0');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [salaryRecords, setSalaryRecords] = useState<SalaryRecord[]>([]);

  useEffect(() => {
    fetchEmployees();
    fetchSalaryRecords();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await employeeApi.getAll();
      setEmployees(response.data.filter((emp) => emp.isActive));
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const fetchSalaryRecords = async () => {
    try {
      const response = await salaryApi.getRecords(undefined, year);
      setSalaryRecords(response.data);
    } catch (error) {
      console.error('Error fetching salary records:', error);
    }
  };

  const handleCalculate = async () => {
    if (!selectedEmployeeId) {
      alert('Please select an employee');
      return;
    }

    try {
      setLoading(true);
      const response = await salaryApi.calculate({
        employeeId: selectedEmployeeId,
        month,
        year,
      });
      setCalculation(response.data);
      setDeductions('0');
      setNotes('');
    } catch (error: any) {
      console.error('Error calculating salary:', error);
      alert(error.response?.data?.message || 'Failed to calculate salary');
      setCalculation(null);
    } finally {
      setLoading(false);
    }
  };

  const handleProcess = async () => {
    if (!selectedEmployeeId) {
      alert('Please select an employee');
      return;
    }

    if (!calculation) {
      alert('Please calculate salary first');
      return;
    }

    try {
      setProcessing(true);
      await salaryApi.process({
        employeeId: selectedEmployeeId,
        month,
        year,
        deductions: Number(deductions) || 0,
        notes: notes || undefined,
      });

      alert('Salary processed successfully');
      setCalculation(null);
      setSelectedEmployeeId('');
      setDeductions('0');
      setNotes('');
      await fetchSalaryRecords();
    } catch (error: any) {
      console.error('Error processing salary:', error);
      alert(error.response?.data?.message || 'Failed to process salary');
    } finally {
      setProcessing(false);
    }
  };

  const getMonthName = (m: number) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[m - 1];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const filteredRecords = salaryRecords.filter(
    (record) => record.month === month && record.year === year
  );

  const netSalary = calculation ? calculation.totalSalary - Number(deductions || 0) : 0;

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
        <h1 className="text-3xl font-bold text-gray-900">Salary Processing</h1>
        <p className="text-gray-600 mt-1">Calculate and process monthly salaries</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Calculator */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              Calculate Salary
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Employee <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedEmployeeId}
                  onChange={(e) => {
                    setSelectedEmployeeId(e.target.value);
                    setCalculation(null);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Employee</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} - {emp.designation || 'Employee'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Month <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={month}
                    onChange={(e) => {
                      setMonth(Number(e.target.value));
                      setCalculation(null);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                      <option key={m} value={m}>
                        {getMonthName(m)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Year <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={year}
                    onChange={(e) => {
                      setYear(Number(e.target.value));
                      setCalculation(null);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                onClick={handleCalculate}
                disabled={loading || !selectedEmployeeId}
                className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 flex items-center justify-center gap-2"
              >
                <Calculator className="w-4 h-4" />
                {loading ? 'Calculating...' : 'Calculate'}
              </button>

              {/* Calculation Result */}
              {calculation && (
                <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
                  <h3 className="font-semibold text-gray-900">Calculation Breakdown</h3>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Working Days:</span>
                      <span className="font-medium">{calculation.workingDays}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Present Days:</span>
                      <span className="font-medium">{calculation.presentDays}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Half Days:</span>
                      <span className="font-medium">{calculation.halfDays}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Paid Leaves:</span>
                      <span className="font-medium text-green-600">{calculation.paidLeaves}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Unpaid Leaves:</span>
                      <span className="font-medium text-red-600">{calculation.unpaidLeaves}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Comp Leaves:</span>
                      <span className="font-medium text-blue-600">{calculation.compensatoryLeaves}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Daily Salary:</span>
                      <span className="font-medium">₹{calculation.dailySalary.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between mb-3">
                      <span className="font-semibold text-gray-900">Total Salary:</span>
                      <span className="font-bold text-gray-900">₹{calculation.totalSalary.toLocaleString()}</span>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Additional Deductions (₹)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={deductions}
                        onChange={(e) => setDeductions(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0"
                      />
                    </div>

                    <div className="mt-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Notes
                      </label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Optional notes..."
                      />
                    </div>

                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-900">Net Salary:</span>
                        <span className="text-2xl font-bold text-green-600">
                          ₹{netSalary.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={handleProcess}
                      disabled={processing}
                      className="w-full mt-4 px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors disabled:bg-green-400 flex items-center justify-center gap-2"
                    >
                      <DollarSign className="w-4 h-4" />
                      {processing ? 'Processing...' : 'Process Salary'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Salary Records */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Salary Records - {getMonthName(month)} {year}
              </h2>
            </div>
            <div className="p-6">
              {filteredRecords.length === 0 ? (
                <p className="text-gray-600 text-center py-8">No salary records for this period</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Days</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Leaves</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Deductions</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Net</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredRecords.map((record) => {
                        const emp = employees.find((e) => e.id === record.employeeId);
                        return (
                          <tr key={record.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3">
                              <div>
                                <p className="text-sm font-medium text-gray-900">{emp?.name || 'Unknown'}</p>
                                <p className="text-xs text-gray-500">{emp?.designation}</p>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900">
                              {record.presentDays}/{record.workingDays}
                            </td>
                            <td className="px-4 py-3 text-xs text-gray-600">
                              <div>P: {record.paidLeaves}</div>
                              <div>U: {record.unpaidLeaves}</div>
                              <div>C: {record.compensatoryLeaves}</div>
                              <div>H: {record.halfDays}</div>
                            </td>
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">
                              ₹{record.totalSalary.toLocaleString()}
                            </td>
                            <td className="px-4 py-3 text-sm text-red-600">
                              ₹{record.deductions.toLocaleString()}
                            </td>
                            <td className="px-4 py-3 text-sm font-bold text-green-600">
                              ₹{record.netSalary.toLocaleString()}
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                  record.isProcessed
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}
                              >
                                {record.isProcessed ? 'Processed' : 'Pending'}
                              </span>
                              {record.processedDate && (
                                <p className="text-xs text-gray-500 mt-1">
                                  {formatDate(record.processedDate)}
                                </p>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* All Records Summary */}
          <div className="mt-6 bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Year Summary - {year}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-blue-600 mb-1">Total Records</p>
                <p className="text-2xl font-bold text-blue-900">
                  {salaryRecords.filter((r) => r.year === year).length}
                </p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-sm text-green-600 mb-1">Processed</p>
                <p className="text-2xl font-bold text-green-900">
                  {salaryRecords.filter((r) => r.year === year && r.isProcessed).length}
                </p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <p className="text-sm text-purple-600 mb-1">Total Payout</p>
                <p className="text-2xl font-bold text-purple-900">
                  ₹{salaryRecords
                    .filter((r) => r.year === year && r.isProcessed)
                    .reduce((sum, r) => sum + Number(r.netSalary || 0), 0)
                    .toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
