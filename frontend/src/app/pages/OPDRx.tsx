import { Plus, Search, FileText, Filter, Eye, Printer } from 'lucide-react';

const prescriptions = [
  {
    id: 1,
    rxNumber: 'RX001',
    patient: 'John Smith',
    date: '2024-01-18',
    doctor: 'Dr. Michael Chen',
    diagnosis: 'Hypertension',
    medications: [
      { name: 'Amlodipine', dosage: '5mg, Once daily for 30 days', instructions: 'Take in the morning' },
      { name: 'Losartan', dosage: '50mg, Once daily for 30 days', instructions: 'Take with food' },
    ],
    notes: 'Follow up in 4 weeks. Monitor blood pressure daily.',
    status: 'Sent',
  },
  {
    id: 2,
    rxNumber: 'RX002',
    patient: 'Emma Wilson',
    date: '2024-01-18',
    doctor: 'Dr. Sarah Johnson',
    diagnosis: 'Common Cold',
    medications: [
      { name: 'Paracetamol', dosage: '500mg, Three times daily for 5 days', instructions: 'Take after meals' },
    ],
    notes: 'Rest and stay hydrated.',
    status: 'Dispensed',
  },
];

const templates = [
  { name: 'General Checkup', count: 18 },
  { name: 'Cold & Flu', count: 12 },
  { name: 'Hypertension Follow-up', count: 9 },
  { name: 'Diabetes Review', count: 7 },
];

export function OPDRx() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">OPD Rx</h1>
          <p className="text-gray-600">Manage prescriptions and OPD records</p>
        </div>
        <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <Plus size={20} />
          New Prescription
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-lg shadow-md p-4 flex flex-wrap items-center gap-3">
            <div className="flex-1 min-w-[240px] flex items-center gap-2 border px-3 py-2 rounded-lg">
              <Search className="text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search prescriptions..."
                className="w-full outline-none"
              />
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Filter size={18} />
              <select className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option>All Status</option>
                <option>Active</option>
                <option>Completed</option>
                <option>Draft</option>
              </select>
              <select className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option>All Doctors</option>
                <option>Dr. Sarah Johnson</option>
                <option>Dr. Michael Chen</option>
                <option>Dr. Emily Davis</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {prescriptions.map((rx) => (
              <div key={rx.id} className="bg-white rounded-lg shadow-md p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm text-gray-500">#{rx.id}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        rx.status === 'Active' ? 'bg-green-100 text-green-700' :
                        rx.status === 'Completed' ? 'bg-blue-100 text-blue-700' :
                        rx.status === 'Sent' ? 'bg-cyan-100 text-cyan-700' :
                        rx.status === 'Dispensed' ? 'bg-purple-100 text-purple-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {rx.status}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold">{rx.patient}</h3>
                    <p className="text-gray-600">{rx.diagnosis}</p>
                    <div className="text-sm text-gray-500 mt-1">{rx.doctor} • {rx.date}</div>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-medium">
                    <button className="text-primary-600 hover:text-primary-700 flex items-center gap-1">
                      <Eye size={16} /> View
                    </button>
                    <button className="text-gray-600 hover:text-gray-800 flex items-center gap-1">
                      <Printer size={16} /> Print
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold mb-4">Recent Templates</h3>
            <div className="space-y-3">
              {templates.map((template, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-50 text-primary-600 rounded-lg flex items-center justify-center">
                    <FileText size={20} />
                  </div>
                  <div>
                    <div className="font-medium">{template.name}</div>
                    <div className="text-sm text-gray-500">{template.count} uses</div>
                  </div>
                  <button className="ml-auto text-primary-600 hover:text-primary-700 text-sm font-medium">
                    Use
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
