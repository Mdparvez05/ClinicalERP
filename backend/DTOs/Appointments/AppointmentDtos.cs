using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Appointments
{
    /// <summary>
    /// DTO for creating a new appointment
    /// </summary>
    public class CreateAppointmentDto
    {
        [Required]
        public int ClientId { get; set; }
        
        [Required]
        [StringLength(255)]
        public string ClientName { get; set; } = string.Empty;
        
        [Required]
        public int AssignedEmployeeId { get; set; }
        
        [Required]
        [StringLength(255)]
        public string AssignedEmployeeName { get; set; } = string.Empty;
        
        public int? PrescribedBy { get; set; }
        
        [Required]
        public DateTime ScheduledOn { get; set; }
        
        [StringLength(50)]
        public string? Type { get; set; }  // Changed from int? to string
        
        [StringLength(50)]
        public string AppointmentStatus { get; set; } = "Scheduled";  // Default to "Scheduled"
        
        [StringLength(255)]
        public string? Name { get; set; }
        
        [StringLength(500)]
        public string? Description { get; set; }
        
        [StringLength(1000)]
        public string? Notes { get; set; }
        
        public int? ParentId { get; set; }  // For follow-up appointments
    }
    
    /// <summary>
    /// DTO for updating an existing appointment
    /// </summary>
    public class UpdateAppointmentDto
    {
        [Required]
        public int Id { get; set; }
        
        public int? ClientId { get; set; }
        
        [StringLength(255)]
        public string? ClientName { get; set; }
        
        public int? AssignedEmployeeId { get; set; }
        
        [StringLength(255)]
        public string? AssignedEmployeeName { get; set; }
        
        public int? PrescribedBy { get; set; }
        
        public DateTime? ScheduledOn { get; set; }
        
        [StringLength(50)]
        public string? Type { get; set; }  // Changed from int? to string
        
        [StringLength(50)]
        public string? AppointmentStatus { get; set; }
        
        [StringLength(255)]
        public string? Name { get; set; }
        
        [StringLength(500)]
        public string? Description { get; set; }
        
        [StringLength(1000)]
        public string? Notes { get; set; }
        
        public DateTime? ClosedOn { get; set; }
        
        public int? ParentId { get; set; }
    }
    
    /// <summary>
    /// DTO for appointment details response
    /// </summary>
    public class AppointmentDetailDto
    {
        public int Id { get; set; }
        
        public string? Name { get; set; }
        
        public string? Description { get; set; }
        
        public DateTime? ScheduledOn { get; set; }
        
        public DateTime? ClosedOn { get; set; }
        
        public string? Notes { get; set; }
        
        public string? Type { get; set; }  // Changed from int? to string
        
        public string? AppointmentStatus { get; set; }
        
        // Client Info (from denormalized fields + relations)
        public int? ClientId { get; set; }
        
        public string? ClientName { get; set; }  // From denormalized field
        
        public string? ClientPhone { get; set; }  // From Client relation (if needed)
        
        public string? ClientEmail { get; set; }  // From Client relation (if needed)
        
        // Employee Info (from denormalized fields + relations)
        public int? AssignedEmployeeId { get; set; }
        
        public string? AssignedEmployeeName { get; set; }  // From denormalized field
        
        public string? EmployeePosition { get; set; }  // From Employee relation (if needed)
        
        // Prescribed By Info (optional)
        public int? PrescribedBy { get; set; }
        
        public string? PrescribedByName { get; set; }  // From Employee relation
        
        // Parent Appointment (for follow-ups)
        public int? ParentId { get; set; }
        
        public string? ParentAppointmentName { get; set; }
    }
    
    /// <summary>
    /// DTO for simple appointment list view
    /// </summary>
    public class AppointmentListDto
    {
        public int Id { get; set; }
        
        public string? Name { get; set; }
        
        public DateTime? ScheduledOn { get; set; }
        
        public string? AppointmentStatus { get; set; }
        
        public string? ClientName { get; set; }
        
        public string? AssignedEmployeeName { get; set; }
        
        public string? Type { get; set; }  // Changed from int? to string
    }
    
    /// <summary>
    /// DTO for doctor/employee information
    /// </summary>
    public class DoctorDto
    {
        public int Id { get; set; }
        
        public string? FirstName { get; set; }
        
        public string? LastName { get; set; }
        
        public string? FullName { get; set; }
        
        public string? Position { get; set; }
        
        public string? Department { get; set; }
        
        public string? Email { get; set; }
        
        public string? Phone { get; set; }
        
        public bool IsActive { get; set; }
    }
}