using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.DTOs.Employees
{
    public class EmployeeDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public int Gender { get; set; }
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public int Position { get; set; }
        public int Department { get; set; }
        public string? DepartmentName { get; set; }
        public string? PositionName { get; set; }
        public DateTime HireDate { get; set; }
        public int? CreatedBy { get; set; }
        public int? UpdatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public DateTime UpdatedOn { get; set; }
        public bool IsActive { get; set; }
        public string? HasLogin { get; set; }
        public string? UserName { get; set; }
        public string? Password { get; set; }
    }
    public class CreateEmployeeDto
    {
        // Employee table
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public int Gender { get; set; }
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public int Position { get; set; }
        public int Department { get; set; }
        public DateTime HireDate { get; set; }
        public bool IsActive { get; set; }

        // Login (optional)
        public string? UserName { get; set; }
        public string? Password { get; set; }

        // EmployeeAdditional table
        public string HighestQualification { get; set; } = string.Empty;
        public string BankName { get; set; } = string.Empty;
        public string BankBranch { get; set; } = string.Empty;
        public string BankAccountNumber { get; set; } = string.Empty;
        public string BankIFSC { get; set; } = string.Empty;
    }

    public class UpdateEmployeeDto
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public int Gender { get; set; }
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public int Position { get; set; }
        public int Department { get; set; }
        public DateTime HireDate { get; set; }
        public bool IsActive { get; set; }

        // Login (optional)
        public string? UserName { get; set; }
        public string? Password { get; set; }

        // EmployeeAdditional table
        public string HighestQualification { get; set; } = string.Empty;
        public string BankName { get; set; } = string.Empty;
        public string BankBranch { get; set; } = string.Empty;
        public string BankAccountNumber { get; set; } = string.Empty;
        public string BankIFSC { get; set; } = string.Empty;
    }



}
