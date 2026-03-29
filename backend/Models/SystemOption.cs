using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace backend.Models;

public partial class SystemOption
{
    [Key]
    public int Id { get; set; }

    [StringLength(20)]
    [Unicode(false)]
    public string Module { get; set; } = null!;

    [StringLength(100)]
    [Unicode(false)]
    public string Name { get; set; } = null!;

    [StringLength(100)]
    [Unicode(false)]
    public string Type { get; set; } = null!;

    [StringLength(255)]
    [Unicode(false)]
    public string? Description { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string Value { get; set; } = null!;

    public bool IsActive { get; set; }

    public int CreatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime CreatedOn { get; set; }

    public int? UpdatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? UpdatedOn { get; set; }

    [Unicode(false)]
    public string? Notes { get; set; }
}
