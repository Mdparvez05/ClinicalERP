import { useState } from 'react';
import { Plus, Search, Filter, CalendarDays, Clock3, Printer, Eye, X, ChevronDown } from 'lucide-react';

const appointments = [
  { id: 1, patient: 'John Smith', doctor: 'Dr. Michael Chen', date: '2024-01-18', time: '09:00', type: 'Consultation', status: 'Scheduled' },
  { id: 2, patient: 'Emma Wilson', doctor: 'Dr. Sarah Johnson', date: '2024-01-18', time: '10:30', type: 'Follow Up', status: 'In Progress' },
  { id: 3, patient: 'Robert Brown', doctor: 'Dr. Michael Chen', date: '2024-01-18', time: '11:00', type: 'Lab Test', status: 'Completed' },
  { id: 4, patient: 'Maria Garcia', doctor: 'Dr. Sarah Johnson', date: '2024-01-18', time: '14:00', type: 'Consultation', status: 'Scheduled' },
  { id: 5, patient: 'David Lee', doctor: 'Dr. Michael Chen', date: '2024-01-18', time: '15:30', type: 'Follow Up', status: 'Cancelled' },
];

export function Appointments() {
  const [isAddOpen, setIsAddOpen] = useState(false);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Appointments</h1>
          <p className="text-gray-600">Manage and schedule patient appointments</p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={20} />
          New Appointment
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b flex flex-wrap gap-3 items-center">
          <div className="flex-1 min-w-[240px] relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search appointments..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-500" />
            <select className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option>All Status</option>
              <option>Scheduled</option>
              <option>In Progress</option>
              <option>Completed</option>
              <option>Cancelled</option>
            </select>
            <select className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option>All Types</option>
              <option>Consultation</option>
              <option>Follow Up</option>
              <option>Lab Test</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Doctor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date & Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {appointments.map((appt) => (
                <tr key={appt.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center">
                        <span className="text-cyan-600 text-sm font-medium">
                          {appt.patient.split(' ').map((n) => n[0]).join('')}
                        </span>
                      </div>
                      <span className="font-medium">{appt.patient}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{appt.doctor}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm flex items-center gap-3 text-gray-700">
                      <span className="flex items-center gap-1 text-gray-900"><CalendarDays size={16} /> {appt.date}</span>
                      <span className="flex items-center gap-1 text-gray-500"><Clock3 size={16} /> {appt.time}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{appt.type}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      appt.status === 'Scheduled' ? 'bg-blue-100 text-blue-700' :
                      appt.status === 'In Progress' ? 'bg-yellow-100 text-yellow-700' :
                      appt.status === 'Completed' ? 'bg-green-100 text-green-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {appt.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-3 text-sm font-medium">
                      <button className="text-primary-600 hover:text-primary-700 flex items-center gap-1">
                        <Eye size={16} /> View
                      </button>
                      <button className="text-gray-600 hover:text-gray-800 flex items-center gap-1">
                        <Printer size={16} /> Print
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsAddOpen(false)}
            aria-label="Close add appointment"
          />
          <div className="relative w-full max-w-lg mx-4 bg-white rounded-2xl shadow-xl border border-gray-100">
            <div className="flex items-start justify-between p-6 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-semibold">Schedule New Appointment</h2>
                <p className="text-sm text-gray-500">Fill in the details to schedule a new appointment.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Patient Name</label>
                <input
                  type="text"
                  placeholder="Enter patient name"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Doctor</label>
                <div className="relative">
                  <select className="appearance-none w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500">
                    <option>Select doctor</option>
                    <option>Dr. Michael Chen</option>
                    <option>Dr. Sarah Johnson</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <div className="relative">
                    <CalendarDays className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="date"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                  <div className="relative">
                    <Clock3 className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="time"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <div className="relative">
                  <select className="appearance-none w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500">
                    <option>Select type</option>
                    <option>Consultation</option>
                    <option>Follow-up</option>
                    <option>Lab Test</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-5 py-2 text-sm font-semibold bg-teal-600 text-white rounded-lg hover:bg-teal-700"
              >
                Schedule Appointment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
