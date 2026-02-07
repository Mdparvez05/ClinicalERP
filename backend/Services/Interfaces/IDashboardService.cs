using backend.DTOs.Dashboard;
using Microsoft.Extensions.Configuration;

namespace backend.Services.Interfaces
{
    public interface IDashboardService
    {
        /// <summary>
        /// Gets today's appointments
        /// </summary>
        /// <returns>Today's appointments data with count and details</returns>
        Task<TodayAppointmentsDto> GetTodayAppointmentsAsync();

        /// <summary>
        /// Gets total number of clients
        /// </summary>
        /// <returns>Total count of clients</returns>
        Task<int> GetTotalClientsAsync();

        /// <summary>
        /// Gets count of pending lab tests
        /// </summary>
        /// <returns>Count of pending lab tests</returns>
        Task<int> GetPendingLabTests();

        /// <summary>
        /// Gets all appointments with full details
        /// </summary>
        /// <returns>List of all appointments with client, employee, and status information</returns>
        Task<List<AppointmentDto>> GetTotalAppointmentsAsync();
        
    }
}
