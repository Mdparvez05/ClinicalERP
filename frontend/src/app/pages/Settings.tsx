import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  CalendarClock,
  Check,
  KeyRound,
  Lock,
  Mail,
  MapPin,
  Palette,
  PencilLine,
  Phone,
  Save,
  ShieldCheck,
  UserPlus,
  Users,
  Webhook,
} from 'lucide-react';

export function Settings() {
  const [activeTab, setActiveTab] = useState('general');
  const [clinicSettings, setClinicSettings] = useState<ClinicSettingsDto | null>(null);
  const [clinicForm, setClinicForm] = useState<ClinicSettingsDto | null>(null);
  const [clinicLoading, setClinicLoading] = useState(false);
  const [clinicSaving, setClinicSaving] = useState(false);
  const [clinicError, setClinicError] = useState<string | null>(null);
  const [isClinicEditing, setIsClinicEditing] = useState(false);
  const [teamMembers, setTeamMembers] = useState<EmployeeDto[]>([]);
  const [teamLoading, setTeamLoading] = useState(false);
  const [teamError, setTeamError] = useState<string | null>(null);
  const [groupBy, setGroupBy] = useState<'none' | 'department' | 'position'>('none');
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

  const getPositionLabel = (member: EmployeeDto) => {
    if (member.positionName?.trim()) return member.positionName;
    if (member.position && positionIdMap[member.position]) return positionIdMap[member.position];
    return member.position ? `Position ${member.position}` : 'Team member';
  };

  const getDepartmentLabel = (member: EmployeeDto) => {
    if (member.departmentName?.trim()) return member.departmentName;
    if (member.department && departmentIdMap[member.department]) return departmentIdMap[member.department];
    return member.department ? `Department ${member.department}` : 'Team member';
  };

  const tabs = useMemo(
    () => [
      { id: 'general', label: 'General', icon: CalendarClock },
      { id: 'notifications', label: 'Notifications', icon: Bell },
      { id: 'security', label: 'Security', icon: ShieldCheck },
      { id: 'team', label: 'Team', icon: Users },
    ],
    [],
  );

  useEffect(() => {
    const controller = new AbortController();

    const loadClinicSettings = async () => {
      try {
        setClinicLoading(true);
        setClinicError(null);

        const response = await fetch(`${apiBaseUrl}/api/settings/clinic`, {
          signal: controller.signal,
        });

        if (!response.ok) throw new Error('Failed to load clinic settings');

        const data = (await response.json()) as ClinicSettingsDto;
        setClinicSettings(data);
        setClinicForm(data);
      } catch (err) {
        if ((err as Error).name === 'AbortError') return;
        setClinicError((err as Error).message ?? 'Failed to load clinic settings');
      } finally {
        setClinicLoading(false);
      }
    };

    loadClinicSettings();

    return () => controller.abort();
  }, [apiBaseUrl]);

  useEffect(() => {
    const controller = new AbortController();

    const loadEmployees = async () => {
      try {
        setTeamLoading(true);
        setTeamError(null);

        const response = await fetch(`${apiBaseUrl}/api/employees/list-employees`, {
          signal: controller.signal,
        });

        if (!response.ok) throw new Error('Failed to load employees');

        const data = (await response.json()) as EmployeeDto[];
        setTeamMembers(Array.isArray(data) ? data : []);
      } catch (err) {
        if ((err as Error).name === 'AbortError') return;
        setTeamError((err as Error).message ?? 'Failed to load employees');
      } finally {
        setTeamLoading(false);
      }
    };

    loadEmployees();

    return () => controller.abort();
  }, [apiBaseUrl]);

  const groupedByDepartment = useMemo(() => {
    const groups: Record<string, EmployeeDto[]> = {};

    teamMembers.forEach((member) => {
      const label = member.departmentName?.trim()
        || (member.department ? `Department ${member.department}` : 'Unassigned');

      if (!groups[label]) groups[label] = [];
      groups[label].push(member);
    });

    return Object.entries(groups)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([name, members]) => ({ name, members }));
  }, [teamMembers]);

  const groupedByPosition = useMemo(() => {
    const groups: Record<string, EmployeeDto[]> = {};

    teamMembers.forEach((member) => {
      const label = member.positionName?.trim()
        || (member.position ? `Position ${member.position}` : 'Unassigned');

      if (!groups[label]) groups[label] = [];
      groups[label].push(member);
    });

    return Object.entries(groups)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([name, members]) => ({ name, members }));
  }, [teamMembers]);

  return (
    <div className="relative">
      <div className="pointer-events-none absolute -top-12 right-0 h-40 w-40 rounded-full bg-teal-200/50 blur-3xl" />
      <div className="pointer-events-none absolute top-36 -left-10 h-48 w-48 rounded-full bg-amber-200/50 blur-3xl" />

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Settings</h1>
          <p className="text-slate-600">Manage your clinic settings and preferences</p>
        </div>
      </div>

      <div className="rounded-3xl border border-white/60 bg-gradient-to-br from-white via-white to-slate-50 shadow-lg">
        <div className="border-b border-slate-100 px-6 py-5">
          <div className="flex flex-wrap gap-3">
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <TabIcon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'general' && (
            <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
              <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Clinic Information</h3>
                    <p className="text-sm text-slate-500">Company details and public profile</p>
                  </div>
                  <button
                    className="flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
                    onClick={() => setIsClinicEditing((prev) => !prev)}
                  >
                    <PencilLine size={16} />
                    {isClinicEditing ? 'Cancel Edit' : 'Edit Details'}
                  </button>
                </div>

                {clinicError && (
                  <div className="mb-4 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {clinicError}
                  </div>
                )}

                {clinicLoading && (
                  <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-4 text-sm text-slate-500">
                    Loading clinic settings...
                  </div>
                )}

                {!clinicLoading && clinicForm && (
                  <div className="mb-6 flex flex-wrap items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                    <div className="h-16 w-16 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                      {clinicForm.logoUrl ? (
                        <img
                          src={clinicForm.logoUrl}
                          alt="Clinic logo"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-slate-500">
                          {clinicForm.clinicName
                            ?.split(' ')
                            .map((part) => part[0])
                            .slice(0, 2)
                            .join('')
                            .toUpperCase() || 'CL'}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">Clinic Logo</p>
                      <p className="text-xs text-slate-500">Shown on invoices and printouts.</p>
                    </div>
                  </div>
                )}

                {!clinicLoading && clinicForm && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Clinic Name
                      </label>
                      {isClinicEditing ? (
                        <input
                          type="text"
                          value={clinicForm.clinicName}
                          onChange={(event) =>
                            setClinicForm((prev) => prev && ({ ...prev, clinicName: event.target.value }))
                          }
                          className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm shadow-sm focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      ) : (
                        <p className="text-sm font-medium text-slate-900">
                          {clinicForm.clinicName || '—'}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Email Address
                      </label>
                      {isClinicEditing ? (
                        <div className="relative">
                          <Mail className="absolute left-3 top-2.5 text-slate-400" size={18} />
                          <input
                            type="email"
                            value={clinicForm.emailAddress}
                            onChange={(event) =>
                              setClinicForm((prev) => prev && ({ ...prev, emailAddress: event.target.value }))
                            }
                            className="w-full rounded-xl border border-slate-200 py-2 pl-10 pr-4 text-sm shadow-sm focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                          />
                        </div>
                      ) : (
                        <p className="text-sm font-medium text-slate-900">
                          {clinicForm.emailAddress || '—'}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Website
                      </label>
                      {isClinicEditing ? (
                        <div className="relative">
                          <Webhook className="absolute left-3 top-2.5 text-slate-400" size={18} />
                          <input
                            type="url"
                            value={clinicForm.website ?? ''}
                            onChange={(event) =>
                              setClinicForm((prev) => prev && ({ ...prev, website: event.target.value }))
                            }
                            className="w-full rounded-xl border border-slate-200 py-2 pl-10 pr-4 text-sm shadow-sm focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                          />
                        </div>
                      ) : (
                        <p className="text-sm font-medium text-slate-900">
                          {clinicForm.website || '—'}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Primary Phone
                      </label>
                      {isClinicEditing ? (
                        <input
                          type="text"
                          value={clinicForm.primaryPhone}
                          onChange={(event) =>
                            setClinicForm((prev) => prev && ({ ...prev, primaryPhone: event.target.value }))
                          }
                          className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm shadow-sm focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      ) : (
                        <p className="text-sm font-medium text-slate-900">
                          {clinicForm.primaryPhone || '—'}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Timezone
                      </label>
                      {isClinicEditing ? (
                        <input
                          type="text"
                          value={clinicForm.timezone ?? ''}
                          onChange={(event) =>
                            setClinicForm((prev) => prev && ({ ...prev, timezone: event.target.value }))
                          }
                          className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm shadow-sm focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      ) : (
                        <p className="text-sm font-medium text-slate-900">
                          {clinicForm.timezone || '—'}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Business Hours
                      </label>
                      {isClinicEditing ? (
                        <input
                          type="text"
                          value={clinicForm.businessHours ?? ''}
                          onChange={(event) =>
                            setClinicForm((prev) => prev && ({ ...prev, businessHours: event.target.value }))
                          }
                          className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm shadow-sm focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      ) : (
                        <p className="text-sm font-medium text-slate-900">
                          {clinicForm.businessHours || '—'}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Address
                      </label>
                      {isClinicEditing ? (
                        <textarea
                          rows={3}
                          value={clinicForm.address}
                          onChange={(event) =>
                            setClinicForm((prev) => prev && ({ ...prev, address: event.target.value }))
                          }
                          className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm shadow-sm focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      ) : (
                        <p className="text-sm font-medium text-slate-900">
                          {clinicForm.address || '—'}
                        </p>
                      )}
                    </div>

                    {isClinicEditing && (
                      <div className="flex flex-wrap items-center gap-3">
                        <button
                          className="flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
                          disabled={clinicSaving}
                          onClick={async () => {
                            if (!clinicForm) return;
                            try {
                              setClinicSaving(true);
                              setClinicError(null);

                              const response = await fetch(`${apiBaseUrl}/api/settings/clinic`, {
                                method: 'PUT',
                                headers: {
                                  'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                  clinicName: clinicForm.clinicName,
                                  emailAddress: clinicForm.emailAddress,
                                  website: clinicForm.website ?? '',
                                  address: clinicForm.address,
                                  primaryPhone: clinicForm.primaryPhone,
                                  timezone: clinicForm.timezone ?? '',
                                  businessHours: clinicForm.businessHours ?? '',
                                }),
                              });

                              if (!response.ok) throw new Error('Failed to update clinic settings');

                              setClinicSettings(clinicForm);
                              setIsClinicEditing(false);
                            } catch (err) {
                              setClinicError((err as Error).message ?? 'Failed to update clinic settings');
                            } finally {
                              setClinicSaving(false);
                            }
                          }}
                        >
                          <Save size={18} />
                          {clinicSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button
                          className="rounded-full border border-slate-200 px-5 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
                          onClick={() => {
                            setClinicForm(clinicSettings);
                            setIsClinicEditing(false);
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                  <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Clinic Snapshot
                  </h4>
                  <div className="mt-4 grid gap-4">
                    <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                      <span className="text-sm text-slate-600">Primary Phone</span>
                      <div className="flex items-center gap-2 text-sm font-medium text-slate-900">
                        <Phone size={16} />
                        {clinicForm?.primaryPhone || '—'}
                      </div>
                    </div>
                    <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                      <span className="text-sm text-slate-600">Timezone</span>
                      <div className="flex items-center gap-2 text-sm font-medium text-slate-900">
                        <MapPin size={16} />
                        {clinicForm?.timezone || '—'}
                      </div>
                    </div>
                    <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                      <span className="text-sm text-slate-600">Business Hours</span>
                      <div className="flex items-center gap-2 text-sm font-medium text-slate-900">
                        <CalendarClock size={16} />
                        {clinicForm?.businessHours || '—'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                  <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Branding
                  </h4>
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Accent Palette</span>
                      <div className="flex items-center gap-2">
                        <span className="h-5 w-5 rounded-full bg-teal-500" />
                        <span className="h-5 w-5 rounded-full bg-amber-500" />
                        <span className="h-5 w-5 rounded-full bg-slate-900" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                      <Palette size={16} />
                      Logo and theme updated 2 days ago
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
              <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900">Notifications</h3>
                <p className="text-sm text-slate-500">Choose how your team gets updates.</p>

                <div className="mt-6 space-y-4">
                  {[
                    {
                      title: 'Appointment reminders',
                      description: 'Send patients a reminder 24 hours before visits.',
                    },
                    {
                      title: 'Billing updates',
                      description: 'Notify finance team about invoicing events.',
                    },
                    {
                      title: 'Lab results ready',
                      description: 'Alert doctors when lab results are completed.',
                    },
                    {
                      title: 'System incidents',
                      description: 'Get critical alerts and platform updates.',
                    },
                  ].map((item) => (
                    <div
                      key={item.title}
                      className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-4"
                    >
                      <div>
                        <p className="text-sm font-medium text-slate-900">{item.title}</p>
                        <p className="text-xs text-slate-500">{item.description}</p>
                      </div>
                      <label className="relative inline-flex cursor-pointer items-center">
                        <input type="checkbox" className="peer sr-only" defaultChecked />
                        <span className="h-6 w-11 rounded-full bg-slate-200 transition peer-checked:bg-primary-600" />
                        <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition peer-checked:translate-x-5" />
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                  <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Delivery Channels
                  </h4>
                  <div className="mt-4 space-y-3">
                    {[
                      { label: 'Email', icon: Mail, enabled: true },
                      { label: 'SMS', icon: Phone, enabled: true },
                      { label: 'In-App', icon: Bell, enabled: true },
                    ].map((channel) => {
                      const ChannelIcon = channel.icon;

                      return (
                        <div
                          key={channel.label}
                          className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
                        >
                          <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                            <ChannelIcon size={16} />
                            {channel.label}
                          </div>
                          <span className="flex items-center gap-1 text-xs font-medium text-teal-600">
                            <Check size={14} />
                            Enabled
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                  <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Quiet Hours
                  </h4>
                  <div className="mt-4 space-y-3 text-sm text-slate-600">
                    <p>Weekdays: 9:00 PM - 7:00 AM</p>
                    <p>Weekends: Always on</p>
                    <button className="mt-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-900">
                      Adjust schedule
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
              <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900">Security</h3>
                <p className="text-sm text-slate-500">Protect your data and manage access.</p>

                <div className="mt-6 space-y-4">
                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-900">Two-factor authentication</p>
                        <p className="text-xs text-slate-500">Require 2FA for all admins.</p>
                      </div>
                      <label className="relative inline-flex cursor-pointer items-center">
                        <input type="checkbox" className="peer sr-only" defaultChecked />
                        <span className="h-6 w-11 rounded-full bg-slate-200 transition peer-checked:bg-primary-600" />
                        <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition peer-checked:translate-x-5" />
                      </label>
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <p className="text-sm font-medium text-slate-900">Reset admin password</p>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      <div className="relative">
                        <KeyRound className="absolute left-3 top-2.5 text-slate-400" size={16} />
                        <input
                          type="password"
                          placeholder="New password"
                          className="w-full rounded-lg border border-slate-200 py-2 pl-10 pr-3 text-sm"
                        />
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 text-slate-400" size={16} />
                        <input
                          type="password"
                          placeholder="Confirm password"
                          className="w-full rounded-lg border border-slate-200 py-2 pl-10 pr-3 text-sm"
                        />
                      </div>
                    </div>
                    <button className="mt-3 rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800">
                      Update password
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                  <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Active Sessions
                  </h4>
                  <div className="mt-4 space-y-3 text-sm">
                    {[
                      { device: 'MacBook Pro · New York', status: 'Active now' },
                      { device: 'iPad Air · Boston', status: '2 hours ago' },
                      { device: 'Windows PC · NYC', status: 'Yesterday' },
                    ].map((session) => (
                      <div
                        key={session.device}
                        className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
                      >
                        <div>
                          <p className="text-sm font-medium text-slate-900">{session.device}</p>
                          <p className="text-xs text-slate-500">{session.status}</p>
                        </div>
                        <button className="text-xs font-medium text-rose-500 hover:text-rose-600">
                          Revoke
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                  <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Security Status
                  </h4>
                  <div className="mt-4 space-y-3 text-sm text-slate-600">
                    <p>Last audit: Feb 2, 2026</p>
                    <p>Encryption: Enabled</p>
                    <p>Backup cadence: Every 6 hours</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'team' && (
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Team</h3>
                  <p className="text-sm text-slate-500">Add and manage clinic members.</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex flex-wrap items-center gap-4 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-600">
                    <label className="flex items-center gap-2">
                      <span>Group by Department</span>
                      <span className="relative inline-flex h-5 w-9 items-center">
                        <input
                          type="checkbox"
                          className="peer sr-only"
                          checked={groupBy === 'department'}
                          onChange={(event) =>
                            setGroupBy(event.target.checked ? 'department' : 'none')
                          }
                        />
                        <span className="absolute inset-0 rounded-full bg-slate-200 transition peer-checked:bg-primary-600" />
                        <span className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow transition peer-checked:translate-x-4" />
                      </span>
                    </label>
                    <label className="flex items-center gap-2">
                      <span>Group by Position</span>
                      <span className="relative inline-flex h-5 w-9 items-center">
                        <input
                          type="checkbox"
                          className="peer sr-only"
                          checked={groupBy === 'position'}
                          onChange={(event) =>
                            setGroupBy(event.target.checked ? 'position' : 'none')
                          }
                        />
                        <span className="absolute inset-0 rounded-full bg-slate-200 transition peer-checked:bg-primary-600" />
                        <span className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow transition peer-checked:translate-x-4" />
                      </span>
                    </label>
                  </div>
                  <button
                    onClick={() => navigate('/settings/add-member')}
                    className="flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
                  >
                    <UserPlus size={16} />
                    Add member
                  </button>
                </div>
              </div>

              {teamError && (
                <div className="mt-6 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {teamError}
                </div>
              )}

              <div className="mt-6 space-y-6">
                {teamLoading && (
                  <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-4 text-sm text-slate-500">
                    Loading team members...
                  </div>
                )}
                {!teamLoading && teamMembers.length === 0 && !teamError && (
                  <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-4 text-sm text-slate-500">
                    No employees found.
                  </div>
                )}
                {!teamLoading && teamMembers.length > 0 && groupBy === 'none' && (
                  <div className="grid gap-4">
                    {teamMembers.map((member) => {
                      const role = getPositionLabel(member) ?? getDepartmentLabel(member);
                      const statusLabel = member.isActive ? 'Active' : 'Inactive';

                      return (
                        <div
                          key={member.id}
                          className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-4"
                        >
                          <div>
                            <p className="text-sm font-medium text-slate-900">{member.name}</p>
                            <p className="text-xs text-slate-500">{role}</p>
                            {(member.email || member.phone) && (
                              <p className="mt-1 text-xs text-slate-400">
                                {member.email ?? '—'} {member.phone ? `• ${member.phone}` : ''}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">
                              {statusLabel}
                            </span>
                              <button
                                onClick={() => navigate(`/settings/team/${member.id}`)}
                                className="text-xs font-medium text-slate-600 hover:text-slate-900"
                              >
                                Manage
                              </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {!teamLoading && teamMembers.length > 0 && groupBy === 'department' && (
                  <div>
                    <div className="mb-4 flex items-center justify-between">
                      <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                        Grouped by Department
                      </h4>
                      <span className="text-xs text-slate-500">
                        {teamMembers.length} members
                      </span>
                    </div>
                    <div className="space-y-4">
                      {groupedByDepartment.map((group) => (
                        <div key={group.name} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                          <div className="mb-3 flex items-center justify-between">
                            <p className="text-sm font-semibold text-slate-900">{group.name}</p>
                            <span className="text-xs text-slate-500">{group.members.length} members</span>
                          </div>
                          <div className="space-y-3">
                            {group.members.map((member) => {
                                const role = getPositionLabel(member);
                              const statusLabel = member.isActive ? 'Active' : 'Inactive';

                              return (
                                <div
                                  key={member.id}
                                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-4"
                                >
                                  <div>
                                    <p className="text-sm font-medium text-slate-900">{member.name}</p>
                                    <p className="text-xs text-slate-500">{role}</p>
                                    {(member.email || member.phone) && (
                                      <p className="mt-1 text-xs text-slate-400">
                                        {member.email ?? '—'} {member.phone ? `• ${member.phone}` : ''}
                                      </p>
                                    )}
                                  </div>
                                    <div className="flex items-center gap-3">
                                      <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">
                                        {statusLabel}
                                      </span>
                                      <button
                                        onClick={() => navigate(`/settings/team/${member.id}`)}
                                        className="text-xs font-medium text-slate-600 hover:text-slate-900"
                                      >
                                        Manage
                                      </button>
                                    </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {!teamLoading && teamMembers.length > 0 && groupBy === 'position' && (
                  <div>
                    <div className="mb-4 flex items-center justify-between">
                      <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                        Grouped by Position
                      </h4>
                      <span className="text-xs text-slate-500">
                        {teamMembers.length} members
                      </span>
                    </div>
                    <div className="space-y-4">
                      {groupedByPosition.map((group) => (
                        <div key={group.name} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                          <div className="mb-3 flex items-center justify-between">
                            <p className="text-sm font-semibold text-slate-900">{group.name}</p>
                            <span className="text-xs text-slate-500">{group.members.length} members</span>
                          </div>
                          <div className="space-y-3">
                            {group.members.map((member) => {
                                const role = getDepartmentLabel(member);
                              const statusLabel = member.isActive ? 'Active' : 'Inactive';

                              return (
                                <div
                                  key={member.id}
                                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-4"
                                >
                                  <div>
                                    <p className="text-sm font-medium text-slate-900">{member.name}</p>
                                    <p className="text-xs text-slate-500">{role}</p>
                                    {(member.email || member.phone) && (
                                      <p className="mt-1 text-xs text-slate-400">
                                        {member.email ?? '—'} {member.phone ? `• ${member.phone}` : ''}
                                      </p>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">
                                      {statusLabel}
                                    </span>
                                    <button
                                      onClick={() => navigate(`/settings/team/${member.id}`)}
                                      className="text-xs font-medium text-slate-600 hover:text-slate-900"
                                    >
                                      Manage
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

type EmployeeDto = {
  id: number;
  name: string;
  gender?: number;
  phone?: string | null;
  address?: string | null;
  email?: string | null;
  position?: number | null;
  department?: number | null;
  departmentName?: string | null;
  positionName?: string | null;
  hireDate?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  createdOn?: string | null;
  updatedOn?: string | null;
  isActive?: boolean;
};

type ClinicSettingsDto = {
  clinicName: string;
  emailAddress: string;
  website?: string | null;
  address: string;
  primaryPhone: string;
  timezone?: string | null;
  businessHours?: string | null;
  logoUrl?: string | null;
};
