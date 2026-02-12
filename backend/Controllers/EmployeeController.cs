using Microsoft.AspNetCore.Mvc;
using backend.DTOs.Employees;
using backend.Services.Interfaces;

namespace backend.Controllers
{
    [Route("api/employees")]
    [ApiController]
    public class EmployeeController : Controller
    {
        private readonly ILogger<EmployeeController> _logger;
        private readonly IEmployeeService _employeeService;
        public EmployeeController(ILogger<EmployeeController> logger, IEmployeeService employeeService)
        {
            _logger = logger;
            _employeeService = employeeService;
        }


        [HttpGet]
        [Route("list-employees")]
        public async Task<IActionResult> GetAllEmployeesAsync()
        {
            _logger.LogInformation("GetEmployees endpoint called");
            var result = await _employeeService.GetAllEmployeesAsync();
            return Ok(result);

        }

        [HttpGet]
        [Route("{id}", Name = "GetEmployeeById")]
        public async Task<IActionResult> GetEmployeeByIdAsync(int id)
        {
            _logger.LogInformation("GetEmployeeById endpoint called with ID: {EmployeeId}", id);
            var result = await _employeeService.GetEmployeeByIdAsync(id);
            if (result == null)
            {
                return NotFound();
            }
            return Ok(result);
        }
        [HttpPut]
        [Route("{id}")]
        public async Task<IActionResult> UpdateEmployeeAsync(int id, [FromBody] UpdateEmployeeDto updateEmployeeDto)
        {
            _logger.LogInformation("UpdateEmployee endpoint called with ID: {EmployeeId}", id);
            await _employeeService.UpdateEmployeeAsync(id, updateEmployeeDto);
            return NoContent();
        }

        [Route("add-employee")]
        [HttpPost]
        public async Task<IActionResult> AddEmployeeAsync([FromBody] CreateEmployeeDto createEmployeeDto, int currentUserId = 1)
        {
            _logger.LogInformation("AddEmployee endpoint called");
            var result = await _employeeService.AddEmployeeAsync(createEmployeeDto, currentUserId);
            return CreatedAtRoute("GetEmployeeById", new { id = result }, new { id = result });
        }
    } 
}
