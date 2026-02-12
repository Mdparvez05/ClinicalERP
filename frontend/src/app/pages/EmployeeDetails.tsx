import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, PencilLine, User } from 'lucide-react';

export function EmployeeDetails() {
  const { id } = useParams();
  const employeeId = Number(id);
  const [employee, setEmployee] = useState<EmployeeDto | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? 'https://localhost:5001';

  const positionIdMap: Record<number, string> = {
    4: 'Doctor',
    5: 'Nurse',
    6: 'Administrator',
    7: 'Technician',
    8: 'Receptionist',
  };

  const departmentIdMap: Record<number, string> = {
    9: 'Internal Medicine',
    10: 'Nursing',
    11: 'Orthopedics',
    12: 'Administration',
    13: 'Laboratory',
    14: 'Neurology',
    15: 'Emergency',
  };

  const displayName = useMemo(() => {
    if (!employee) return 'Employee';
    if (employee.name?.trim()) return employee.name;
    return `${employee.firstName ?? ''} ${employee.lastName ?? ''}`.trim() || 'Employee';
  }, [employee]);

  useEffect(() => {
    if (!employeeId || Number.isNaN(employeeId)) {
      setError('Invalid employee id.');
      return;
    }

    const controller = new AbortController();

    const loadEmployee = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`${apiBaseUrl}/api/employees/${employeeId}`, {
          signal: controller.signal,
        });

        if (!response.ok) throw new Error('Failed to load employee');

        const data = (await response.json()) as EmployeeDto;
        setEmployee(data);
      } catch (err) {
        if ((err as Error).name === 'AbortError') return;
        setError((err as Error).message ?? 'Failed to load employee');
      } finally {
        setIsLoading(false);
      }
    };

    loadEmployee();

    return () => controller.abort();
  }, [apiBaseUrl, employeeId]);

  const roleLabel = employee?.positionName?.trim()
    ?? (employee?.position ? positionIdMap[employee.position] : undefined)
    ?? (employee?.position ? `Position ${employee.position}` : '—');

  const departmentLabel = employee?.departmentName?.trim()
    ?? (employee?.department ? departmentIdMap[employee.department] : undefined)
    ?? (employee?.department ? `Department ${employee.department}` : '—');

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">{displayName}</h1>
          <p className="text-slate-600">Employee profile and details</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/settings')}
            className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-slate-900"
          >
            <ArrowLeft size={16} />
            Back to Settings
          </button>
          <button
            type="button"
            onClick={() => navigate(`/settings/team/${employeeId}/edit`)}
            className="flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
          >
            <PencilLine size={16} />
            Edit
          </button>
        </div>
      </div>

      <div className="rounded-3xl border border-white/60 bg-white p-6 shadow-lg">
        <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
          <User size={16} />
          Profile
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        {isLoading && !error && (
          <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 px-4 py-4 text-sm text-slate-500">
            Loading employee details...
          </div>
        )}

        {employee && !isLoading && (
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Role</p>
              <p className="mt-1 text-sm font-medium text-slate-900">{roleLabel}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Department</p>
              <p className="mt-1 text-sm font-medium text-slate-900">{departmentLabel}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Email</p>
              <p className="mt-1 text-sm font-medium text-slate-900">{employee.email || '—'}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Phone</p>
              <p className="mt-1 text-sm font-medium text-slate-900">{employee.phone || '—'}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Hire Date</p>
              <p className="mt-1 text-sm font-medium text-slate-900">
                {employee.hireDate ? new Date(employee.hireDate).toLocaleDateString() : '—'}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Status</p>
              <p className="mt-1 text-sm font-medium text-slate-900">
                {employee.isActive ? 'Active' : 'Inactive'}
              </p>
            </div>
            <div className="lg:col-span-2">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Address</p>
              <p className="mt-1 text-sm font-medium text-slate-900">{employee.address || '—'}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

type EmployeeDto = {
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
  positionName?: string | null;
  departmentName?: string | null;
  hireDate?: string | null;
  isActive?: boolean | null;
  hasLogin?: string | null;
  userName?: string | null;
};
