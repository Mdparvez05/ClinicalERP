using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace backend.Models;

[Table("EmployeeAdditional")]
[Index("EmployeeId", Name = "UX_EmployeeAdditional_Employee", IsUnique = true)]
public partial class EmployeeAdditional
{
    [Key]
    public int Id { get; set; }

    public int EmployeeId { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string HighestQualification { get; set; } = null!;

    [StringLength(100)]
    [Unicode(false)]
    public string BankName { get; set; } = null!;

    [StringLength(100)]
    [Unicode(false)]
    public string BankBranch { get; set; } = null!;

    [StringLength(30)]
    [Unicode(false)]
    public string BankAccountNumber { get; set; } = null!;

    [StringLength(20)]
    [Unicode(false)]
    public string BankIFSC { get; set; } = null!;

    [ForeignKey("EmployeeId")]
    [InverseProperty("EmployeeAdditional")]
    public virtual Employee Employee { get; set; } = null!;
}
