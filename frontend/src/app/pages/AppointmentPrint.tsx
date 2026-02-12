import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CalendarDays, Clock3, Printer, Stethoscope, User } from 'lucide-react';

type AppointmentDetailDto = {
  id: number;
  name?: string | null;
  description?: string | null;
  scheduledOn?: string | null;
  notes?: string | null;
  type?: string | null;
  appointmentStatus?: string | null;
  clientName?: string | null;
  clientPhone?: string | null;
  clientEmail?: string | null;
  assignedEmployeeName?: string | null;
  employeePosition?: string | null;
};

const formatDate = (value?: string | null) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString();
};

const formatTime = (value?: string | null) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export function AppointmentPrint() {
  const { id } = useParams();
  const appointmentId = useMemo(() => Number(id), [id]);
  const [appointment, setAppointment] = useState<AppointmentDetailDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? 'https://localhost:5001';

  useEffect(() => {
    if (!id || Number.isNaN(appointmentId)) {
      setError('Invalid appointment id.');
      setIsLoading(false);
      return undefined;
    }

    const controller = new AbortController();

    const loadAppointment = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`${apiBaseUrl}/api/appointments/${appointmentId}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          const message = await response.json().catch(() => null);
          throw new Error(message?.message ?? 'Failed to load appointment.');
        }

        const data = (await response.json()) as AppointmentDetailDto;
        setAppointment(data);
      } catch (err) {
        if ((err as Error).name === 'AbortError') return;
        setError((err as Error).message ?? 'Failed to load appointment.');
      } finally {
        setIsLoading(false);
      }
    };

    loadAppointment();

    return () => controller.abort();
  }, [apiBaseUrl, appointmentId, id]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Appointment Print</h1>
          <p className="text-slate-600">Review details, then print the appointment slip.</p>
        </div>
        <div className="print-hide flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/appointments')}
            className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-slate-900"
          >
            <ArrowLeft size={16} />
            Back to Appointments
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
          >
            <Printer size={16} />
            Print
          </button>
        </div>
      </div>

      <div className="print-area rounded-3xl border border-white/60 bg-white p-6 shadow-lg">
        {error && (
          <div className="rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        {isLoading && !error && (
          <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-4 text-sm text-slate-500">
            Loading appointment details...
          </div>
        )}

        {appointment && !isLoading && (
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Patient</p>
              <p className="mt-1 text-sm font-medium text-slate-900">{appointment.clientName || '—'}</p>
              <p className="mt-1 text-xs text-slate-500">
                {appointment.clientEmail || '—'}
                {appointment.clientPhone ? ` • ${appointment.clientPhone}` : ''}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Doctor</p>
              <p className="mt-1 text-sm font-medium text-slate-900">
                {appointment.assignedEmployeeName || '—'}
              </p>
              <p className="mt-1 text-xs text-slate-500">{appointment.employeePosition || '—'}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Date</p>
              <p className="mt-1 flex items-center gap-2 text-sm font-medium text-slate-900">
                <CalendarDays size={16} />
                {formatDate(appointment.scheduledOn)}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Time</p>
              <p className="mt-1 flex items-center gap-2 text-sm font-medium text-slate-900">
                <Clock3 size={16} />
                {formatTime(appointment.scheduledOn)}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Type</p>
              <p className="mt-1 flex items-center gap-2 text-sm font-medium text-slate-900">
                <Stethoscope size={16} />
                {appointment.type || '—'}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Status</p>
              <p className="mt-1 text-sm font-medium text-slate-900">
                {appointment.appointmentStatus || '—'}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Appointment Name</p>
              <p className="mt-1 text-sm font-medium text-slate-900">{appointment.name || '—'}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Description</p>
              <p className="mt-1 text-sm font-medium text-slate-900">{appointment.description || '—'}</p>
            </div>
            <div className="lg:col-span-2">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Notes</p>
              <p className="mt-1 text-sm font-medium text-slate-900">{appointment.notes || '—'}</p>
            </div>
            <div className="lg:col-span-2 flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4 text-sm text-slate-600">
              <User size={16} />
              Please arrive 10 minutes early with your ID and insurance information.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
