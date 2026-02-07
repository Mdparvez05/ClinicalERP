import { useEffect, useMemo, useState } from 'react';
import { Plus, Search, X, ChevronDown, CalendarDays, Pencil, Trash2 } from 'lucide-react';

type PatientListDto = {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  gender: number;
  dateOfBirth: string;
  email: string;
  phone: string;
  lastAppointmentDate: string;
  medicalRecordNumber: string;
  isActive: boolean;
};

type PatientDetailDto = {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  gender: number;
  dateOfBirth: string;
  email: string;
  phone: string;
  phone2?: string | null;
  address: string;
  address2?: string | null;
  city: string;
  zipCode: string;
  country: string;
  medicalRecordNumber: string;
  lastAppointmentDate: string;
  isSubscribed: boolean;
  isActive: boolean;
};

type PatientFormState = {
  firstName: string;
  lastName: string;
  gender: number;
  dateOfBirth: string;
  email: string;
  phone: string;
  phone2: string;
  address: string;
  address2: string;
  city: string;
  zipCode: string;
  country: string;
  medicalRecordNumber: string;
  lastAppointmentDate: string;
  isSubscribed: boolean;
};

const emptyForm: PatientFormState = {
  firstName: '',
  lastName: '',
  gender: 1,
  dateOfBirth: '',
  email: '',
  phone: '',
  phone2: '',
  address: '',
  address2: '',
  city: '',
  zipCode: '',
  country: '',
  medicalRecordNumber: '',
  lastAppointmentDate: '',
  isSubscribed: false,
};

const formatDate = (value?: string | null) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString();
};

const getGenderLabel = (gender: number) => {
  switch (gender) {
    case 1:
      return 'Male';
    case 2:
      return 'Female';
    case 3:
      return 'Other';
    default:
      return `Unknown (${gender})`;
  }
};

export function Patients() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingPatientId, setEditingPatientId] = useState<number | null>(null);
  const [patients, setPatients] = useState<PatientListDto[]>([]);
  const [searchText, setSearchText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [page, setPage] = useState(1);
  const [formState, setFormState] = useState<PatientFormState>(emptyForm);
  const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? 'https://localhost:5001';

  const pageSize = 10;

  const filteredPatients = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    if (!query) return patients;

    return patients.filter((patient) => {
      return (
        patient.fullName.toLowerCase().includes(query)
        || patient.email.toLowerCase().includes(query)
        || patient.phone.toLowerCase().includes(query)
        || patient.medicalRecordNumber.toLowerCase().includes(query)
      );
    });
  }, [patients, searchText]);

  const totalPages = Math.max(1, Math.ceil(filteredPatients.length / pageSize));
  const pagedPatients = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredPatients.slice(start, start + pageSize);
  }, [filteredPatients, page, pageSize]);

  useEffect(() => {
    const controller = new AbortController();

    const loadPatients = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`${apiBaseUrl}/api/Patient`, { signal: controller.signal });
        if (!response.ok) throw new Error('Failed to load patients');

        const data = (await response.json()) as PatientListDto[];
        setPatients(Array.isArray(data) ? data : []);
      } catch (err) {
        if ((err as Error).name === 'AbortError') return;
        setError((err as Error).message ?? 'Failed to load patients');
      } finally {
        setIsLoading(false);
      }
    };

    loadPatients();

    return () => controller.abort();
  }, [apiBaseUrl]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const resetForm = () => {
    setFormState(emptyForm);
    setSubmitError(null);
  };

  const openAddModal = () => {
    resetForm();
    setEditingPatientId(null);
    setIsAddOpen(true);
  };

  const openEditModal = async (patientId: number) => {
    try {
      setSubmitError(null);
      const response = await fetch(`${apiBaseUrl}/api/Patient/${patientId}`);
      if (!response.ok) throw new Error('Failed to load patient details');

      const data = (await response.json()) as PatientDetailDto;
      setFormState({
        firstName: data.firstName ?? '',
        lastName: data.lastName ?? '',
        gender: data.gender ?? 1,
        dateOfBirth: data.dateOfBirth ? data.dateOfBirth.slice(0, 10) : '',
        email: data.email ?? '',
        phone: data.phone ?? '',
        phone2: data.phone2 ?? '',
        address: data.address ?? '',
        address2: data.address2 ?? '',
        city: data.city ?? '',
        zipCode: data.zipCode ?? '',
        country: data.country ?? '',
        medicalRecordNumber: data.medicalRecordNumber ?? '',
        lastAppointmentDate: data.lastAppointmentDate ? data.lastAppointmentDate.slice(0, 10) : '',
        isSubscribed: data.isSubscribed ?? false,
      });
      setEditingPatientId(patientId);
      setIsEditOpen(true);
    } catch (err) {
      setError((err as Error).message ?? 'Failed to load patient details');
    }
  };

  const closeModal = () => {
    setIsAddOpen(false);
    setIsEditOpen(false);
    setEditingPatientId(null);
    resetForm();
  };

  const reloadPatients = async () => {
    const response = await fetch(`${apiBaseUrl}/api/Patient`);
    if (!response.ok) throw new Error('Failed to load patients');
    const data = (await response.json()) as PatientListDto[];
    setPatients(Array.isArray(data) ? data : []);
  };

  const handleSubmit = async () => {
    if (!formState.firstName.trim() || !formState.lastName.trim()) {
      setSubmitError('First name and last name are required.');
      return;
    }

    if (!formState.dateOfBirth) {
      setSubmitError('Date of birth is required.');
      return;
    }

    if (!formState.email.trim() || !formState.phone.trim()) {
      setSubmitError('Email and phone are required.');
      return;
    }

    if (!formState.address.trim() || !formState.city.trim() || !formState.zipCode.trim() || !formState.country.trim()) {
      setSubmitError('Address, city, zip, and country are required.');
      return;
    }

    if (!formState.medicalRecordNumber.trim()) {
      setSubmitError('Medical record number is required.');
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError(null);

      const payload = {
        firstName: formState.firstName.trim(),
        lastName: formState.lastName.trim(),
        gender: formState.gender,
        dateOfBirth: formState.dateOfBirth,
        email: formState.email.trim(),
        phone: formState.phone.trim(),
        phone2: formState.phone2.trim() || undefined,
        address: formState.address.trim(),
        address2: formState.address2.trim() || undefined,
        city: formState.city.trim(),
        zipCode: formState.zipCode.trim(),
        country: formState.country.trim(),
        medicalRecordNumber: formState.medicalRecordNumber.trim(),
        lastAppointmentDate: formState.lastAppointmentDate || undefined,
        isSubscribed: formState.isSubscribed,
      };

      const isEdit = Boolean(editingPatientId);
      const response = await fetch(
        isEdit
          ? `${apiBaseUrl}/api/Patient/${editingPatientId}`
          : `${apiBaseUrl}/api/Patient`,
        {
          method: isEdit ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(isEdit ? { id: editingPatientId, ...payload } : payload),
        },
      );

      if (!response.ok) {
        const message = await response.json().catch(() => null);
        throw new Error(message?.message ?? 'Failed to save patient');
      }

      await reloadPatients();
      closeModal();
    } catch (err) {
      setSubmitError((err as Error).message ?? 'Failed to save patient');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (patientId: number) => {
    const confirmed = window.confirm('Deactivate this patient?');
    if (!confirmed) return;

    try {
      const response = await fetch(`${apiBaseUrl}/api/Patient/${patientId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete patient');
      await reloadPatients();
    } catch (err) {
      setError((err as Error).message ?? 'Failed to delete patient');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Patients</h1>
          <p className="text-gray-600">Manage patient records and information</p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={20} />
          Add New Patient
        </button>
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search patients..."
              value={searchText}
              onChange={(event) => {
                setSearchText(event.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date of Birth</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gender</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Visit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {!isLoading && pagedPatients.length === 0 && (
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-500" colSpan={6}>
                    No patients found.
                  </td>
                </tr>
              )}
              {isLoading && (
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-500" colSpan={6}>
                    Loading patients...
                  </td>
                </tr>
              )}
              {!isLoading && pagedPatients.map((patient) => (
                <tr key={patient.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center">
                        <span className="text-cyan-600 font-medium">
                          {patient.fullName.split(' ').map((n) => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium">{patient.fullName}</div>
                        <div className="text-sm text-gray-500">{patient.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{formatDate(patient.dateOfBirth)}</td>
                  <td className="px-6 py-4 text-gray-600">{getGenderLabel(patient.gender)}</td>
                  <td className="px-6 py-4 text-gray-600">{patient.phone}</td>
                  <td className="px-6 py-4 text-gray-600">{formatDate(patient.lastAppointmentDate)}</td>
                  <td className="px-6 py-4">
                    <button
                      className="text-primary-600 hover:text-primary-700 font-medium mr-3 inline-flex items-center gap-1"
                      onClick={() => openEditModal(patient.id)}
                    >
                      <Pencil size={16} /> Edit
                    </button>
                    <button
                      className="text-gray-600 hover:text-gray-700 font-medium inline-flex items-center gap-1"
                      onClick={() => handleDelete(patient.id)}
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!isLoading && filteredPatients.length > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t text-sm text-gray-600">
            <span>
              Showing {Math.min((page - 1) * pageSize + 1, filteredPatients.length)}
              -{Math.min(page * pageSize, filteredPatients.length)} of {filteredPatients.length}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={page === 1}
                className="px-3 py-1 rounded border border-gray-200 disabled:opacity-50"
              >
                Previous
              </button>
              <span>Page {page} of {totalPages}</span>
              <button
                type="button"
                onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                disabled={page === totalPages}
                className="px-3 py-1 rounded border border-gray-200 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {(isAddOpen || isEditOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            onClick={closeModal}
            aria-label="Close add patient"
          />
          <div className="relative w-full max-w-2xl mx-4 bg-white rounded-2xl shadow-xl border border-gray-100">
            <div className="flex items-start justify-between p-6 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-semibold">{isEditOpen ? 'Edit Patient' : 'Add New Patient'}</h2>
                <p className="text-sm text-gray-500">
                  {isEditOpen
                    ? 'Update the patient information below.'
                    : "Enter the patient's information to create a new record."}
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="p-2 rounded-full hover:bg-gray-100"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                  <input
                    type="text"
                    placeholder="First name"
                    value={formState.firstName}
                    onChange={(event) => setFormState((prev) => ({ ...prev, firstName: event.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  <input
                    type="text"
                    placeholder="Last name"
                    value={formState.lastName}
                    onChange={(event) => setFormState((prev) => ({ ...prev, lastName: event.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                  <div className="relative">
                    <CalendarDays className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="date"
                      value={formState.dateOfBirth}
                      onChange={(event) => setFormState((prev) => ({ ...prev, dateOfBirth: event.target.value }))}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    value={formState.email}
                    onChange={(event) => setFormState((prev) => ({ ...prev, email: event.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={formState.phone}
                    onChange={(event) => setFormState((prev) => ({ ...prev, phone: event.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Alternate Phone</label>
                  <input
                    type="tel"
                    placeholder="Optional"
                    value={formState.phone2}
                    onChange={(event) => setFormState((prev) => ({ ...prev, phone2: event.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                  <div className="relative">
                    <select
                      className="appearance-none w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
                      value={formState.gender}
                      onChange={(event) => setFormState((prev) => ({ ...prev, gender: Number(event.target.value) }))}
                    >
                      <option value={1}>Male</option>
                      <option value={2}>Female</option>
                      <option value={3}>Other</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Medical Record #</label>
                  <input
                    type="text"
                    placeholder="MRN-001"
                    value={formState.medicalRecordNumber}
                    onChange={(event) => setFormState((prev) => ({ ...prev, medicalRecordNumber: event.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <input
                  type="text"
                  placeholder="123 Main St, City, State ZIP"
                  value={formState.address}
                  onChange={(event) => setFormState((prev) => ({ ...prev, address: event.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 2</label>
                  <input
                    type="text"
                    placeholder="Apartment, suite, unit"
                    value={formState.address2}
                    onChange={(event) => setFormState((prev) => ({ ...prev, address2: event.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <input
                    type="text"
                    placeholder="City"
                    value={formState.city}
                    onChange={(event) => setFormState((prev) => ({ ...prev, city: event.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Zip Code</label>
                  <input
                    type="text"
                    placeholder="ZIP"
                    value={formState.zipCode}
                    onChange={(event) => setFormState((prev) => ({ ...prev, zipCode: event.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                  <input
                    type="text"
                    placeholder="Country"
                    value={formState.country}
                    onChange={(event) => setFormState((prev) => ({ ...prev, country: event.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Appointment Date</label>
                  <input
                    type="date"
                    value={formState.lastAppointmentDate}
                    onChange={(event) => setFormState((prev) => ({ ...prev, lastAppointmentDate: event.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
                  />
                </div>
                <div className="flex items-center gap-2 pt-8">
                  <input
                    id="isSubscribed"
                    type="checkbox"
                    checked={formState.isSubscribed}
                    onChange={(event) => setFormState((prev) => ({ ...prev, isSubscribed: event.target.checked }))}
                    className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                  />
                  <label htmlFor="isSubscribed" className="text-sm text-gray-700">
                    Subscribed to updates
                  </label>
                </div>
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
                onClick={closeModal}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="px-5 py-2 text-sm font-semibold bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : isEditOpen ? 'Save Changes' : 'Add Patient'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
