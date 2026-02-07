import { useEffect, useMemo, useState } from 'react';
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

type AppointmentDto = {
  id: number;
  clientId: number;
  clientName: string;
  scheduledOn: string;
  appointmentStatus?: string | null;
  assignedEmployeeId: number;
  employeeName : string;
};

type TodayAppointmentsDto = {
  date: string;
  totalAppointments: number;
  appointments: AppointmentDto[];
};

export function Dashboard() {
  const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? 'https://localhost:5001';

  const [todayAppointments, setTodayAppointments] = useState<TodayAppointmentsDto | null>(null);
  const [pendingLabTests, setPendingLabTests] = useState<number>(0);
  const [totalClients, setTotalClients] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const formattedAppointments = useMemo(() => {
    if (!todayAppointments) return [] as AppointmentDto[];
    return todayAppointments.appointments;
  }, [todayAppointments]);

  useEffect(() => {
    const controller = new AbortController();

    const loadDashboard = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [todayRes, pendingRes, totalRes] = await Promise.all([
          fetch(`${apiBaseUrl}/api/dashboard/today-appointments`, { signal: controller.signal }),
          fetch(`${apiBaseUrl}/api/dashboard/getPendingLabTests`, { signal: controller.signal }),
          fetch(`${apiBaseUrl}/api/dashboard/getTotalClients`, { signal: controller.signal }),
        ]);

        if (!todayRes.ok) throw new Error('Failed to load today appointments');
        if (!pendingRes.ok) throw new Error('Failed to load pending lab tests');
        if (!totalRes.ok) throw new Error('Failed to load total clients');

        const todayJson = (await todayRes.json()) as TodayAppointmentsDto;
        const pendingJson = (await pendingRes.json()) as number;
        const totalJson = (await totalRes.json()) as number;

        setTodayAppointments(todayJson);
        setPendingLabTests(pendingJson);
        setTotalClients(totalJson);
      } catch (err) {
        if ((err as Error).name === 'AbortError') return;
        setError((err as Error).message ?? 'Failed to load dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboard();

    return () => controller.abort();
  }, [apiBaseUrl]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Welcome back, Dr.</h1>
      <p className="text-gray-600 mb-8">Here's what's happening at your clinic today</p>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

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
          <h3 className="text-3xl font-bold mb-1">
            {isLoading ? '—' : todayAppointments?.totalAppointments ?? 0}
          </h3>
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
          <h3 className="text-3xl font-bold mb-1">{isLoading ? '—' : pendingLabTests}</h3>
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
          <h3 className="text-3xl font-bold mb-1">{isLoading ? '—' : totalClients.toLocaleString()}</h3>
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
            {!isLoading && formattedAppointments.length === 0 && (
              <div className="rounded-lg bg-gray-50 p-4 text-sm text-gray-600">
                No appointments scheduled for today.
              </div>
            )}
            {formattedAppointments.map((appt) => (
              <div key={appt.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center">
                  <Users className="text-cyan-600" size={20} />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">{appt.clientName}</h4>
                  <p className="text-sm text-gray-600">
                    {new Date(appt.scheduledOn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    {' • '}{appt.employeeName}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  appt.appointmentStatus === 'Scheduled' ? 'bg-blue-100 text-blue-700' :
                  appt.appointmentStatus === 'In Progress' ? 'bg-yellow-100 text-yellow-700' :
                  appt.appointmentStatus === 'Completed' ? 'bg-green-100 text-green-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {appt.appointmentStatus ?? 'Unknown'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
