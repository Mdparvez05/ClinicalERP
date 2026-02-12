using backend.DTOs.Settings;

namespace backend.Services.Interfaces
{
    public interface ISettingsService
    {
        Task<ClinicSettingsResponseDto> GetClinicSettingsAsync();
        Task<bool> UpdateClinicSettingsAsync(ClinicSettingsDto dto, int currentUserId);
    }
}
