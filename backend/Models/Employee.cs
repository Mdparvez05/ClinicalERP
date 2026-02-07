using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace backend.Models;

[Index("Department", Name = "IX_Employees_Department")]
[Index("Position", Name = "IX_Employees_Position")]
[Index("Email", Name = "UX_Employees_Email", IsUnique = true)]
public partial class Employee
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

    [StringLength(100)]
    [Unicode(false)]
    public string Email { get; set; } = null!;

    [StringLength(20)]
    [Unicode(false)]
    public string Phone { get; set; } = null!;

    [StringLength(255)]
    [Unicode(false)]
    public string Address { get; set; } = null!;

    public int Position { get; set; }

    public int Department { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime HireDate { get; set; }

    public int? CreatedBy { get; set; }

    public int? UpdatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime CreatedOn { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime UpdatedOn { get; set; }

    public bool IsActive { get; set; }

    [InverseProperty("AssignedEmployee")]
    public virtual ICollection<Appointment> AppointmentAssignedEmployees { get; set; } = new List<Appointment>();

    [InverseProperty("PrescribedByNavigation")]
    public virtual ICollection<Appointment> AppointmentPrescribedByNavigations { get; set; } = new List<Appointment>();

    [InverseProperty("CreatedByNavigation")]
    public virtual ICollection<Client> ClientCreatedByNavigations { get; set; } = new List<Client>();

    [InverseProperty("UpdatedByNavigation")]
    public virtual ICollection<Client> ClientUpdatedByNavigations { get; set; } = new List<Client>();

    [ForeignKey("CreatedBy")]
    [InverseProperty("InverseCreatedByNavigation")]
    public virtual Employee? CreatedByNavigation { get; set; }

    [InverseProperty("Employee")]
    public virtual EmployeeAdditional? EmployeeAdditional { get; set; }

    [InverseProperty("UploadedByNavigation")]
    public virtual ICollection<File> Files { get; set; } = new List<File>();

    [InverseProperty("CreatedByNavigation")]
    public virtual ICollection<Employee> InverseCreatedByNavigation { get; set; } = new List<Employee>();

    [InverseProperty("UpdatedByNavigation")]
    public virtual ICollection<Employee> InverseUpdatedByNavigation { get; set; } = new List<Employee>();

    [ForeignKey("UpdatedBy")]
    [InverseProperty("InverseUpdatedByNavigation")]
    public virtual Employee? UpdatedByNavigation { get; set; }

    [InverseProperty("Employee")]
    public virtual ICollection<User> Users { get; set; } = new List<User>();
}
