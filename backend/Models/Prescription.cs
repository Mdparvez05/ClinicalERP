using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace backend.Models;

public partial class Prescription
{
    [Key]
    public int Id { get; set; }

    public int? PatientId { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? DoctorName { get; set; }

    [Unicode(false)]
    public string? Notes { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? CreatedOn { get; set; }

    public bool? IsSent { get; set; }

    [StringLength(20)]
    [Unicode(false)]
    public string? SentVia { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? SentOn { get; set; }

    [InverseProperty("Prescription")]
    public virtual ICollection<PrescriptionLabTest> PrescriptionLabTests { get; set; } = new List<PrescriptionLabTest>();

    [InverseProperty("Prescription")]
    public virtual ICollection<PrescriptionMedicine> PrescriptionMedicines { get; set; } = new List<PrescriptionMedicine>();
}
