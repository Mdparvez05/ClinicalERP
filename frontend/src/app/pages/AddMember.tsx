import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, UserPlus } from 'lucide-react';

const emptyForm: CreateEmployeeForm = {
  firstName: '',
  lastName: '',
  gender: '1',
  email: '',
  phone: '',
  address: '',
  position: '',
  department: '',
  hireDate: '',
  isActive: true,
  hasLogin: false,
  userName: '',
  password: '',
  highestQualification: '',
  bankName: '',
  bankBranch: '',
  bankAccountNumber: '',
  bankIFSC: '',
};

export function AddMember() {
  const [formState, setFormState] = useState<CreateEmployeeForm>(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [masterError, setMasterError] = useState<string | null>(null);
  const [masterLoading, setMasterLoading] = useState(false);
  const [employeeLoading, setEmployeeLoading] = useState(false);
  const [positions, setPositions] = useState<MasterOption[]>([]);
  const [departments, setDepartments] = useState<MasterOption[]>([]);
  const navigate = useNavigate();
  const { id } = useParams();
  const employeeId = Number(id);
  const isEditMode = Boolean(id);
  const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? 'https://localhost:5001';

  const positionIdMap: Record<string, number> = {
    Doctor: 4,
    Nurse: 5,
    Administrator: 6,
    Technician: 7,
    Receptionist: 8,
  };

  const departmentIdMap: Record<string, number> = {
    'Internal Medicine': 9,
    Nursing: 10,
    Orthopedics: 11,
    Administration: 12,
    Laboratory: 13,
    Neurology: 14,
    Emergency: 15,
  };

  useEffect(() => {
    const controller = new AbortController();

    const loadMasterOptions = async () => {
      try {
        setMasterLoading(true);
        setMasterError(null);

        const [positionsRes, departmentsRes] = await Promise.all([
          fetch(`${apiBaseUrl}/api/master/get-positions`, { signal: controller.signal }),
          fetch(`${apiBaseUrl}/api/master/get-departments`, { signal: controller.signal }),
        ]);

        if (!positionsRes.ok || !departmentsRes.ok) {
          throw new Error('Failed to load department and position options');
        }

        const [positionsData, departmentsData] = await Promise.all([
          positionsRes.json(),
          departmentsRes.json(),
        ]);

        const positionOptions = buildMasterOptions(positionsData, positionIdMap);
        const departmentOptions = buildMasterOptions(departmentsData, departmentIdMap);

        setPositions(positionOptions.sort((a, b) => a.label.localeCompare(b.label)));
        setDepartments(departmentOptions.sort((a, b) => a.label.localeCompare(b.label)));

        if (positionOptions.length === 0 || departmentOptions.length === 0) {
          setMasterError('No positions or departments available.');
        }
      } catch (err) {
        if ((err as Error).name === 'AbortError') return;
        setMasterError((err as Error).message ?? 'Failed to load options');
      } finally {
        setMasterLoading(false);
      }
    };

    loadMasterOptions();

    return () => controller.abort();
  }, [apiBaseUrl]);

  const updateField = (field: keyof CreateEmployeeForm, value: string | boolean) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  useEffect(() => {
    if (!isEditMode || Number.isNaN(employeeId)) return;

    const controller = new AbortController();

    const loadEmployee = async () => {
      try {
        setEmployeeLoading(true);
        setError(null);

        const response = await fetch(`${apiBaseUrl}/api/employees/${employeeId}`, {
          signal: controller.signal,
        });

        if (!response.ok) throw new Error('Failed to load employee');

        const data = (await response.json()) as EmployeeDetailDto;
        const name = data.name?.trim() ?? '';
        const [firstName, ...rest] = name.split(' ');
        const lastName = rest.join(' ').trim();
        const hasLogin = Boolean(data.userName) || data.hasLogin === 'true' || data.hasLogin === '1';

        setFormState((prev) => ({
          ...prev,
          firstName: data.firstName?.trim() || firstName || '',
          lastName: data.lastName?.trim() || lastName || '',
          gender: String(data.gender ?? 1),
          email: data.email ?? '',
          phone: data.phone ?? '',
          address: data.address ?? '',
          position: data.position ? String(data.position) : '',
          department: data.department ? String(data.department) : '',
          hireDate: data.hireDate ? data.hireDate.slice(0, 10) : '',
          isActive: data.isActive ?? true,
          hasLogin,
          userName: data.userName ?? '',
          password: '',
        }));
      } catch (err) {
        if ((err as Error).name === 'AbortError') return;
        setError((err as Error).message ?? 'Failed to load employee');
      } finally {
        setEmployeeLoading(false);
      }
    };

    loadEmployee();

    return () => controller.abort();
  }, [apiBaseUrl, employeeId, isEditMode]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isEditMode && Number.isNaN(employeeId)) {
      setError('Invalid employee id.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const hireDateValue = formState.hireDate
        ? new Date(`${formState.hireDate}T00:00:00`).toISOString()
        : new Date().toISOString();

      const loginEnabled = formState.hasLogin;
      const payloadBase = {
        firstName: formState.firstName.trim(),
        lastName: formState.lastName.trim(),
        gender: Number(formState.gender) || 0,
        email: formState.email.trim(),
        phone: formState.phone.trim(),
        address: formState.address.trim(),
        position: Number(formState.position) || 0,
        department: Number(formState.department) || 0,
        hireDate: hireDateValue,
        isActive: formState.isActive,
        hasLogin: loginEnabled,
        userName: loginEnabled ? formState.userName.trim() || null : null,
        password: loginEnabled ? formState.password.trim() || null : null,
        highestQualification: formState.highestQualification.trim(),
        bankName: formState.bankName.trim(),
        bankBranch: formState.bankBranch.trim(),
        bankAccountNumber: formState.bankAccountNumber.trim(),
        bankIFSC: formState.bankIFSC.trim(),
      };

      const payload = isEditMode
        ? (payloadBase as UpdateEmployeeDto)
        : (payloadBase as CreateEmployeeDto);

      const endpoint = isEditMode
        ? `${apiBaseUrl}/api/employees/${employeeId}`
        : `${apiBaseUrl}/api/employees/add-employee`;

      const response = await fetch(endpoint, {
        method: isEditMode ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to save employee');

      navigate(isEditMode ? `/settings/team/${employeeId}` : '/settings');
    } catch (err) {
      setError((err as Error).message ?? 'Failed to add employee');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">
            {isEditMode ? 'Edit Member' : 'Add Member'}
          </h1>
          <p className="text-slate-600">
            {isEditMode ? 'Update employee profile details.' : 'Create a new team profile for the clinic.'}
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/settings')}
          className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-slate-900"
        >
          <ArrowLeft size={16} />
          Back to Settings
        </button>
      </div>

      <form onSubmit={handleSubmit} className="rounded-3xl border border-white/60 bg-white p-6 shadow-lg">
        <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
          <UserPlus size={16} />
          Member Details
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}
        {masterError && (
          <div className="mt-4 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-700">
            {masterError}
          </div>
        )}
        {employeeLoading && (
          <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-500">
            Loading employee details...
          </div>
        )}

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">First Name</label>
            <input
              type="text"
              required
              value={formState.firstName}
              onChange={(event) => updateField('firstName', event.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm shadow-sm focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Last Name</label>
            <input
              type="text"
              required
              value={formState.lastName}
              onChange={(event) => updateField('lastName', event.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm shadow-sm focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Gender</label>
            <select
              value={formState.gender}
              onChange={(event) => updateField('gender', event.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm shadow-sm focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="1">Male</option>
              <option value="2">Female</option>
              <option value="3">Other</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Hire Date</label>
            <input
              type="date"
              value={formState.hireDate}
              onChange={(event) => updateField('hireDate', event.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm shadow-sm focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              required
              value={formState.email}
              onChange={(event) => updateField('email', event.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm shadow-sm focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Phone</label>
            <input
              type="tel"
              required
              value={formState.phone}
              onChange={(event) => updateField('phone', event.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm shadow-sm focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Position</label>
            <select
              required
              value={formState.position}
              onChange={(event) => updateField('position', event.target.value)}
              disabled={masterLoading || positions.length === 0}
              className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm shadow-sm focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-slate-50"
            >
              <option value="" disabled>
                {masterLoading ? 'Loading positions...' : 'Select position'}
              </option>
              {positions.map((option) => (
                <option key={option.id} value={String(option.id)}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Department</label>
            <select
              required
              value={formState.department}
              onChange={(event) => updateField('department', event.target.value)}
              disabled={masterLoading || departments.length === 0}
              className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm shadow-sm focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-slate-50"
            >
              <option value="" disabled>
                {masterLoading ? 'Loading departments...' : 'Select department'}
              </option>
              {departments.map((option) => (
                <option key={option.id} value={String(option.id)}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="lg:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-700">Address</label>
            <input
              type="text"
              value={formState.address}
              onChange={(event) => updateField('address', event.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm shadow-sm focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Username (optional)</label>
            <input
              type="text"
              value={formState.userName}
              onChange={(event) => updateField('userName', event.target.value)}
              disabled={!formState.hasLogin}
              className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm shadow-sm focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-slate-50"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Password (optional)</label>
            <input
              type="password"
              value={formState.password}
              onChange={(event) => updateField('password', event.target.value)}
              disabled={!formState.hasLogin}
              className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm shadow-sm focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-slate-50"
            />
          </div>
          <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
            <input
              type="checkbox"
              checked={formState.hasLogin}
              onChange={(event) => {
                const checked = event.target.checked;
                setFormState((prev) => ({
                  ...prev,
                  hasLogin: checked,
                  userName: checked ? prev.userName : '',
                  password: checked ? prev.password : '',
                }));
              }}
              className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
            />
            Has login access
          </label>
        </div>

        <div className="mt-8 border-t border-slate-100 pt-6">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Qualifications and Banking
          </h2>
          <div className="mt-4 grid gap-6 lg:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Highest Qualification</label>
              <input
                type="text"
                value={formState.highestQualification}
                onChange={(event) => updateField('highestQualification', event.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm shadow-sm focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Bank Name</label>
              <input
                type="text"
                value={formState.bankName}
                onChange={(event) => updateField('bankName', event.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm shadow-sm focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Bank Branch</label>
              <input
                type="text"
                value={formState.bankBranch}
                onChange={(event) => updateField('bankBranch', event.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm shadow-sm focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Bank Account Number</label>
              <input
                type="text"
                value={formState.bankAccountNumber}
                onChange={(event) => updateField('bankAccountNumber', event.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm shadow-sm focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Bank IFSC</label>
              <input
                type="text"
                value={formState.bankIFSC}
                onChange={(event) => updateField('bankIFSC', event.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm shadow-sm focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
              <input
                type="checkbox"
                checked={formState.isActive}
                onChange={(event) => updateField('isActive', event.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
              />
              Active employee
            </label>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={isSubmitting || masterLoading || employeeLoading}
            className="flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            <Save size={18} />
            {isSubmitting ? 'Saving...' : isEditMode ? 'Save Changes' : 'Save Member'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/settings')}
            className="rounded-full border border-slate-200 px-5 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

type CreateEmployeeForm = {
  firstName: string;
  lastName: string;
  gender: string;
  email: string;
  phone: string;
  address: string;
  position: string;
  department: string;
  hireDate: string;
  isActive: boolean;
  hasLogin: boolean;
  userName: string;
  password: string;
  highestQualification: string;
  bankName: string;
  bankBranch: string;
  bankAccountNumber: string;
  bankIFSC: string;
};

type CreateEmployeeDto = {
  firstName: string;
  lastName: string;
  gender: number;
  email: string;
  phone: string;
  address: string;
  position: number;
  department: number;
  hireDate: string;
  isActive: boolean;
  hasLogin?: boolean;
  userName?: string | null;
  password?: string | null;
  highestQualification: string;
  bankName: string;
  bankBranch: string;
  bankAccountNumber: string;
  bankIFSC: string;
};

type UpdateEmployeeDto = {
  firstName: string;
  lastName: string;
  gender: number;
  email: string;
  phone: string;
  address: string;
  position: number;
  department: number;
  hireDate: string;
  isActive: boolean;
  hasLogin?: boolean;
  userName?: string | null;
  password?: string | null;
  highestQualification: string;
  bankName: string;
  bankBranch: string;
  bankAccountNumber: string;
  bankIFSC: string;
};

type EmployeeDetailDto = {
  id: number;
  name?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  gender?: number | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  position?: number | null;
  department?: number | null;
  hireDate?: string | null;
  isActive?: boolean | null;
  hasLogin?: string | null;
  userName?: string | null;
};

type MasterOption = {
  id: number;
  label: string;
};

type MasterPayload = Array<string | Record<string, unknown>>;

const buildMasterOptions = (data: unknown, idMap: Record<string, number>): MasterOption[] => {
  if (!Array.isArray(data)) return [];

  return (data as MasterPayload)
    .map((item) => {
      if (typeof item === 'string') {
        return { id: idMap[item] ?? 0, label: item };
      }

      const payload = item as Record<string, unknown>;
      const rawLabel = payload.value ?? payload.Value ?? payload.name ?? payload.Name;
      const label = typeof rawLabel === 'string' ? rawLabel : '';
      const rawId = payload.id ?? payload.Id;
      const id = typeof rawId === 'number' ? rawId : idMap[label] ?? 0;

      return label ? { id, label } : null;
    })
    .filter((option): option is MasterOption => Boolean(option && option.id));
};
