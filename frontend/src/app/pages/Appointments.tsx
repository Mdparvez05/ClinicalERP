import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, CalendarDays, Clock3, Printer, Eye, X, ChevronDown } from 'lucide-react';

type AppointmentDto = {
  id: number;
  clientId?: number | null;
  clientName?: string | null;
  scheduledOn?: string | null;
  employeeName?: string | null;
  appointmentStatus?: string | null;
  appointmentType?: string | null;
  assignedEmployeeId?: number | null;
  name?: string | null;
  description?: string | null;
  notes?: string | null;
};

type AppointmentRow = {
  id: number;
  patient: string;
  doctor: string;
  date: string;
  time: string;
  type: string;
  status: string;
};

type PatientSearchResult = {
  id: number;
  firstName: string;
  lastName: string;
  email?: string | null;
  medicalRecordNumber?: string | null;
};

type DoctorOption = {
  id: number;
  firstName?: string | null;
  lastName?: string | null;
  fullName?: string | null;
};

const formatDate = (value: string | null) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString();
};

const formatTime = (value: string | null) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const getPatientDisplayName = (patient: PatientSearchResult) => {
  return `${patient.firstName} ${patient.lastName}`.trim();
};

const getDoctorDisplayName = (doctor: DoctorOption) => {
  if (doctor.fullName?.trim()) return doctor.fullName.trim();
  return `${doctor.firstName ?? ''} ${doctor.lastName ?? ''}`.trim();
};

export function Appointments() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const navigate = useNavigate();
  const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? 'https://localhost:5001';
  const [appointments, setAppointments] = useState<AppointmentDto[]>([]);
  const [appointmentTypes, setAppointmentTypes] = useState<string[]>([]);
  const [appointmentStatuses, setAppointmentStatuses] = useState<string[]>([]);
  const [doctors, setDoctors] = useState<DoctorOption[]>([]);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [patientQuery, setPatientQuery] = useState('');
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);
  const [patientSuggestions, setPatientSuggestions] = useState<PatientSearchResult[]>([]);
  const [isPatientLoading, setIsPatientLoading] = useState(false);
  const [showPatientSuggestions, setShowPatientSuggestions] = useState(false);
  const [patientSearchError, setPatientSearchError] = useState<string | null>(null);
  const [selectedDoctorId, setSelectedDoctorId] = useState<number | null>(null);
  const [prescribedById, setPrescribedById] = useState<number | null>(null);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [appointmentType, setAppointmentType] = useState('');
  const [appointmentStatus, setAppointmentStatus] = useState('Scheduled');
  const [appointmentName, setAppointmentName] = useState('');
  const [appointmentDescription, setAppointmentDescription] = useState('');
  const [appointmentNotes, setAppointmentNotes] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const appointmentRows = useMemo<AppointmentRow[]>(() => {
    return appointments.map((appt) => ({
      id: appt.id,
      patient: appt.clientName ?? '—',
      doctor: appt.employeeName ?? '—',
      date: formatDate(appt.scheduledOn ?? null),
      time: formatTime(appt.scheduledOn ?? null),
      type: appt.appointmentType ?? '—',
      status: appt.appointmentStatus ?? '—',
    }));
  }, [appointments]);

  const filteredAppointments = useMemo(() => {
    const query = searchText.trim().toLowerCase();

    return appointmentRows.filter((appt) => {
      const matchesSearch = query.length === 0
        || appt.patient.toLowerCase().includes(query)
        || appt.doctor.toLowerCase().includes(query)
        || appt.type.toLowerCase().includes(query)
        || appt.status.toLowerCase().includes(query)
        || appt.date.toLowerCase().includes(query)
        || appt.time.toLowerCase().includes(query);

      const matchesStatus = statusFilter === 'All Status' || appt.status === statusFilter;
      const matchesType = typeFilter === 'All Types' || appt.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [appointmentRows, searchText, statusFilter, typeFilter]);

  const loadAppointments = useCallback(async (signal?: AbortSignal) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`${apiBaseUrl}/api/dashboard/total-appointments`, {
        signal,
      });

      if (!response.ok) throw new Error('Failed to load appointments');

      const data = (await response.json()) as AppointmentDto[];
      setAppointments(Array.isArray(data) ? data : []);
    } catch (err) {
      if ((err as Error).name === 'AbortError') return;
      setError((err as Error).message ?? 'Failed to load appointments');
    } finally {
      setIsLoading(false);
    }
  }, [apiBaseUrl]);

  useEffect(() => {
    const controller = new AbortController();

    loadAppointments(controller.signal);

    return () => controller.abort();
  }, [loadAppointments]);

  useEffect(() => {
    if (!isAddOpen) {
      setPatientSuggestions([]);
      setShowPatientSuggestions(false);
      setPatientSearchError(null);
      setSelectedPatientId(null);
      setPatientQuery('');
      setSelectedDoctorId(null);
      setPrescribedById(null);
      setScheduledDate('');
      setScheduledTime('');
      setAppointmentType('');
      setAppointmentStatus('Scheduled');
      setAppointmentName('');
      setAppointmentDescription('');
      setAppointmentNotes('');
      setSubmitError(null);
      setIsSubmitting(false);
      return undefined;
    }

    const term = patientQuery.trim();

    if (term.length < 2) {
      setPatientSuggestions([]);
      setPatientSearchError(null);
      return undefined;
    }

    const controller = new AbortController();
    const handle = window.setTimeout(async () => {
      try {
        setIsPatientLoading(true);
        setPatientSearchError(null);

        const response = await fetch(
          `${apiBaseUrl}/api/Patient/search/${encodeURIComponent(term)}`,
          { signal: controller.signal },
        );

        if (!response.ok) throw new Error('Failed to search patients');

        const data = (await response.json()) as PatientSearchResult[];
        setPatientSuggestions(Array.isArray(data) ? data : []);
        setShowPatientSuggestions(true);
      } catch (err) {
        if ((err as Error).name === 'AbortError') return;
        setPatientSearchError((err as Error).message ?? 'Failed to search patients');
      } finally {
        setIsPatientLoading(false);
      }
    }, 300);

    return () => {
      controller.abort();
      window.clearTimeout(handle);
    };
  }, [apiBaseUrl, isAddOpen, patientQuery]);

  useEffect(() => {
    const controller = new AbortController();

    const loadOptions = async () => {
      try {
        const [typesRes, statusesRes] = await Promise.all([
          fetch(`${apiBaseUrl}/api/master/appointmenttypes`, { signal: controller.signal }),
          fetch(`${apiBaseUrl}/api/master/appointment-statuses`, { signal: controller.signal }),
        ]);

        if (!typesRes.ok) throw new Error('Failed to load appointment types');
        if (!statusesRes.ok) throw new Error('Failed to load appointment statuses');

        const typesJson = (await typesRes.json()) as string[];
        const statusesJson = (await statusesRes.json()) as string[];

        const nextTypes = Array.isArray(typesJson) ? typesJson : [];
        const nextStatuses = Array.isArray(statusesJson) ? statusesJson : [];

        setAppointmentTypes(nextTypes);
        setAppointmentStatuses(nextStatuses);
        if (nextStatuses.length > 0 && !nextStatuses.includes(appointmentStatus)) {
          setAppointmentStatus(nextStatuses[0]);
        }
      } catch (err) {
        if ((err as Error).name === 'AbortError') return;
        setError((err as Error).message ?? 'Failed to load appointment options');
      }
    };

    loadOptions();

    return () => controller.abort();
  }, [apiBaseUrl, appointmentStatus]);

  const handleCreateAppointment = async () => {
    if (!selectedPatientId) {
      setSubmitError('Please select a patient from the suggestions.');
      return;
    }

    if (!selectedDoctorId) {
      setSubmitError('Please select a doctor.');
      return;
    }

    if (!scheduledDate || !scheduledTime) {
      setSubmitError('Please select a date and time.');
      return;
    }

    const scheduled = new Date(`${scheduledDate}T${scheduledTime}`);
    if (Number.isNaN(scheduled.getTime())) {
      setSubmitError('Please enter a valid date and time.');
      return;
    }

    const doctor = doctors.find((item) => item.id === selectedDoctorId);
    const doctorName = doctor ? getDoctorDisplayName(doctor) : '';

    if (!doctorName) {
      setSubmitError('Please select a valid doctor.');
      return;
    }

    const payload = {
      clientId: selectedPatientId,
      clientName: patientQuery.trim(),
      assignedEmployeeId: selectedDoctorId,
      assignedEmployeeName: doctorName,
      prescribedBy: prescribedById ?? undefined,
      scheduledOn: scheduled.toISOString(),
      type: appointmentType || undefined,
      appointmentStatus: appointmentStatus || 'Scheduled',
      name: appointmentName.trim() || undefined,
      description: appointmentDescription.trim() || undefined,
      notes: appointmentNotes.trim() || undefined,
    };

    try {
      setIsSubmitting(true);
      setSubmitError(null);

      const response = await fetch(`${apiBaseUrl}/api/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to create appointment');

      setIsAddOpen(false);
      await loadAppointments();
    } catch (err) {
      setSubmitError((err as Error).message ?? 'Failed to create appointment');
    } finally {
      setIsSubmitting(false);
    }
  };
  useEffect(() => {
    const controller = new AbortController();

    const loadDoctors = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/doctors/list-doctors`, {
          signal: controller.signal,
        });

        if (!response.ok) throw new Error('Failed to load doctors');

        const data = (await response.json()) as DoctorOption[];
        setDoctors(Array.isArray(data) ? data : []);
      } catch (err) {
        if ((err as Error).name === 'AbortError') return;
        setError((err as Error).message ?? 'Failed to load doctors');
      }
    };

    loadDoctors();

    return () => controller.abort();
  }, [apiBaseUrl]);

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

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b flex flex-wrap gap-3 items-center">
          <div className="flex-1 min-w-[240px] relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search appointments..."
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-500" />
            <select
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option>All Status</option>
              {appointmentStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <select
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value)}
            >
              <option>All Types</option>
              {appointmentTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
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
              {!isLoading && filteredAppointments.length === 0 && (
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-500" colSpan={6}>
                    No appointments available.
                  </td>
                </tr>
              )}
              {isLoading && (
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-500" colSpan={6}>
                    Loading appointments...
                  </td>
                </tr>
              )}
              {!isLoading && filteredAppointments.map((appt) => (
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
                      <button
                        className="text-primary-600 hover:text-primary-700 flex items-center gap-1"
                        onClick={() => navigate(`/appointments/${appt.id}`)}
                      >
                        <Eye size={16} /> View
                      </button>
                      <button
                        className="text-gray-600 hover:text-gray-800 flex items-center gap-1"
                        onClick={() => navigate(`/appointments/${appt.id}/print`)}
                      >
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
          <div className="relative w-full max-w-lg mx-4 bg-white rounded-2xl shadow-xl border border-gray-100 flex max-h-[90vh] flex-col">
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

            <div className="p-6 space-y-5 overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Patient Name</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter patient name"
                    value={patientQuery}
                    onChange={(event) => {
                      setPatientQuery(event.target.value);
                      setSelectedPatientId(null);
                    }}
                    onFocus={() => {
                      if (patientSuggestions.length > 0) setShowPatientSuggestions(true);
                    }}
                    onBlur={() => {
                      window.setTimeout(() => setShowPatientSuggestions(false), 150);
                    }}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
                  />
                  {showPatientSuggestions && (
                    <div className="absolute z-10 mt-2 w-full rounded-lg border border-gray-200 bg-white shadow-lg">
                      {isPatientLoading && (
                        <div className="px-4 py-3 text-sm text-gray-500">Searching...</div>
                      )}
                      {!isPatientLoading && patientSearchError && (
                        <div className="px-4 py-3 text-sm text-red-600">{patientSearchError}</div>
                      )}
                      {!isPatientLoading && !patientSearchError && patientSuggestions.length === 0 && (
                        <div className="px-4 py-3 text-sm text-gray-500">No matches found.</div>
                      )}
                      {!isPatientLoading && !patientSearchError && patientSuggestions.length > 0 && (
                        <ul className="max-h-56 overflow-y-auto py-1">
                          {patientSuggestions.map((patient) => (
                            <li key={patient.id}>
                              <button
                                type="button"
                                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
                                onMouseDown={(event) => {
                                  event.preventDefault();
                                  setPatientQuery(getPatientDisplayName(patient));
                                  setSelectedPatientId(patient.id);
                                  setShowPatientSuggestions(false);
                                }}
                              >
                                <div className="font-medium text-gray-900">
                                  {getPatientDisplayName(patient)}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {patient.medicalRecordNumber ? `MRN ${patient.medicalRecordNumber}` : 'No MRN'}
                                  {patient.email ? ` • ${patient.email}` : ''}
                                </div>
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Doctor</label>
                <div className="relative">
                  <select
                    className="appearance-none w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
                    value={selectedDoctorId ?? ''}
                    onChange={(event) => {
                      const value = Number(event.target.value);
                      setSelectedDoctorId(Number.isNaN(value) ? null : value);
                    }}
                  >
                    <option value="">Select doctor</option>
                    {doctors.map((doctor) => (
                      <option key={doctor.id} value={doctor.id}>
                        {getDoctorDisplayName(doctor) || `Doctor #${doctor.id}`}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Prescribed By</label>
                <div className="relative">
                  <select
                    className="appearance-none w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
                    value={prescribedById ?? ''}
                    onChange={(event) => {
                      const value = Number(event.target.value);
                      setPrescribedById(Number.isNaN(value) ? null : value);
                    }}
                  >
                    <option value="">Select prescribing doctor (optional)</option>
                    {doctors.map((doctor) => (
                      <option key={doctor.id} value={doctor.id}>
                        {getDoctorDisplayName(doctor) || `Doctor #${doctor.id}`}
                      </option>
                    ))}
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
                      value={scheduledDate}
                      onChange={(event) => setScheduledDate(event.target.value)}
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
                      value={scheduledTime}
                      onChange={(event) => setScheduledTime(event.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <div className="relative">
                  <select
                    className="appearance-none w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
                    value={appointmentStatus}
                    onChange={(event) => setAppointmentStatus(event.target.value)}
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
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <div className="relative">
                  <select
                    className="appearance-none w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
                    value={appointmentType}
                    onChange={(event) => setAppointmentType(event.target.value)}
                  >
                    <option value="">Select type</option>
                    {appointmentTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Appointment Name</label>
                <input
                  type="text"
                  placeholder="Enter appointment name"
                  value={appointmentName}
                  onChange={(event) => setAppointmentName(event.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  rows={3}
                  placeholder="Add a brief description"
                  value={appointmentDescription}
                  onChange={(event) => setAppointmentDescription(event.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  rows={3}
                  placeholder="Add notes (optional)"
                  value={appointmentNotes}
                  onChange={(event) => setAppointmentNotes(event.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100">
              {submitError && (
                <div className="mr-auto text-sm text-red-600">
                  {submitError}
                </div>
              )}
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateAppointment}
                className="px-5 py-2 text-sm font-semibold bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-60"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Scheduling...' : 'Schedule Appointment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
