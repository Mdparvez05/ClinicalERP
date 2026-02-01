using System;
using System.Collections.Generic;
using System.Reflection;

namespace backend.Models
{
    public class Client
    {
        public int Id { get; set; }

        // Personal info
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;

        public Gender Gender { get; set; }

        public DateTime DateOfBirth { get; set; }

        // Contact
        public string Email { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string Address2 { get; set; } = string.Empty;    
        public string City { get; set; } = string.Empty; 
        public string ZipCode { get; set; } = string.Empty;   
        public string Country { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Phone2 { get; set ; } = string.Empty; 

        // Medical
        public string MedicalRecordNumber { get; set; } = string.Empty;
        public DateTime LastAppointmentDate { get; set; }
        public bool IsSubscribed { get; set; } = false;
        public bool IsActive { get; set; } = true;
        // Audit
        public string CreatedBy { get; set; } = string.Empty;
        public string UpdatedBy { get; set; } = string.Empty;

        public DateTime CreatedOn { get; set; }
        public DateTime? UpdatedOn { get; set; }
        public ICollection<Appointment> Appointments { get; set; }
            = new List<Appointment>();
    }
   
}
