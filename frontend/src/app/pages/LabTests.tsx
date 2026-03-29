import { useState, useEffect, useMemo, useCallback } from 'react';
import { Plus, Search, ChevronDown, TestTube, X } from 'lucide-react';

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
  employeeName?: string | null;
  employeePosition?: string | null;
  prescribedBy?: number | null;
  prescribedByName?: string | null;
  typeId?: number | null;
  parentId?: number | null;
  parentAppointmentName?: string | null;
};

type DoctorOption = {
  id: number;
  name?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  fullName?: string | null;
};

type PatientSearchResult = {
  id: number;
  firstName: string;
  lastName: string;
  email?: string | null;
  medicalRecordNumber?: string | null;
};

type LabTestRow = {
  id: number;
  name: string;
  category: string;
  patient: string;
  doctor: string;
  date: string;
  time: string;
  type: string;
  status: string;
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

const getDoctorDisplayName = (doctor: DoctorOption) => {
  if (doctor.name?.trim()) return doctor.name.trim();
  if (doctor.fullName?.trim()) return doctor.fullName.trim();
  const firstName = doctor.firstName?.trim();
  const lastName = doctor.lastName?.trim();
  if (firstName || lastName) return `${firstName ?? ''} ${lastName ?? ''}`.trim();
  return undefined;
};

const getPatientDisplayName = (patient: PatientSearchResult) => {
  return `${patient.firstName} ${patient.lastName}`.trim();
};

const getAppointmentTypeId = (type: string) => {
  if (type === 'Lab Test' ) return 17;
  if (type === 'Regular Appointment') return 16;
  return undefined;
};

const statusStyles: Record<string, { badge: string; dot: string }> = {
  Completed: {
    badge: 'bg-green-100 text-green-700',
    dot: 'bg-green-500',
  },
  'In Progress': {
    badge: 'bg-blue-100 text-blue-700',
    dot: 'bg-blue-500',
  },
  Pending: {
    badge: 'bg-amber-100 text-amber-700',
    dot: 'bg-amber-500',
  },
  Cancelled: {
    badge: 'bg-red-100 text-red-700',
    dot: 'bg-red-500',
  },
};

export function LabTests() {
  const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? 'https://localhost:5001';
  const [labTests, setLabTests] = useState<AppointmentDetailDto[]>([]);
  const [appointmentTypes, setAppointmentTypes] = useState<string[]>([]);
  const [appointmentStatuses, setAppointmentStatuses] = useState<string[]>([]);
  const [doctors, setDoctors] = useState<DoctorOption[]>([]);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [isAddOpen, setIsAddOpen] = useState(false);
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
  const [appointmentType, setAppointmentType] = useState('Lab Test');
  const [appointmentStatus, setAppointmentStatus] = useState('Scheduled');
  const [appointmentName, setAppointmentName] = useState('');
  const [appointmentDescription, setAppointmentDescription] = useState('');
  const [appointmentNotes, setAppointmentNotes] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const labTestRows = useMemo<LabTestRow[]>(() => {
    return labTests.map((test) => ({
      id: test.id,
      name: test.name ?? 'Lab Test',
      category: test.type ?? 'Lab Test',
      patient: test.clientName ?? 'Unknown patient',
      doctor: test.assignedEmployeeName ?? test.employeeName ?? 'Unknown doctor',
      date: formatDate(test.scheduledOn ?? null),
      time: formatTime(test.scheduledOn ?? null),
      type: test.type ?? 'Lab Test',
      status: test.appointmentStatus ?? 'Pending',
    }));
  }, [labTests]);

  const filteredLabTests = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    return labTestRows.filter((test) => {
      const matchesSearch =
        query.length === 0 ||
        test.name.toLowerCase().includes(query) ||
        test.patient.toLowerCase().includes(query) ||
        test.doctor.toLowerCase().includes(query) ||
        test.type.toLowerCase().includes(query) ||
        test.status.toLowerCase().includes(query) ||
        test.date.toLowerCase().includes(query);
      const matchesStatus = statusFilter === 'All Status' || test.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [labTestRows, searchText, statusFilter]);

  const loadLabTests = useCallback(async (signal?: AbortSignal) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`${apiBaseUrl}/api/appointments/get-labtests`, {
        signal,
      });
      if (!response.ok) throw new Error('Failed to load lab tests');
      const data = (await response.json()) as AppointmentDetailDto[];
      setLabTests(Array.isArray(data) ? data : []);
    } catch (err) {
      if ((err as Error).name === 'AbortError') return;
      setError((err as Error).message ?? 'Failed to load lab tests');
      setLabTests([]);
    } finally {
      setIsLoading(false);
    }
  }, [apiBaseUrl]);

  useEffect(() => {
    const controller = new AbortController();
    loadLabTests(controller.signal);
    return () => controller.abort();
  }, [loadLabTests]);

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

        if (!nextTypes.includes(appointmentType)) {
          setAppointmentType(nextTypes.includes('Lab Test') ? 'Lab Test' : nextTypes[0] ?? 'Lab Test');
        }

        if (nextStatuses.length > 0 && !nextStatuses.includes(appointmentStatus)) {
          setAppointmentStatus(nextStatuses[0]);
        }
      } catch (err) {
        if ((err as Error).name === 'AbortError') return;
        setError((err as Error).message ?? 'Failed to load lab test options');
      }
    };

    loadOptions();
    return () => controller.abort();
  }, [apiBaseUrl, appointmentStatus, appointmentType]);

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
      setAppointmentType('Lab Test');
      setAppointmentStatus('Scheduled');
      setAppointmentName('');
      setAppointmentDescription('');
      setAppointmentNotes('');
      setSubmitError(null);
      setIsSubmitting(false);
      return;
    }

    const term = patientQuery.trim();
    if (term.length < 2) {
      setPatientSuggestions([]);
      setPatientSearchError(null);
      return;
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

  const handleCreateLabTest = async () => {
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

    const payload = {
      clientId: selectedPatientId,
      clientName: patientQuery.trim(),
      assignedEmployeeId: selectedDoctorId,
      assignedEmployeeName: doctorName,
      prescribedBy: prescribedById ?? undefined,
      scheduledOn: scheduled.toISOString(),
      type: appointmentType || 'Lab Test',
      typeId: getAppointmentTypeId(appointmentType || 'Lab Test'),
      appointmentStatus: appointmentStatus || 'Scheduled',
      name: appointmentName.trim() || undefined,
      description: appointmentDescription.trim() || undefined,
      notes: appointmentNotes.trim() || undefined,
    };

    try {
      setIsSubmitting(true);
      setSubmitError(null);

      const response = await fetch(`${apiBaseUrl}/api/appointments/add-appointment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to create lab test');

      setIsAddOpen(false);
      await loadLabTests();
    } catch (err) {
      setSubmitError((err as Error).message ?? 'Failed to create lab test');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Lab Tests</h1>
          <p className="text-gray-600">Manage diagnostic tests and results</p>
        </div>
        <button
          type="button"
          onClick={() => setIsAddOpen(true)}
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={20} />
          Order Test
        </button>
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search tests..."
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
            />
          </div>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="appearance-none w-full min-w-[180px] rounded-lg border border-gray-200 bg-white px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
            >
              <option>All Status</option>
              {appointmentStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
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
                <th className="text-left font-medium px-6 py-3">Type</th>
                <th className="text-left font-medium px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading && (
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-500" colSpan={6}>
                    Loading lab tests...
                  </td>
                </tr>
              )}
              {!isLoading && filteredLabTests.length === 0 && (
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-500" colSpan={6}>
                    No lab tests available.
                  </td>
                </tr>
              )}
              {!isLoading && filteredLabTests.map((test) => {
                const styles = statusStyles[test.status] ?? {
                  badge: 'bg-gray-100 text-gray-700',
                  dot: 'bg-gray-500',
                };
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
                    <td className="px-6 py-4 text-gray-600">
                      <div>{test.date}</div>
                      <div className="text-xs text-gray-500">{test.time}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{test.type}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${styles.badge}`}>
                        <span className={`h-2 w-2 rounded-full ${styles.dot}`} />
                        {test.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
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
            aria-label="Close add lab test"
          />
          <div className="relative w-full max-w-lg mx-4 bg-white rounded-2xl shadow-xl border border-gray-100 flex max-h-[90vh] flex-col">
            <div className="flex items-start justify-between p-4 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-semibold">Add Lab Test</h2>
                <p className="text-sm text-gray-500">Fill in the details to create lab test data.</p>
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

            <div className="p-4 space-y-5 overflow-y-auto">
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
                        <div className="px-4 py-3 text-sm text-gray-500">No patients found.</div>
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
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
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
                        {getDoctorDisplayName(doctor) || `Dr. ${doctor.name}`}
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
                        {getDoctorDisplayName(doctor) || `Dr. ${doctor.name}`}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={(event) => setScheduledDate(event.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                  <input
                    type="time"
                    value={scheduledTime}
                    onChange={(event) => setScheduledTime(event.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
                  />
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
                    {appointmentStatuses.length === 0 && <option value="Scheduled">Scheduled</option>}
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
                    <option value="Lab Test">Lab Test</option>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Lab Test Name</label>
                <input
                  type="text"
                  placeholder="Enter lab test name"
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

            <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-100">
              {submitError && (
                <div className="mr-auto text-sm text-red-600">{submitError}</div>
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
                onClick={handleCreateLabTest}
                className="px-5 py-2 text-sm font-semibold bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-60"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save Lab Test'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
