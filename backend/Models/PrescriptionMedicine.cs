using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace backend.Models;

[Index("PrescriptionId", Name = "IX_PrescriptionMedicines_PrescriptionId")]
public partial class PrescriptionMedicine
{
    [Key]
    public int Id { get; set; }

    public int PrescriptionId { get; set; }

    public int? MedicineId { get; set; }

    [StringLength(150)]
    [Unicode(false)]
    public string? MedicineName { get; set; }

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

    [ForeignKey("PrescriptionId")]
    [InverseProperty("PrescriptionMedicines")]
    public virtual Prescription Prescription { get; set; } = null!;
}
