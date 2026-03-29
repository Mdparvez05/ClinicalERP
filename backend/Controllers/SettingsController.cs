using Microsoft.AspNetCore.Mvc;
using backend.DTOs.Settings;
using backend.Services.Interfaces;

namespace backend.Controllers
{
    [Route("api/settings")]
    [ApiController]
    public class SettingsController : ControllerBase
    {
        private readonly ILogger<SettingsController> _logger;
        private readonly ISettingsService _settingsService;

        public SettingsController(ILogger<SettingsController> logger, ISettingsService settingsService)
        {
            _logger = logger;
            _settingsService = settingsService;
        }

        /// <summary>
        /// Get clinic settings
        /// </summary>
        [HttpGet]
        [Route("clinic")]
        public async Task<IActionResult> GetClinicSettingsAsync()
        {
            try
            {
                _logger.LogInformation("GetClinicSettings endpoint called");
                var result = await _settingsService.GetClinicSettingsAsync();
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GetClinicSettings endpoint");
                return StatusCode(500, new { message = "An error occurred while retrieving clinic settings" });
            }
        }

        /// <summary>
        /// Update clinic settings
        /// </summary>
        [HttpPut]
        [Route("clinic")]
        public async Task<IActionResult> UpdateClinicSettingsAsync([FromBody] ClinicSettingsDto dto, [FromQuery] int currentUserId = 1)
        {
            try
            {
                _logger.LogInformation("UpdateClinicSettings endpoint called");

                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var result = await _settingsService.UpdateClinicSettingsAsync(dto, currentUserId);

                if (result)
                {
                    return Ok(new { message = "Clinic settings updated successfully" });
                }

                return BadRequest(new { message = "Failed to update clinic settings" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in UpdateClinicSettings endpoint");
                return StatusCode(500, new { message = "An error occurred while updating clinic settings" });
            }
        }
    }
}
