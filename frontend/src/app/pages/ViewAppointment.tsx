import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CalendarDays, Check, Clock3, FileText, Mail, Pencil, Phone, Stethoscope, User, X } from 'lucide-react';

type AppointmentDetailDto = {
  id: number;
  name?: string | null;
  description?: string | null;
  scheduledOn?: string | null;
  closedOn?: string | null;
  notes?: string | null;
  type?: string | null;
  appointmentStatus?: string | null;
  clientId?: number | null;
  clientName?: string | null;
  clientPhone?: string | null;
  clientEmail?: string | null;
  assignedEmployeeId?: number | null;
  assignedEmployeeName?: string | null;
  employeePosition?: string | null;
  prescribedBy?: number | null;
  prescribedByName?: string | null;
  parentId?: number | null;
  parentAppointmentName?: string | null;
};

type DoctorOption = {
  id: number;
  firstName?: string | null;
  lastName?: string | null;
  fullName?: string | null;
  position?: string | null;
};

type AppointmentFormState = {
  name: string;
  description: string;
  notes: string;
  type: string;
  appointmentStatus: string;
  scheduledDate: string;
  scheduledTime: string;
  assignedEmployeeId: number | null;
  prescribedById: number | null;
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

const toDateInputValue = (value?: string | null) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
};

const toTimeInputValue = (value?: string | null) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

const getDoctorDisplayName = (doctor: DoctorOption) => {
  if (doctor.fullName?.trim()) return doctor.fullName.trim();
  return `${doctor.firstName ?? ''} ${doctor.lastName ?? ''}`.trim();
};

const statusClassName = (status?: string | null) => {
  switch (status) {
    case 'Scheduled':
      return 'bg-blue-100 text-blue-700';
    case 'In Progress':
      return 'bg-yellow-100 text-yellow-700';
    case 'Completed':
      return 'bg-green-100 text-green-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

export function ViewAppointment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? 'https://localhost:5001';
  const appointmentId = useMemo(() => Number(id), [id]);
  const [appointment, setAppointment] = useState<AppointmentDetailDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [appointmentTypes, setAppointmentTypes] = useState<string[]>([]);
  const [appointmentStatuses, setAppointmentStatuses] = useState<string[]>([]);
  const [doctors, setDoctors] = useState<DoctorOption[]>([]);
  const [optionsError, setOptionsError] = useState<string | null>(null);
  const [formState, setFormState] = useState<AppointmentFormState>({
    name: '',
    description: '',
    notes: '',
    type: '',
    appointmentStatus: 'Scheduled',
    scheduledDate: '',
    scheduledTime: '',
    assignedEmployeeId: null,
    prescribedById: null,
  });

  const buildFormState = (data: AppointmentDetailDto): AppointmentFormState => ({
    name: data.name ?? '',
    description: data.description ?? '',
    notes: data.notes ?? '',
    type: data.type ?? '',
    appointmentStatus: data.appointmentStatus ?? 'Scheduled',
    scheduledDate: toDateInputValue(data.scheduledOn),
    scheduledTime: toTimeInputValue(data.scheduledOn),
    assignedEmployeeId: data.assignedEmployeeId ?? null,
    prescribedById: data.prescribedBy ?? null,
  });

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

  useEffect(() => {
    if (!appointment || isEditing) return;
    setFormState(buildFormState(appointment));
  }, [appointment, isEditing]);

  useEffect(() => {
    const controller = new AbortController();

    const loadOptions = async () => {
      try {
        setOptionsError(null);

        const [typesRes, statusesRes, doctorsRes] = await Promise.all([
          fetch(`${apiBaseUrl}/api/master/appointmenttypes`, { signal: controller.signal }),
          fetch(`${apiBaseUrl}/api/master/appointment-statuses`, { signal: controller.signal }),
          fetch(`${apiBaseUrl}/api/appointments/doctors`, { signal: controller.signal }),
        ]);

        if (!typesRes.ok) throw new Error('Failed to load appointment types.');
        if (!statusesRes.ok) throw new Error('Failed to load appointment statuses.');
        if (!doctorsRes.ok) throw new Error('Failed to load doctors.');

        const typesJson = (await typesRes.json()) as string[];
        const statusesJson = (await statusesRes.json()) as string[];
        const doctorsJson = (await doctorsRes.json()) as DoctorOption[];

        setAppointmentTypes(Array.isArray(typesJson) ? typesJson : []);
        setAppointmentStatuses(Array.isArray(statusesJson) ? statusesJson : []);
        setDoctors(Array.isArray(doctorsJson) ? doctorsJson : []);
      } catch (err) {
        if ((err as Error).name === 'AbortError') return;
        setOptionsError((err as Error).message ?? 'Failed to load appointment options.');
      }
    };

    loadOptions();

    return () => controller.abort();
  }, [apiBaseUrl]);

  const handleStartEdit = () => {
    if (!appointment) return;
    setFormState(buildFormState(appointment));
    setSaveError(null);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    if (appointment) setFormState(buildFormState(appointment));
    setSaveError(null);
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!appointment) return;

    if (!formState.scheduledDate || !formState.scheduledTime) {
      setSaveError('Please select a date and time.');
      return;
    }

    if (!formState.assignedEmployeeId) {
      setSaveError('Please select an assigned doctor.');
      return;
    }

    const scheduled = new Date(`${formState.scheduledDate}T${formState.scheduledTime}`);
    if (Number.isNaN(scheduled.getTime())) {
      setSaveError('Please enter a valid date and time.');
      return;
    }

    const doctor = doctors.find((item) => item.id === formState.assignedEmployeeId);
    const doctorName = doctor ? getDoctorDisplayName(doctor) : '';

    if (!doctorName) {
      setSaveError('Please select a valid doctor.');
      return;
    }

    const payload = {
      id: appointment.id,
      scheduledOn: scheduled.toISOString(),
      appointmentStatus: formState.appointmentStatus || undefined,
      type: formState.type || undefined,
      name: formState.name.trim() || undefined,
      description: formState.description.trim() || undefined,
      notes: formState.notes.trim() || undefined,
      assignedEmployeeId: formState.assignedEmployeeId,
      assignedEmployeeName: doctorName,
      prescribedBy: formState.prescribedById ?? undefined,
    };

    try {
      setIsSaving(true);
      setSaveError(null);

      const response = await fetch(`${apiBaseUrl}/api/appointments/${appointment.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const message = await response.json().catch(() => null);
        throw new Error(message?.message ?? 'Failed to update appointment.');
      }

      const data = (await response.json()) as AppointmentDetailDto;
      setAppointment(data);
      setIsEditing(false);
    } catch (err) {
      setSaveError((err as Error).message ?? 'Failed to update appointment.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={() => navigate('/appointments')}
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={16} /> Back to Appointments
          </button>
          <h1 className="mt-2 text-3xl font-bold">Appointment Details</h1>
          <p className="text-gray-600">Review appointment information and patient details.</p>
        </div>
        {appointment && (
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-3 rounded-full bg-white px-4 py-2 shadow-sm">
              <span className="text-sm text-gray-500">#{appointment.id}</span>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClassName(appointment.appointmentStatus)}`}>
                {appointment.appointmentStatus ?? 'Unknown'}
              </span>
            </div>
            {!isEditing && (
              <button
                type="button"
                onClick={handleStartEdit}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
              >
                <Pencil size={16} /> Edit
              </button>
            )}
            {isEditing && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                  disabled={isSaving}
                >
                  <X size={16} /> Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-700 disabled:opacity-60"
                  disabled={isSaving}
                >
                  <Check size={16} /> {isSaving ? 'Saving...' : 'Save'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {saveError && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
          {saveError}
        </div>
      )}

      {optionsError && isEditing && (
        <div className="rounded-lg bg-amber-50 p-4 text-sm text-amber-700">
          {optionsError}
        </div>
      )}

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {isLoading && (
        <div className="rounded-lg bg-white p-6 shadow-md">
          <p className="text-gray-600">Loading appointment details...</p>
        </div>
      )}

      {!isLoading && appointment && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-lg bg-white p-6 shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-100 text-cyan-700">
                    <FileText size={18} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Appointment</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formState.name}
                        onChange={(event) => setFormState((prev) => ({ ...prev, name: event.target.value }))}
                        className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-base font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                        placeholder="Appointment name"
                      />
                    ) : (
                      <h2 className="text-xl font-semibold">
                        {appointment.name?.trim() || 'General Consultation'}
                      </h2>
                    )}
                  </div>
                </div>
                {isEditing ? (
                  <select
                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                    value={formState.type}
                    onChange={(event) => setFormState((prev) => ({ ...prev, type: event.target.value }))}
                  >
                    <option value="">Select type</option>
                    {appointmentTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className="text-sm text-gray-500">Type: {appointment.type ?? '—'}</span>
                )}
              </div>
              {isEditing ? (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    rows={4}
                    value={formState.description}
                    onChange={(event) => setFormState((prev) => ({ ...prev, description: event.target.value }))}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                    placeholder="Add a short description"
                  />
                </div>
              ) : (
                <p className="mt-4 text-gray-700">
                  {appointment.description?.trim() || 'No description added for this appointment.'}
                </p>
              )}
            </div>

            <div className="rounded-lg bg-white p-6 shadow-md">
              <h3 className="text-lg font-semibold mb-4">Patient</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-100 text-teal-700">
                    <User size={16} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium text-gray-900">{appointment.clientName ?? '—'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                    <Phone size={16} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium text-gray-900">{appointment.clientPhone ?? '—'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-indigo-700">
                    <Mail size={16} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-900">{appointment.clientEmail ?? '—'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700">
                    <FileText size={16} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Patient ID</p>
                    <p className="font-medium text-gray-900">{appointment.clientId ?? '—'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-md">
              <h3 className="text-lg font-semibold mb-4">Clinical Notes</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Notes</p>
                  {isEditing ? (
                    <textarea
                      rows={4}
                      value={formState.notes}
                      onChange={(event) => setFormState((prev) => ({ ...prev, notes: event.target.value }))}
                      className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                      placeholder="Add notes"
                    />
                  ) : (
                    <p className="text-gray-700">{appointment.notes?.trim() || 'No notes available.'}</p>
                  )}
                </div>
                {appointment.parentId && (
                  <div>
                    <p className="text-sm text-gray-500">Follow-up</p>
                    <p className="text-gray-700">
                      #{appointment.parentId} {appointment.parentAppointmentName ? `- ${appointment.parentAppointmentName}` : ''}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-lg bg-white p-6 shadow-md">
              <h3 className="text-lg font-semibold mb-4">Schedule</h3>
              {isEditing ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                    <div className="relative">
                      <CalendarDays className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="date"
                        value={formState.scheduledDate}
                        onChange={(event) => setFormState((prev) => ({ ...prev, scheduledDate: event.target.value }))}
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                    <div className="relative">
                      <Clock3 className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="time"
                        value={formState.scheduledTime}
                        onChange={(event) => setFormState((prev) => ({ ...prev, scheduledTime: event.target.value }))}
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                      />
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    Closed On: {formatDate(appointment.closedOn)}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-gray-700">
                    <CalendarDays size={16} />
                    <span>{formatDate(appointment.scheduledOn)}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <Clock3 size={16} />
                    <span>{formatTime(appointment.scheduledOn)}</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    Closed On: {formatDate(appointment.closedOn)}
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-lg bg-white p-6 shadow-md">
              <h3 className="text-lg font-semibold mb-4">Clinician</h3>
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Assigned Doctor</label>
                    <select
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                      value={formState.assignedEmployeeId ?? ''}
                      onChange={(event) => {
                        const value = Number(event.target.value);
                        setFormState((prev) => ({ ...prev, assignedEmployeeId: Number.isNaN(value) ? null : value }));
                      }}
                    >
                      <option value="">Select doctor</option>
                      {doctors.map((doctor) => (
                        <option key={doctor.id} value={doctor.id}>
                          {getDoctorDisplayName(doctor) || `Doctor #${doctor.id}`}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Prescribed By</label>
                    <select
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                      value={formState.prescribedById ?? ''}
                      onChange={(event) => {
                        const value = Number(event.target.value);
                        setFormState((prev) => ({ ...prev, prescribedById: Number.isNaN(value) ? null : value }));
                      }}
                    >
                      <option value="">Select prescribing doctor (optional)</option>
                      {doctors.map((doctor) => (
                        <option key={doctor.id} value={doctor.id}>
                          {getDoctorDisplayName(doctor) || `Doctor #${doctor.id}`}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                      <Stethoscope size={16} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Assigned Doctor</p>
                      <p className="font-medium text-gray-900">{appointment.assignedEmployeeName ?? '—'}</p>
                      <p className="text-sm text-gray-500">{appointment.employeePosition ?? '—'}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Prescribed By</p>
                    <p className="font-medium text-gray-900">{appointment.prescribedByName ?? '—'}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-lg bg-white p-6 shadow-md">
              <h3 className="text-lg font-semibold mb-4">Status</h3>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Current status</span>
                {isEditing ? (
                  <select
                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                    value={formState.appointmentStatus}
                    onChange={(event) => setFormState((prev) => ({ ...prev, appointmentStatus: event.target.value }))}
                  >
                    {appointmentStatuses.length === 0 && (
                      <option value="Scheduled">Scheduled</option>
                    )}
                    {appointmentStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClassName(appointment.appointmentStatus)}`}>
                    {appointment.appointmentStatus ?? 'Unknown'}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
