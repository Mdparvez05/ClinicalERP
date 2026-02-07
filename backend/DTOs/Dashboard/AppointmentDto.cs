namespace backend.DTOs.Dashboard
{
    /// <summary>
    /// Represents an individual appointment for dashboard display
    /// </summary>
    public class AppointmentDto
    {
        public int Id { get; set; }
        
        public int? ClientId { get; set; }
        
        public string? ClientName { get; set; }  // From denormalized field
        
        public string? EmployeeName { get; set; }  // From denormalized field (AssignedEmployeeName)
        
        public DateTime? ScheduledOn { get; set; }
        
        public string? AppointmentStatus { get; set; }  // Direct VARCHAR field - no joins needed!
        
        public string? AppointmentType { get; set; }  // Changed from int to string (direct from Type field)
        
        public int? AssignedEmployeeId { get; set; }
        
        public string? Name { get; set; }
        
        public string? Description { get; set; }
        
        public string? Notes { get; set; }
    }
}
