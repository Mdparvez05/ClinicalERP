using backend.Data;
using backend.DTOs.Employees;
using backend.Models;
using backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.Implementations
{
    public class EmployeeService : IEmployeeService
    {
        private readonly ILogger<EmployeeService> _logger;
        private readonly AppDbContext _context;

        public EmployeeService(ILogger<EmployeeService> logger, AppDbContext context)
        {
            _logger = logger;
            _context = context;
        }

        public async Task<List<EmployeeDto>> GetAllEmployeesAsync()
        {
            _logger.LogInformation("GetAllEmployeesAsync called");
            // Placeholder for actual employee retrieval logic
            var employees = await _context.Employees
                .Where(e => e.IsActive)
                .Select(e => new EmployeeDto
                {
                    Id = e.Id,
                    Name = e.FirstName + " " + e.LastName,
                    Gender = e.Gender,
                    Phone = e.Phone,
                    Address = e.Address,
                    Email = e.Email,
                    Position = e.Position,
                    Department = e.Department,
                    DepartmentName = e.DepartmentName, 
                    PositionName = e.PositionName,  
                    HireDate = e.HireDate,
                    CreatedBy = e.CreatedBy,
                    UpdatedBy = e.UpdatedBy,
                    CreatedOn = e.CreatedOn,
                    UpdatedOn = e.UpdatedOn,
                    IsActive = e.IsActive
                })
                .OrderBy(e => e.Name)
                .ToListAsync();
            return employees;
        }

        public async Task<bool> UpdateEmployeeAsync(int id, UpdateEmployeeDto dto)
        {
            var employee = await _context.Employees.FindAsync(id);
            if (employee == null || !employee.IsActive)
                return false;

            _context.Entry(employee).CurrentValues.SetValues(dto);
            employee.UpdatedOn = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return true;
        }


        public async Task<EmployeeDto?> GetEmployeeByIdAsync(int id)
        {
            _logger.LogInformation("GetEmployeeByIdAsync called with ID: {EmployeeId}", id);
            var employee = await (
                from e in _context.Employees
                join ea in _context.EmployeeAdditionals
                    on e.Id equals ea.EmployeeId into empAdd
                from ea in empAdd.DefaultIfEmpty() 
                where e.IsActive && e.Id == id
                select new EmployeeDto
                {
                    Id = e.Id,
                    Name = e.FirstName + " " + e.LastName,
                    Gender = e.Gender,
                    Phone = e.Phone,
                    Address = e.Address,
                    Email = e.Email,
                    Position = e.Position,
                    Department = e.Department,
                    DepartmentName =  e.DepartmentName,
                    PositionName = e.DepartmentName,
                    // From EmployeeAdditional (if exists)
                    HireDate = e.HireDate,
                    CreatedBy = e.CreatedBy,
                    UpdatedBy = e.UpdatedBy,
                    CreatedOn = e.CreatedOn,
                    UpdatedOn = e.UpdatedOn,
                    IsActive = e.IsActive,
                    HasLogin = e.HasLogin,
                    UserName = e.UserName
                }
            ).FirstOrDefaultAsync();

            return employee;
        }

        public async Task<int> AddEmployeeAsync(CreateEmployeeDto dto, int currentUserId)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                var employee = new Employee
                {
                    FirstName = dto.FirstName,
                    LastName = dto.LastName,
                    Gender = dto.Gender,
                    Email = dto.Email,
                    Phone = dto.Phone,
                    Address = dto.Address,
                    Position = dto.Position,
                    Department = dto.Department,
                    HireDate = dto.HireDate,
                    IsActive = dto.IsActive,
                    CreatedBy = currentUserId,
                    UpdatedBy = currentUserId,
                    CreatedOn = DateTime.UtcNow,
                    UpdatedOn = DateTime.UtcNow,

                    UserName = dto.UserName,
                    Password = dto.Password != null
                        ? dto.Password
                        : null,

                    EmployeeAdditional = new EmployeeAdditional
                    {
                        HighestQualification = dto.HighestQualification,
                        BankName = dto.BankName,
                        BankBranch = dto.BankBranch,
                        BankAccountNumber = dto.BankAccountNumber,
                        BankIFSC = dto.BankIFSC
                    }
                };

                _context.Employees.Add(employee);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return employee.Id;
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        //string HashPassword(string password)
        //{
        //    return BCrypt.Net.BCrypt.HashPassword(password);
        //}




    }
}