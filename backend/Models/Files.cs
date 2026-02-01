using System;

namespace backend.Models
{
    public class Files
    {
        public int Id { get; set; }
        public int Source { get; set; }
        public int SubSource { get; set; }
        public string FileName { get; set; } = string.Empty;
        public string FileType { get; set; } = string.Empty;
        public byte[] Data { get; set; } = Array.Empty<byte>();
        public int TransactionId { get; set; }
        public DateTime UploadedOn { get; set; } = DateTime.UtcNow;
        public int UploadedBy { get; set; } 


    }
}
