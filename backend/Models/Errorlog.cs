namespace backend.Models
{
    public class ErrorLog
    {
        public int Id { get; set; }

        public string Message { get; set; }
        public string StackTrace { get; set; }

        public string Path { get; set; }
        public string Method { get; set; }
        public string? UserName { get; set; }
        public string? UserId { get; set; }
        public string? IPAddress { get; set; }
        public string? UserAgent { get; set; }
        public string? PreviousUrl { get; set; }
        public string? CurrentUrl { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}
