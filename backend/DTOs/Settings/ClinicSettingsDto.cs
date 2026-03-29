using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Settings
{
    public class ClinicSettingsDto
    {
        [Required]
        [StringLength(100)]
        public string ClinicName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [StringLength(100)]
        public string EmailAddress { get; set; } = string.Empty;

        [StringLength(100)]
        public string? Website { get; set; }

        [Required]
        [StringLength(255)]
        public string Address { get; set; } = string.Empty;

        [Required]
        [Phone]
        [StringLength(20)]
        public string PrimaryPhone { get; set; } = string.Empty;

        [StringLength(50)]
        public string? Timezone { get; set; }

        [StringLength(50)]
        public string? BusinessHours { get; set; }
    }

    public class ClinicSettingsResponseDto
    {
        public string ClinicName { get; set; } = string.Empty;
        public string EmailAddress { get; set; } = string.Empty;
        public string? Website { get; set; }
        public string Address { get; set; } = string.Empty;
        public string PrimaryPhone { get; set; } = string.Empty;
        public string? Timezone { get; set; }
        public string? BusinessHours { get; set; }
    }
}
