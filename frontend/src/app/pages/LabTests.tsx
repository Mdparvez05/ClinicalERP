import { Plus, Search, ChevronDown, TestTube } from 'lucide-react';

export function LabTests() {
  const labTests = [
    {
      id: 1,
      name: 'Complete Blood Count (CBC)',
      category: 'Hematology',
      patient: 'John Smith',
      doctor: 'Dr. Michael Chen',
      date: '2024-01-17',
      price: 45,
      status: 'Completed',
    },
    {
      id: 2,
      name: 'Lipid Panel',
      category: 'Biochemistry',
      patient: 'Emma Wilson',
      doctor: 'Dr. Sarah Johnson',
      date: '2024-01-18',
      price: 65,
      status: 'In Progress',
    },
    {
      id: 3,
      name: 'Thyroid Function Test (TFT)',
      category: 'Endocrinology',
      patient: 'Robert Brown',
      doctor: 'Dr. Michael Chen',
      date: '2024-01-18',
      price: 85,
      status: 'Pending',
    },
    {
      id: 4,
      name: 'Urinalysis',
      category: 'Clinical Pathology',
      patient: 'Maria Garcia',
      doctor: 'Dr. Sarah Johnson',
      date: '2024-01-16',
      price: 25,
      status: 'Completed',
    },
    {
      id: 5,
      name: 'HbA1c',
      category: 'Diabetes',
      patient: 'David Lee',
      doctor: 'Dr. Michael Chen',
      date: '2024-01-18',
      price: 55,
      status: 'Pending',
    },
  ];

  const statusStyles: Record<
    string,
    { badge: string; dot: string; action: string; actionStyle: string }
  > = {
    Completed: {
      badge: 'bg-green-100 text-green-700',
      dot: 'bg-green-500',
      action: 'View Result',
      actionStyle: 'border border-gray-200 text-gray-700 hover:bg-gray-50',
    },
    'In Progress': {
      badge: 'bg-blue-100 text-blue-700',
      dot: 'bg-blue-500',
      action: 'Add Result',
      actionStyle: 'bg-teal-600 text-white hover:bg-teal-700',
    },
    Pending: {
      badge: 'bg-amber-100 text-amber-700',
      dot: 'bg-amber-500',
      action: 'Start',
      actionStyle: 'border border-gray-200 text-gray-700 hover:bg-gray-50',
    },
    Cancelled: {
      badge: 'bg-red-100 text-red-700',
      dot: 'bg-red-500',
      action: 'View',
      actionStyle: 'border border-gray-200 text-gray-700 hover:bg-gray-50',
    },
  };

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Lab Tests</h1>
          <p className="text-gray-600">Manage diagnostic tests and results</p>
        </div>
        <button className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <Plus size={20} />
          Order Test
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search tests..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
            />
          </div>
          <div className="relative">
            <select className="appearance-none w-full min-w-[180px] rounded-lg border border-gray-200 bg-white px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500">
              <option>All Status</option>
              <option>Pending</option>
              <option>In Progress</option>
              <option>Completed</option>
              <option>Cancelled</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="text-left font-medium px-6 py-3">Test</th>
                <th className="text-left font-medium px-6 py-3">Patient</th>
                <th className="text-left font-medium px-6 py-3">Doctor</th>
                <th className="text-left font-medium px-6 py-3">Date</th>
                <th className="text-left font-medium px-6 py-3">Price</th>
                <th className="text-left font-medium px-6 py-3">Status</th>
                <th className="text-left font-medium px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {labTests.map((test) => {
                const styles = statusStyles[test.status];
                return (
                  <tr key={test.id} className="hover:bg-gray-50/60">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center">
                          <TestTube size={18} className="text-teal-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{test.name}</p>
                          <p className="text-xs text-gray-500">{test.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{test.patient}</td>
                    <td className="px-6 py-4 text-gray-700">{test.doctor}</td>
                    <td className="px-6 py-4 text-gray-600">{test.date}</td>
                    <td className="px-6 py-4 font-semibold text-gray-900">${test.price}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${
                          styles.badge
                        }`}
                      >
                        <span className={`h-2 w-2 rounded-full ${styles.dot}`} />
                        {test.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
                          styles.actionStyle
                        }`}
                      >
                        {styles.action}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
