using backend.DTOs.Employees;
using backend.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/doctors")]
    public class DoctorsController : ControllerBase
    {
        private readonly IDoctorService _doctorService;
        private readonly ILogger<DoctorsController> _logger;

        public DoctorsController(IDoctorService doctorService, ILogger<DoctorsController> logger)
        {
            _doctorService = doctorService;
            _logger = logger;
        }

        /// <summary>
        /// Gets all doctors
        /// </summary>
        /// <returns>List of doctors</returns>
        [HttpGet("list-doctors")]
        public async Task<IActionResult> GetAllDoctors()
        {
            try
            {
                _logger.LogInformation("GetAllDoctors endpoint called");

                var result = await _doctorService.GetDoctors();

                _logger.LogInformation("Successfully retrieved {Count} doctors", result.Count);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GetAllDoctors endpoint");
                return StatusCode(500, new { message = "An error occurred while retrieving doctors" });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetDoctorById(int id)
        {
            try
            {
                _logger.LogInformation("GetDoctorById endpoint called with ID: {DoctorId}", id);

                var doctor = await _doctorService.GetDoctorById(id);

                if (doctor == null)
                {
                    _logger.LogWarning("Doctor with ID: {DoctorId} not found", id);
                    return NotFound(new { message = "Doctor not found" });
                }

                return Ok(doctor);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GetDoctorById endpoint");
                return StatusCode(500, new { message = "An error occurred while retrieving the doctor" });
            }
        }

        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateDoctor(int id,[FromBody] EmployeeDto doctorDto)
        {
            try
            {
                _logger.LogInformation("UpdateDoctor endpoint called with ID: {DoctorId}", id);

                var doctor = await _doctorService.UpdateDoctor(id, doctorDto);

                if (doctor == null)
                {
                    _logger.LogWarning("Doctor with ID: {DoctorId} not found for update", id);
                    return NotFound(new { message = "Doctor not found" });
                }
                // Here you would typically return a view or DTO for editing
                return Ok(doctor);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in UpdateDoctor endpoint");
                return StatusCode(500, new { message = "An error occurred while preparing the doctor update" });
            }
        }

        [Route("add-doctor")]
        [HttpPost]
        public async Task<IActionResult> AddDoctor([FromBody] EmployeeDto doctorDto)
        {
            try
            {
                var result = await _doctorService.AddDoctor(doctorDto);
                if (result == null)
                {
                    _logger.LogWarning("Error Adding Record");

                }
                return Ok(result);
            }
            catch(Exception ex)
            {

                _logger.LogError(ex, "Error in Adding Doctor");
                return StatusCode(500, new { message = "An error occurred while adding doctor" });
            }
        }

        [Route("delete/{id}")]
        [HttpDelete]
        public async Task<bool> DeleteDoctor(int id)
        {
            var result = await _doctorService.DeleteDoctor(id);
            if(result == true)
            {
                Ok(new { message = "Deleted" });
            }
            BadRequest(new {message = "Error Deleting Doctor" });
            return result;
        }
    }
}