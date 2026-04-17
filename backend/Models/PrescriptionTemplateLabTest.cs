using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace backend.Models;

[Index("TemplateId", Name = "IX_TemplateLabTests_TemplateId")]
public partial class PrescriptionTemplateLabTest
{
    [Key]
    public int Id { get; set; }

    public int TemplateId { get; set; }

    [StringLength(150)]
    [Unicode(false)]
    public string TestName { get; set; } = null!;

    [StringLength(255)]
    [Unicode(false)]
    public string? Requirement { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? Category { get; set; }

    [ForeignKey("TemplateId")]
    [InverseProperty("PrescriptionTemplateLabTests")]
    public virtual PrescriptionTemplate Template { get; set; } = null!;
}
