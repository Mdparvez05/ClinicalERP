import { TrendingUp, TrendingDown, Calendar, Users, DollarSign, TestTube } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const revenueData = [
  { day: 'Mon', revenue: 3200 },
  { day: 'Tue', revenue: 3800 },
  { day: 'Wed', revenue: 4200 },
  { day: 'Thu', revenue: 4800 },
  { day: 'Fri', revenue: 5200 },
  { day: 'Sat', revenue: 4600 },
  { day: 'Sun', revenue: 3800 },
];

const appointments = [
  { id: 1, patient: 'John Smith', time: '09:00', doctor: 'Dr. Michael Chen', status: 'Scheduled' },
  { id: 2, patient: 'Emma Wilson', time: '10:30', doctor: 'Dr. Sarah Johnson', status: 'In Progress' },
  { id: 3, patient: 'Robert Brown', time: '11:00', doctor: 'Dr. Michael Chen', status: 'Completed' },
];

export function Dashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Welcome back, Dr.</h1>
      <p className="text-gray-600 mb-8">Here's what's happening at your clinic today</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="text-blue-600" size={24} />
            </div>
            <div className="flex items-center text-green-600 text-sm">
              <TrendingUp size={16} />
              <span className="ml-1">12%</span>
            </div>
          </div>
          <h3 className="text-3xl font-bold mb-1">12</h3>
          <p className="text-gray-600 text-sm">Today's Appointments</p>
          <p className="text-gray-400 text-xs mt-1">vs last week</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <TestTube className="text-red-600" size={24} />
            </div>
            <div className="flex items-center text-red-600 text-sm">
              <TrendingDown size={16} />
              <span className="ml-1">5%</span>
            </div>
          </div>
          <h3 className="text-3xl font-bold mb-1">8</h3>
          <p className="text-gray-600 text-sm">Pending Lab Tests</p>
          <p className="text-gray-400 text-xs mt-1">vs last week</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
              <Users className="text-cyan-600" size={24} />
            </div>
            <div className="flex items-center text-green-600 text-sm">
              <TrendingUp size={16} />
              <span className="ml-1">8%</span>
            </div>
          </div>
          <h3 className="text-3xl font-bold mb-1">1,247</h3>
          <p className="text-gray-600 text-sm">Total Patients</p>
          <p className="text-gray-400 text-xs mt-1">vs last week</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="text-green-600" size={24} />
            </div>
            <div className="flex items-center text-green-600 text-sm">
              <TrendingUp size={16} />
              <span className="ml-1">15%
              </span>
            </div>
          </div>
          <h3 className="text-3xl font-bold mb-1">$3,450</h3>
          <p className="text-gray-600 text-sm">Today's Revenue</p>
          <p className="text-gray-400 text-xs mt-1">vs last week</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-2">Weekly Revenue</h3>
          <p className="text-gray-600 text-sm mb-6">Revenue trends for this week</p>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#14b8a6" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-6">Today's Appointments</h3>
          <div className="space-y-4">
            {appointments.map((appt) => (
              <div key={appt.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center">
                  <Users className="text-cyan-600" size={20} />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">{appt.patient}</h4>
                  <p className="text-sm text-gray-600">{appt.time} • {appt.doctor}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  appt.status === 'Scheduled' ? 'bg-blue-100 text-blue-700' :
                  appt.status === 'In Progress' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {appt.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
