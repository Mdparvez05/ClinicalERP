using Microsoft.AspNetCore.Mvc;
using backend.Services.Interfaces;
using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace backend.Controllers
{

    [Route("api/dashboard")]
    [ApiController]

    public class DashboardController : ControllerBase
    {
        private readonly IDashboardService _dashboardService;
        private readonly ILogger<DashboardController> _logger;

        public DashboardController(IDashboardService dashboardService, ILogger<DashboardController> logger)
        {
            _dashboardService = dashboardService;
            _logger = logger;
        }

        /// <summary>
        /// Gets today's appointments
        /// </summary>
        /// <returns>Today's appointments with count and details</returns>
        [HttpGet("today-appointments")]
        public async Task<IActionResult> GetTodayAppointments()
        {
            try
            {
                _logger.LogInformation("GetTodayAppointments endpoint called");
                
                var todayAppointments = await _dashboardService.GetTodayAppointmentsAsync();
                
                _logger.LogInformation("GetTodayAppointments completed successfully with {Count} appointments", 
                    todayAppointments.TotalAppointments);
                
                return Ok(todayAppointments);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GetTodayAppointments endpoint");
                return StatusCode(500, new { message = "An error occurred while fetching today's appointments" });
            }
        }

        [HttpGet("getPendingLabTests")]

        public async Task<IActionResult> GetPendingLabTests()
        {
            var result = await _dashboardService.GetPendingLabTests();
            return Ok(result);

        }

        [HttpGet("getTotalClients")]
        public async Task<ActionResult> GetTotalClients()
        {
            var result = await _dashboardService.GetTotalClientsAsync();
            return Ok(result);
        }


        [HttpGet("total-appointments")]
        public async Task<IActionResult> GetTotalAppointments()
        {
            var result = await _dashboardService.GetTotalAppointmentsAsync();
            return Ok(result);
        }

       
        
    }
}