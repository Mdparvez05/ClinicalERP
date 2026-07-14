using backend.Services.Implementations;
using backend.Services.Interfaces;

namespace backend.Extensions
{
    public static class DependencyInjectionExtension
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services) {

            services.AddScoped<IMasterService, MasterService>();
            services.AddHttpClient<IChatService, ChatService>();
            services.AddScoped<IDashboardService, DashboardService>();
            services.AddScoped<IAppointmentsService, AppointmentService>();
            services.AddScoped<IDoctorService, DoctorService>();
            services.AddScoped<IPatientService, PatientService>();
            services.AddScoped<IPrescriptionService, PrescriptionService>();
            services.AddScoped<IEmployeeService, EmployeeService>();
            services.AddScoped<ISettingsService, SettingsService>();

            return services;
        }
    }

}
