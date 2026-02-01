using System;

namespace backend.Models
{
    public class Appointment
    {
        public int Id { get; set; }
        public int ParentId { get; set; }   
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int ClientId {get; set; }
        public Client Client { get; set; }
        public int AssignedEmployeeId { get; set; } 
        public DateTime ScheduledOn { get; set; }
        public DateTime? ClosedOn { get; set; }
        public AppointmentStatus Status { get; set; } 
        public AppointmentType Type { get; set; } 
        public int PrescribedBy { get; set; }

    }
    public enum AppointmentStatus
    {
        Booked = 1,
        Completed = 2,
        Cancelled = 3,
        NoShow = 4
    }

    public enum AppointmentType
    {
        DoctorConsultation = 1,
        LabTest = 2,
        HealthCheckup = 3
    }


}
