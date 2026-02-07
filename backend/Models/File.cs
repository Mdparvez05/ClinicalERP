using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace backend.Models;

[Index("Source", "SubSource", Name = "IX_Files_Source")]
[Index("TransactionId", Name = "IX_Files_TransactionId")]
public partial class File
{
    [Key]
    public int Id { get; set; }

    public int Source { get; set; }

    public int SubSource { get; set; }

    [StringLength(255)]
    [Unicode(false)]
    public string FileName { get; set; } = null!;

    [StringLength(50)]
    [Unicode(false)]
    public string FileType { get; set; } = null!;

    public byte[] Data { get; set; } = null!;

    public int TransactionId { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime UploadedOn { get; set; }

    public int UploadedBy { get; set; }

    [ForeignKey("UploadedBy")]
    [InverseProperty("Files")]
    public virtual Employee UploadedByNavigation { get; set; } = null!;
}
