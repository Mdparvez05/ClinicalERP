using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace backend.Models;

[Index("AssignedEmployeeId", Name = "IX_Appointments_AssignedEmployeeId")]
[Index("ClientId", Name = "IX_Appointments_ClientId")]
[Index("PrescribedBy", Name = "IX_Appointments_PrescribedBy")]
[Index("ScheduledOn", Name = "IX_Appointments_ScheduledOn")]
[Index("AppointmentStatus", Name = "IX_Appointments_Status")]
[Index("ParentId", Name = "IX_Appointments_ParentId")]
public partial class Appointment
{
    [Key]
    public int Id { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? Type { get; set; }  // Changed from int? to string

    public int? ParentId { get; set; }

    [StringLength(255)]
    [Unicode(false)]
    public string? Name { get; set; }

    [StringLength(500)]
    [Unicode(false)]
    public string? Description { get; set; }

    public int? ClientId { get; set; }

    public int? AssignedEmployeeId { get; set; }

    public int? PrescribedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? ScheduledOn { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? ClosedOn { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? AppointmentStatus { get; set; }

    [StringLength(1000)]
    [Unicode(false)]
    public string? Notes { get; set; }

    [StringLength(255)]
    [Unicode(false)]
    public string? ClientName { get; set; }

    [StringLength(255)]
    [Unicode(false)]
    public string? AssignedEmployeeName { get; set; }

    // Navigation properties
    [ForeignKey("AssignedEmployeeId")]
    [InverseProperty("AppointmentAssignedEmployees")]
    public virtual Employee? AssignedEmployee { get; set; }

    [ForeignKey("ClientId")]
    [InverseProperty("Appointments")]
    public virtual Client? Client { get; set; }

    [ForeignKey("PrescribedBy")]
    [InverseProperty("AppointmentPrescribedByNavigations")]
    public virtual Employee? PrescribedByNavigation { get; set; }

    [ForeignKey("ParentId")]
    [InverseProperty("InverseParentAppointments")]
    public virtual Appointment? ParentAppointment { get; set; }

    [InverseProperty("ParentAppointment")]
    public virtual ICollection<Appointment> InverseParentAppointments { get; set; } = new List<Appointment>();
}
