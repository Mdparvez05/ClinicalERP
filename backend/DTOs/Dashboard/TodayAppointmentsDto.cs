namespace backend.DTOs.Dashboard
{
    /// <summary>
    /// Represents today's appointments data for dashboard
    /// </summary>
    public class TodayAppointmentsDto
    {
        /// <summary>
        /// The date for which appointments are retrieved
        /// </summary>
        public DateTime Date { get; set; }
        
        /// <summary>
        /// Total number of appointments for the date
        /// </summary>
        public int TotalAppointments { get; set; }
        
        /// <summary>
        /// List of appointment details
        /// </summary>
        public List<AppointmentDto> Appointments { get; set; } = new();
    }
}
