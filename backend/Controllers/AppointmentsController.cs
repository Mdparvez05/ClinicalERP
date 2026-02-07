using backend.Services.Interfaces;
using backend.DTOs.Appointments;
using Microsoft.AspNetCore.Mvc;
using backend.Services.Implementations;

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
                return BadRequest(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogWarning(ex, "Invalid operation for appointment creation");
                return Conflict(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in CreateAppointment endpoint");
                return StatusCode(500, new { message = "An error occurred while creating the appointment" });
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
                return StatusCode(500, new { message = "An error occurred while retrieving the appointment" });
            }
        }

        /// <summary>
        /// Gets all appointments with optional filtering
        /// </summary>
        /// <param name="clientId">Filter by client ID</param>
        /// <param name="employeeId">Filter by employee ID</param>
        /// <param name="status">Filter by status</param>
        /// <param name="dateFrom">Filter from date (yyyy-MM-dd)</param>
        /// <param name="dateTo">Filter to date (yyyy-MM-dd)</param>
        /// <returns>List of appointments</returns>
        [HttpGet]
        public async Task<IActionResult> GetAppointments(
            [FromQuery] int? clientId = null,
            [FromQuery] int? employeeId = null,
            [FromQuery] string? status = null,
            [FromQuery] DateTime? dateFrom = null,
            [FromQuery] DateTime? dateTo = null)
        {
            try
            {
                _logger.LogInformation("GetAppointments endpoint called with filters - ClientId: {ClientId}, EmployeeId: {EmployeeId}, Status: {Status}", 
                    clientId, employeeId, status);
                
                var appointments = await _appointmentsService.GetAppointmentsAsync(
                    clientId, employeeId, status, dateFrom, dateTo);
                
                return Ok(appointments);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GetAppointments endpoint");
                return StatusCode(500, new { message = "An error occurred while retrieving appointments" });
            }
        }

        /// <summary>
        /// Gets all available doctors/employees
        /// </summary>
        /// <returns>List of doctors</returns>
        [HttpGet("doctors")]
        public async Task<IActionResult> GetAllDoctors()
        {
            try
            {
                _logger.LogInformation("GetAllDoctors endpoint called");
                
                var doctors = await _appointmentsService.GetAllDoctorsAsync();
                
                return Ok(doctors);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GetAllDoctors endpoint");
                return StatusCode(500, new { message = "An error occurred while retrieving doctors" });
            }
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
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in UpdateAppointment endpoint");
                return StatusCode(500, new { message = "An error occurred while updating the appointment" });
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
                return StatusCode(500, new { message = "An error occurred while cancelling the appointment" });
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
                return StatusCode(500, new { message = "An error occurred while completing the appointment" });
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
                return StatusCode(500, new { message = "An error occurred while retrieving appointments for the date" });
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
                return StatusCode(500, new { message = "An error occurred while checking availability" });
            }
        }
    }
}
