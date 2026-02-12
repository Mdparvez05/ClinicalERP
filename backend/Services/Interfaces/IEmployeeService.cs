using backend.DTOs.Employees;
namespace backend.Services.Interfaces
{
    public interface IEmployeeService
    {
        Task<List<EmployeeDto>> GetAllEmployeesAsync();
        Task<EmployeeDto?> GetEmployeeByIdAsync(int id);
        Task<bool> UpdateEmployeeAsync(int id, UpdateEmployeeDto updateEmployeeDto);
        Task<int> AddEmployeeAsync(CreateEmployeeDto dto, int currentUserId);
    }
}
