using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class Employee
{
    public int Id { get; set; }

    public string FirstName { get; set; } = null!;

    public string LastName { get; set; } = null!;

    public int Gender { get; set; }

    public string Email { get; set; } = null!;

    public string Phone { get; set; } = null!;

    public string Address { get; set; } = null!;

    public int Position { get; set; }

    public int Department { get; set; }

    public DateTime HireDate { get; set; }

    public int? CreatedBy { get; set; }

    public int? UpdatedBy { get; set; }

    public DateTime CreatedOn { get; set; }

    public DateTime UpdatedOn { get; set; }

    public bool IsActive { get; set; }

    public string? DepartmentName { get; set; }

    public string? PositionName { get; set; }

    public string? HasLogin { get; set; }

    public string? UserName { get; set; }

    public string? Password { get; set; }

    public virtual ICollection<Appointment> AppointmentAssignedEmployees { get; set; } = new List<Appointment>();

    public virtual ICollection<Appointment> AppointmentPrescribedByNavigations { get; set; } = new List<Appointment>();

    public virtual ICollection<Client> ClientCreatedByNavigations { get; set; } = new List<Client>();

    public virtual ICollection<Client> ClientUpdatedByNavigations { get; set; } = new List<Client>();

    public virtual Employee? CreatedByNavigation { get; set; }

    public virtual EmployeeAdditional? EmployeeAdditional { get; set; }

    public virtual ICollection<File> Files { get; set; } = new List<File>();

    public virtual ICollection<Employee> InverseCreatedByNavigation { get; set; } = new List<Employee>();

    public virtual ICollection<Employee> InverseUpdatedByNavigation { get; set; } = new List<Employee>();

    public virtual Employee? UpdatedByNavigation { get; set; }

    public virtual ICollection<User> Users { get; set; } = new List<User>();
}
