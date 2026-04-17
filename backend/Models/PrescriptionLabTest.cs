using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace backend.Models;

public partial class PrescriptionLabTest
{
    [Key]
    public int Id { get; set; }

    public int PrescriptionId { get; set; }

    [StringLength(150)]
    [Unicode(false)]
    public string? TestName { get; set; }

    [StringLength(255)]
    [Unicode(false)]
    public string? Requirement { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? Category { get; set; }

    [ForeignKey("PrescriptionId")]
    [InverseProperty("PrescriptionLabTests")]
    public virtual Prescription Prescription { get; set; } = null!;
}
