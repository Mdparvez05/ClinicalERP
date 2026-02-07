using Microsoft.AspNetCore.Mvc;
using backend.Services.Interfaces;
using Microsoft.Extensions.Logging;

namespace backend.Controllers
{
    [Route("api/master")]
    [ApiController]
    public class MasterController : ControllerBase
    {
        private readonly IMasterService _masterService;
        private readonly ILogger<MasterController> _logger;

        public MasterController(IMasterService masterService, ILogger<MasterController> logger)
        {
            _masterService = masterService;
            _logger = logger;
        }
        /// <summary>
        /// Gets all master data required for the application
        /// </summary>
        /// <returns>Master data containing countries, currencies, and languages</returns>
        [HttpGet]
        public async Task<IActionResult> GetMasterData()
        {
            try
            {
                _logger.LogInformation("GetMasterData endpoint called");
                
                var masterData = await _masterService.GetMasterDataAsync();
                
                _logger.LogInformation("GetMasterData endpoint completed successfully");
                return Ok(masterData);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GetMasterData endpoint");
                return StatusCode(500, new { message = "An error occurred while fetching master data" });
            }
        }

        /// <summary>
        /// Gets list of countries
        /// </summary>
        /// <returns>List of countries</returns>
        [HttpGet("countries")]
        public async Task<IActionResult> GetCountries()
        {
            try
            {
                var countries = await _masterService.GetCountriesAsync();
                return Ok(countries);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GetCountries endpoint");
                return StatusCode(500, new { message = "An error occurred while fetching countries" });
            }
        }

        /// <summary>
        /// Gets list of currencies
        /// </summary>
        /// <returns>List of currencies</returns>
        [HttpGet("currencies")]
        public async Task<IActionResult> GetCurrencies()
        {
            try
            {
                var currencies = await _masterService.GetCurrenciesAsync();
                return Ok(currencies);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GetCurrencies endpoint");
                return StatusCode(500, new { message = "An error occurred while fetching currencies" });
            }
        }

        /// <summary>
        /// Gets list of languages
        /// </summary>
        /// <returns>List of languages</returns>
        [HttpGet("languages")]
        public async Task<IActionResult> GetLanguages()
        {
            try
            {
                var languages = await _masterService.GetLanguagesAsync();
                return Ok(languages);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GetLanguages endpoint");
                return StatusCode(500, new { message = "An error occurred while fetching languages" });
            }
        }

        [HttpGet("appointmenttypes")]
        public async Task<IActionResult> GetAppointmentTypes()
        {
            try
            {
                var result = await _masterService.GetAllAppointmentAsync();
                return Ok(result);

            }
            catch(Exception ex)
            {
                _logger.LogError(ex, "Error in Getting appointment types");
                return StatusCode(500, new { message="Error fetching appointment types"});

            }
        }
        [HttpGet("appointment-statuses")]
        public async Task<IActionResult> GetAllAppointmentStatus()
        {
            var result = await _masterService.GetAllAppointmentStatus();
            return Ok(result);
        }


    }
}