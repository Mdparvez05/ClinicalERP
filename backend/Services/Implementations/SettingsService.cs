using backend.Data;
using backend.DTOs.Settings;
using backend.Models;
using backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.Implementations
{
    public class SettingsService : ISettingsService
    {
        private readonly AppDbContext _context;
        private readonly ILogger<SettingsService> _logger;

        public SettingsService(AppDbContext context, ILogger<SettingsService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<ClinicSettingsResponseDto> GetClinicSettingsAsync()
        {
            try
            {
                _logger.LogInformation("Fetching clinic settings");

                var settings = await _context.SystemOptions
                    .Where(x => x.Module == "ClinicSettings" && x.IsActive)
                    .ToDictionaryAsync(x => x.Name, x => x.Value);

                return new ClinicSettingsResponseDto
                {
                    ClinicName = settings.GetValueOrDefault("ClinicName", ""),
                    EmailAddress = settings.GetValueOrDefault("EmailAddress", ""),
                    Website = settings.GetValueOrDefault("Website"),
                    Address = settings.GetValueOrDefault("Address", ""),
                    PrimaryPhone = settings.GetValueOrDefault("PrimaryPhone", ""),
                    Timezone = settings.GetValueOrDefault("Timezone"),
                    BusinessHours = settings.GetValueOrDefault("BusinessHours")
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while fetching clinic settings");
                throw;
            }
        }

        public async Task<bool> UpdateClinicSettingsAsync(ClinicSettingsDto dto, int currentUserId)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                _logger.LogInformation("Updating clinic settings");

                var settingsToUpdate = new Dictionary<string, string>
                {
                    { "ClinicName", dto.ClinicName },
                    { "EmailAddress", dto.EmailAddress },
                    { "Website", dto.Website ?? "" },
                    { "Address", dto.Address },
                    { "PrimaryPhone", dto.PrimaryPhone },
                    { "Timezone", dto.Timezone ?? "" },
                    { "BusinessHours", dto.BusinessHours ?? "" }
                };

                foreach (var setting in settingsToUpdate)
                {
                    await UpsertSystemOptionAsync(
                        module: "ClinicSettings",
                        name: setting.Key,
                        type: "Setting",
                        value: setting.Value,
                        description: $"Clinic {setting.Key}",
                        currentUserId: currentUserId
                    );
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                _logger.LogInformation("Successfully updated clinic settings");
                return true;
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                _logger.LogError(ex, "Error occurred while updating clinic settings");
                throw;
            }
        }

        private async Task UpsertSystemOptionAsync(
            string module,
            string name,
            string type,
            string value,
            string description,
            int currentUserId)
        {
            var existingOption = await _context.SystemOptions
                .FirstOrDefaultAsync(x => x.Module == module && x.Name == name);

            if (existingOption != null)
            {
                existingOption.Value = value;
                existingOption.UpdatedBy = currentUserId;
                existingOption.UpdatedOn = DateTime.UtcNow;
                existingOption.IsActive = true;
            }
            else
            {
                var newOption = new SystemOption
                {
                    Module = module,
                    Name = name,
                    Type = type,
                    Description = description,
                    Value = value,
                    IsActive = true,
                    CreatedBy = currentUserId,
                    CreatedOn = DateTime.UtcNow
                };

                _context.SystemOptions.Add(newOption);
            }
        }
    }
}
