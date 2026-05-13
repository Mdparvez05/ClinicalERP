using backend.Services.Interfaces;
using backend.DTOs.Appointments;
using Microsoft.AspNetCore.Mvc;
using backend.Services.Implementations;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/appointments")]
    public class AppointmentsController : ControllerBase
    {
        private readonly IAppointmentsService _appointmentsService;
        private readonly IMasterService _masterservice;
        private readonly ILogger<AppointmentsController> _logger;

        public AppointmentsController(IAppointmentsService appointmentsService, ILogger<AppointmentsController> logger, IMasterService masterservice)
        {
            _appointmentsService = appointmentsService;
            _masterservice = masterservice;
            _logger = logger;
        }

        /// <summary>
        /// Creates a new appointment
        /// </summary>
        /// <param name="appointmentDto">Appointment creation data</param>
        /// <returns>Created appointment details</returns>
        [HttpPost]
        [Route("add-appointment")]
        public async Task<IActionResult> CreateAppointment([FromBody] CreateAppointmentDto appointmentDto)
        {
            try
            {
                _logger.LogInformation("CreateAppointment endpoint called for client: {ClientName}", appointmentDto.ClientName);
                
                if (!ModelState.IsValid)
                {
                    _logger.LogWarning("Invalid model state for appointment creation");
                    return BadRequest(ModelState);
                }

                var result = await _appointmentsService.CreateAppointmentAsync(appointmentDto);
                
                _logger.LogInformation("Appointment created successfully with ID: {AppointmentId}", result.Id);
                return CreatedAtAction(nameof(GetAppointmentById), new { id = result.Id }, result);
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning(ex, "Invalid argument for appointment creation");
                throw;
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogWarning(ex, "Invalid operation for appointment creation");
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in CreateAppointment endpoint");
                throw;
            }
        }

        /// <summary>
        /// Gets appointment by ID
        /// </summary>
        /// <param name="id">Appointment ID</param>
        /// <returns>Appointment details</returns>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetAppointmentById(int id)
        {
            try
            {
                _logger.LogInformation("GetAppointmentById endpoint called with ID: {AppointmentId}", id);
                
                var appointment = await _appointmentsService.GetAppointmentByIdAsync(id);
                
                if (appointment == null)
                {
                    _logger.LogWarning("Appointment with ID: {AppointmentId} not found", id);
                    return NotFound(new { message = "Appointment not found" });
                }
                
                return Ok(appointment);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GetAppointmentById endpoint");
                throw;
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetAppointmentsAsync(int pageNumber, int pageSize)
        {
            var result = await _appointmentsService.GetAppointmentsAsync(pageNumber,pageSize);
            return Ok(result);
            
        }

        

        /// <summary>
        /// Updates an existing appointment
        /// </summary>
        /// <param name="id">Appointment ID</param>
        /// <param name="appointmentDto">Updated appointment data</param>
        /// <returns>Updated appointment details</returns>
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAppointment(int id, [FromBody] UpdateAppointmentDto appointmentDto)
        {
            try
            {
                if (id != appointmentDto.Id)
                {
                    return BadRequest(new { message = "ID mismatch between route and body" });
                }

                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                _logger.LogInformation("UpdateAppointment endpoint called for ID: {AppointmentId}", id);
                
                var result = await _appointmentsService.UpdateAppointmentAsync(appointmentDto);
                
                _logger.LogInformation("Appointment updated successfully with ID: {AppointmentId}", id);
                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning(ex, "Invalid argument for appointment update");
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in UpdateAppointment endpoint");
                throw;
            }
        }

        /// <summary>
        /// Cancels an appointment
        /// </summary>
        /// <param name="id">Appointment ID</param>
        /// <returns>Success status</returns>
        [HttpPost("{id}/cancel")]
        public async Task<IActionResult> CancelAppointment(int id)
        {
            try
            {
                _logger.LogInformation("CancelAppointment endpoint called for ID: {AppointmentId}", id);
                
                var result = await _appointmentsService.CancelAppointmentAsync(id);
                
                if (!result)
                {
                    return NotFound(new { message = "Appointment not found" });
                }
                
                _logger.LogInformation("Appointment cancelled successfully with ID: {AppointmentId}", id);
                return Ok(new { message = "Appointment cancelled successfully", appointmentId = id });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in CancelAppointment endpoint");
                throw;
            }
        }

        /// <summary>
        /// Completes an appointment
        /// </summary>
        /// <param name="id">Appointment ID</param>
        /// <returns>Success status</returns>
        [HttpPost("{id}/complete")]
        public async Task<IActionResult> CompleteAppointment(int id)
        {
            try
            {
                _logger.LogInformation("CompleteAppointment endpoint called for ID: {AppointmentId}", id);
                
                var result = await _appointmentsService.CompleteAppointmentAsync(id);
                
                if (!result)
                {
                    return NotFound(new { message = "Appointment not found" });
                }
                
                _logger.LogInformation("Appointment completed successfully with ID: {AppointmentId}", id);
                return Ok(new { message = "Appointment completed successfully", appointmentId = id });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in CompleteAppointment endpoint");
                throw;
            }
        }

        /// <summary>
        /// Gets appointments for a specific date
        /// </summary>
        /// <param name="date">Date (yyyy-MM-dd)</param>
        /// <returns>List of appointments for the date</returns>
        [HttpGet("by-date/{date}")]
        public async Task<IActionResult> GetAppointmentsByDate(DateTime date)
        {
            try
            {
                _logger.LogInformation("GetAppointmentsByDate endpoint called for date: {Date}", date.ToString("yyyy-MM-dd"));
                
                var appointments = await _appointmentsService.GetAppointmentsByDateAsync(date);
                
                return Ok(appointments);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GetAppointmentsByDate endpoint");
                throw;
            }
        }

        /// <summary>
        /// Checks if a time slot is available
        /// </summary>
        /// <param name="employeeId">Doctor/Employee ID</param>
        /// <param name="scheduledTime">Requested time (yyyy-MM-ddTHH:mm:ss)</param>
        /// <returns>Availability status</returns>
        [HttpGet("check-availability")]
        public async Task<IActionResult> CheckTimeSlotAvailability(
            [FromQuery] int employeeId, 
            [FromQuery] DateTime scheduledTime)
        {
            try
            {
                _logger.LogInformation("CheckTimeSlotAvailability endpoint called for Employee: {EmployeeId}, Time: {Time}", 
                    employeeId, scheduledTime);
                
                var isAvailable = await _appointmentsService.IsTimeSlotAvailableAsync(employeeId, scheduledTime);
                
                return Ok(new { 
                    isAvailable, 
                    employeeId, 
                    scheduledTime,
                    message = isAvailable ? "Time slot is available" : "Time slot is not available"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in CheckTimeSlotAvailability endpoint");
                throw;
            }
        }
        [HttpGet("get-labtests")]
        public async Task<IActionResult> GetLabtests()
        {
            var result = await _appointmentsService.GetLabTestsAsync();
            return Ok(result);
        }


    }
}
