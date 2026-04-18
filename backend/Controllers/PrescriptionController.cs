using backend.DTOs.Prescriptions;
using backend.Models;
using backend.Services.Implementations;
using backend.Services.Interfaces;
using Humanizer;
using Microsoft.AspNetCore.Mvc;
namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PrescriptionController : ControllerBase
    {
        public readonly IPrescriptionService _prescriptionService;
        private readonly ILogger<PrescriptionController> _logger;
        public PrescriptionController(IPrescriptionService prescriptionService, ILogger<PrescriptionController> logger)
        {
            _prescriptionService = prescriptionService;
            _logger = logger;
        }


        [HttpPost]
        public async Task<ActionResult<int>> CreatePrescription(PrescriptionDto dto)
        {
            var id = await _prescriptionService.CreatePrescriptionAsync(dto);
            return Ok(id);
        }

        [HttpGet("recent")]
        public async Task<IActionResult> GetPrevious5Prescriptions()
        {
            var data = await _prescriptionService.GetPrevious5PrescriptionsAsync();
            return Ok(data);
        }

        [HttpGet("templates")]
        public async Task<IActionResult> GetTemplates()
        {
            var data = await _prescriptionService.GetPrescriptionTemplates();
            return Ok(data);
        }
    }
}
