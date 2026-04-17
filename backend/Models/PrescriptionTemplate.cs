using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace backend.Models;

public partial class PrescriptionTemplate
{
    [Key]
    public int TemplateId { get; set; }

    [StringLength(150)]
    [Unicode(false)]
    public string Name { get; set; } = null!;

    [StringLength(255)]
    [Unicode(false)]
    public string? Diagnosis { get; set; }

    [Unicode(false)]
    public string? Notes { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? CreatedOn { get; set; }

    [InverseProperty("Template")]
    public virtual ICollection<PrescriptionTemplateLabTest> PrescriptionTemplateLabTests { get; set; } = new List<PrescriptionTemplateLabTest>();

    [InverseProperty("Template")]
    public virtual ICollection<PrescriptionTemplateMedicine> PrescriptionTemplateMedicines { get; set; } = new List<PrescriptionTemplateMedicine>();
}
