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
        public readonly PrescriptionService _prescriptionService;
        private readonly ILogger<PrescriptionController> _logger;
        public PrescriptionController(PrescriptionService prescriptionService, ILogger<PrescriptionController> logger)
        {
            _prescriptionService = prescriptionService;
            _logger = logger;
        }


        [HttpPost]
        public async Task<ActionResult<int>> Create(PrescriptionDto dto)
        {
            var id = await _prescriptionService.CreatePrescriptionAsync(dto);
            return Ok(id);
        }
    }
}
