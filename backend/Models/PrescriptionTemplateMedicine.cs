using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace backend.Models;

[Index("TemplateId", Name = "IX_TemplateMedicines_TemplateId")]
public partial class PrescriptionTemplateMedicine
{
    [Key]
    public int Id { get; set; }

    public int TemplateId { get; set; }

    [StringLength(150)]
    [Unicode(false)]
    public string MedicineName { get; set; } = null!;

    public int? Dosage { get; set; }

    [StringLength(10)]
    [Unicode(false)]
    public string? FrequencyPattern { get; set; }

    [StringLength(30)]
    [Unicode(false)]
    public string? MealTiming { get; set; }

    public int? Duration { get; set; }

    [StringLength(10)]
    [Unicode(false)]
    public string? DurationType { get; set; }

    [ForeignKey("TemplateId")]
    [InverseProperty("PrescriptionTemplateMedicines")]
    public virtual PrescriptionTemplate Template { get; set; } = null!;
}
