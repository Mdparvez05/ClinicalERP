using backend.DTOs.Appointments;
using backend.DTOs.Dashboard;

namespace backend.Services.Interfaces
{
    public interface IAppointmentsService 
    {
        /// <summary>
        /// Creates a new appointment
        /// </summary>
        /// <param name="appointmentDto">Appointment creation data</param>
        /// <returns>Created appointment details</returns>
        Task<AppointmentDetailDto> CreateAppointmentAsync(CreateAppointmentDto appointmentDto);

        /// <summary>
        /// Gets appointment by ID
        /// </summary>
        /// <param name="id">Appointment ID</param>
        /// <returns>Appointment details</returns>
        Task<AppointmentDetailDto?> GetAppointmentByIdAsync(int id);

        /// <summary>
        /// Gets all appointments with filtering options
        /// </summary>
        /// <param name="clientId">Filter by client ID (optional)</param>
        /// <param name="employeeId">Filter by employee ID (optional)</param>
        /// <param name="status">Filter by status string (optional)</param>
        /// <param name="dateFrom">Filter from date (optional)</param>
        /// <param name="dateTo">Filter to date (optional)</param>
        /// <returns>List of appointments</returns>
        Task<List<AppointmentDetailDto>> GetAppointmentsAsync(int? clientId = null, int? employeeId = null, 
            string? status = null, DateTime? dateFrom = null, DateTime? dateTo = null);

        /// <summary>
        /// Updates an existing appointment
        /// </summary>
        /// <param name="appointmentDto">Appointment update data</param>
        /// <returns>Updated appointment details</returns>
        Task<AppointmentDetailDto> UpdateAppointmentAsync(UpdateAppointmentDto appointmentDto);

        /// <summary>
        /// Cancels an appointment
        /// </summary>
        /// <param name="id">Appointment ID</param>
        /// <returns>Success status</returns>
        Task<bool> CancelAppointmentAsync(int id);

        /// <summary>
        /// Completes an appointment
        /// </summary>
        /// <param name="id">Appointment ID</param>
        /// <returns>Success status</returns>
        Task<bool> CompleteAppointmentAsync(int id);

        /// <summary>
        /// Gets all available doctors/employees
        /// </summary>
        /// <returns>List of doctors</returns>
        Task<List<DoctorDto>> GetAllDoctorsAsync();

        /// <summary>
        /// Gets appointments for a specific date
        /// </summary>
        /// <param name="date">Date to filter appointments</param>
        /// <returns>List of appointments for the date</returns>
        Task<List<AppointmentDetailDto>> GetAppointmentsByDateAsync(DateTime date);

        /// <summary>
        /// Checks if a time slot is available for booking
        /// </summary>
        /// <param name="employeeId">Doctor/Employee ID</param>
        /// <param name="scheduledTime">Requested appointment time</param>
        /// <returns>True if slot is available</returns>
        Task<bool> IsTimeSlotAvailableAsync(int employeeId, DateTime scheduledTime);
    }
}
