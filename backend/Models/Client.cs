using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace backend.Models;

[Index("Email", Name = "IX_Clients_Email")]
[Index("IsActive", Name = "IX_Clients_IsActive")]
[Index("MedicalRecordNumber", Name = "UX_Clients_MedicalRecord", IsUnique = true)]
public partial class Client
{
    [Key]
    public int Id { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string FirstName { get; set; } = null!;

    [StringLength(50)]
    [Unicode(false)]
    public string LastName { get; set; } = null!;

    public int Gender { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime DateOfBirth { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string Email { get; set; } = null!;

    [StringLength(255)]
    [Unicode(false)]
    public string Address { get; set; } = null!;

    [StringLength(255)]
    [Unicode(false)]
    public string? Address2 { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string City { get; set; } = null!;

    [StringLength(20)]
    [Unicode(false)]
    public string ZipCode { get; set; } = null!;

    [StringLength(50)]
    [Unicode(false)]
    public string Country { get; set; } = null!;

    [StringLength(20)]
    [Unicode(false)]
    public string Phone { get; set; } = null!;

    [StringLength(20)]
    [Unicode(false)]
    public string? Phone2 { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string MedicalRecordNumber { get; set; } = null!;

    [Column(TypeName = "datetime")]
    public DateTime LastAppointmentDate { get; set; }

    public bool IsSubscribed { get; set; }

    public bool IsActive { get; set; }

    public int CreatedBy { get; set; }

    public int UpdatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime CreatedOn { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? UpdatedOn { get; set; }

    [InverseProperty("Client")]
    public virtual ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();

    [ForeignKey("CreatedBy")]
    [InverseProperty("ClientCreatedByNavigations")]
    public virtual Employee CreatedByNavigation { get; set; } = null!;

    [ForeignKey("UpdatedBy")]
    [InverseProperty("ClientUpdatedByNavigations")]
    public virtual Employee UpdatedByNavigation { get; set; } = null!;
}
