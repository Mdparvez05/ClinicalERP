using backend.Data;
using backend.DTOs.Appointments;
using backend.DTOs.Employees;
using backend.Models;
using backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Numerics;


namespace backend.Services.Implementations
{
    public class DoctorService : IDoctorService
    {
        private readonly AppDbContext _context;
        private readonly ILogger<DoctorService> _logger;

        public DoctorService(AppDbContext context, ILogger<DoctorService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<List<EmployeeDto>> GetDoctors()
        {
            try
            {
                _logger.LogInformation("Fetching all doctors");

                var result = await _context.Employees
                    .Where(a => a.IsActive && a.Position == 1) // Filter first, then select
                    .Select(a => new EmployeeDto
                    {
                        Id =a.Id,
                        Name = a.FirstName + " " + a.LastName,
                        Gender = a.Gender,
                        Phone = a.Phone,
                        Address = a.Address,
                        Email = a.Email,
                        Position = a.Position,
                        Department = a.Department,
                        DepartmentName = null, // Will be populated if needed
                        PositionName = null,   // Will be populated if needed
                        HireDate = a.HireDate,
                        CreatedBy = a.CreatedBy,
                        UpdatedBy = a.UpdatedBy,
                        CreatedOn = a.CreatedOn,
                        UpdatedOn = a.UpdatedOn,
                        IsActive = a.IsActive
                    })
                    .OrderBy(a => a.Name)
                    .ToListAsync();

                _logger.LogInformation("Successfully retrieved {Count} doctors", result.Count);
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while fetching doctors");
                throw;
            }
        }
        public async Task<EmployeeDto?> GetDoctorById(int id)
        {
            try
            {
                _logger.LogInformation("Fetching doctor with ID: {DoctorId}", id);
                var doctor = await _context.Employees
                    .Where(a => a.IsActive && a.Position == 1 && a.Id == id)
                    .Select(a => new EmployeeDto
                    {
                        Name = a.FirstName + " " + a.LastName,
                    })
                    .FirstOrDefaultAsync();
                return doctor;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while fetching doctor with ID: {DoctorId}", id);
                throw;
            }
        }

        public async Task<EmployeeDto?> UpdateDoctor(int id, EmployeeDto doctorDto)
        {
            try
            {
                _logger.LogInformation("Updating doctor with ID: {DoctorId}", id);
                var doctor = await _context.Employees.FindAsync(id);
                if (doctor == null || !doctor.IsActive || doctor.Position != 1)
                {
                    _logger.LogWarning("Doctor with ID: {DoctorId} not found or is not active", id);
                    return null;
                }
                // Update properties
                var nameParts = doctorDto.Name.Split(' ', 2);
                doctor.FirstName = nameParts[0];
                doctor.LastName = nameParts.Length > 1 ? nameParts[1] : string.Empty;
                doctor.Gender = doctorDto.Gender;
                doctor.Phone = doctorDto.Phone;
                doctor.Address = doctorDto.Address;
                doctor.Email = doctorDto.Email;
                doctor.Position = doctorDto.Position;
                doctor.Department = doctorDto.Department;
                doctor.HireDate = doctorDto.HireDate;
                doctor.UpdatedBy = doctorDto.UpdatedBy;
                doctor.UpdatedOn = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return new EmployeeDto
                {
                    Name = doctor.FirstName + " " + doctor.LastName,
                    Gender = doctor.Gender,
                    Phone = doctor.Phone,
                    Address = doctor.Address,
                    Email = doctor.Email,
                    Position = doctor.Position,
                    Department = doctor.Department,
                    HireDate = doctor.HireDate,
                    CreatedBy = doctor.CreatedBy,
                    UpdatedBy = doctor.UpdatedBy,
                    CreatedOn = doctor.CreatedOn,
                    UpdatedOn = doctor.UpdatedOn,
                    IsActive = doctor.IsActive
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while updating doctor with ID: {DoctorId}", id);
                throw;
            }
        }
        public async Task<EmployeeDto> AddDoctor(EmployeeDto doctordto)
        {
            var nameParts = doctordto.Name.Split(' ', 2);
            var firstName = nameParts[0];
            var lastName = nameParts.Length > 1 ? nameParts[1] : string.Empty;
            var employee = new Employee
            {
                FirstName = firstName,
                LastName = lastName,
                Gender = doctordto.Gender,
                Phone = doctordto.Phone,
                Address = doctordto.Address,
                Email = doctordto.Email,
                Position = doctordto.Position,
                Department = doctordto.Department,
                HireDate = doctordto.HireDate,
                CreatedBy = doctordto.CreatedBy,
                UpdatedBy = doctordto.UpdatedBy,
                CreatedOn = doctordto.CreatedOn,
                UpdatedOn = doctordto.UpdatedOn,
                IsActive = doctordto.IsActive

            };
            _context.Employees.Add(employee);
            await _context.SaveChangesAsync();
            _logger.LogInformation("Successfully added doctor with ID: {id}", employee.Id);

            // Return the created appointment
            return await GetDoctorById(employee.Id)
                   ?? throw new InvalidOperationException("Failed to retrieve created appointment");
        }

        public async Task<bool> DeleteDoctor(int id)
        {
            try
            {
                var doctor = await _context.Employees.FindAsync(id);
                if (doctor == null)
                {
                    return false;
                }
                doctor.IsActive = false;
                doctor.UpdatedOn = DateTime.UtcNow;
                doctor.UpdatedBy = 1;
                await _context.SaveChangesAsync();
                return true;

            }
            catch(Exception ex)
            {
                _logger.LogError(ex, "Error deleting doctor {Id}", id);
                throw;

            }

        }
    }
}
