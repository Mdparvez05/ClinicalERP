using Microsoft.AspNetCore.Mvc;
using backend.DTOs.Patients;
using backend.Services.Interfaces;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PatientController : ControllerBase
    {
        private readonly IPatientService _patientService;
        private readonly ILogger<PatientController> _logger;

        public PatientController(IPatientService patientService, ILogger<PatientController> logger)
        {
            _patientService = patientService;
            _logger = logger;
        }

        // GET: api/Patient
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PatientListDto>>> GetPatients()
        {
            try
            {
                var patients = await _patientService.GetPatientsAsync();

                return Ok(patients);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving patients");
                return StatusCode(500, "Internal server error");
            }
        }

        // GET: api/Patient/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PatientDetailDto>> GetPatient(int id)
        {
            try
            {
                var patient = await _patientService.GetPatientByIdAsync(id);

                if (patient == null)
                {
                    return NotFound($"Patient with ID {id} not found");
                }

                return Ok(patient);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving patient with ID {PatientId}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        // GET: api/Patient/search/{term}
        [HttpGet("search/{term}")]
        public async Task<ActionResult<IEnumerable<PatientSearchDto>>> SearchPatients(string term)
        {
            try
            {
                var patients = await _patientService.SearchPatientsAsync(term);

                return Ok(patients);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error searching patients with term: {SearchTerm}", term);
                return StatusCode(500, "Internal server error");
            }
        }

        // POST: api/Patient
        [HttpPost]
        public async Task<IActionResult> CreatePatient([FromBody] CreatePatientDto patientDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var created = await _patientService.CreatePatientAsync(patientDto);
                return CreatedAtAction(nameof(GetPatient), new { id = created.Id }, created);
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogWarning(ex, "Invalid operation while creating patient");
                return Conflict(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating patient");
                return StatusCode(500, "Internal server error");
            }
        }

        // PUT: api/Patient/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePatient(int id, [FromBody] UpdatePatientDto patientDto)
        {
            try
            {
                if (id != patientDto.Id)
                {
                    return BadRequest(new { message = "ID mismatch between route and body" });
                }

                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var updated = await _patientService.UpdatePatientAsync(patientDto);
                return Ok(updated);
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning(ex, "Invalid argument while updating patient");
                return NotFound(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogWarning(ex, "Invalid operation while updating patient");
                return Conflict(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating patient");
                return StatusCode(500, "Internal server error");
            }
        }

        // DELETE: api/Patient/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePatient(int id)
        {
            try
            {
                var deleted = await _patientService.DeletePatientAsync(id);
                if (!deleted)
                {
                    return NotFound(new { message = "Patient not found" });
                }

                return Ok(new { message = "Patient deactivated successfully", patientId = id });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting patient");
                return StatusCode(500, "Internal server error");
            }
        }
    }
}
