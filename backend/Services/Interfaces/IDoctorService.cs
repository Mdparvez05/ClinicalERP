using backend.DTOs.Employees;
namespace backend.Services.Interfaces
{
    public interface IDoctorService
    {
        Task<List<EmployeeDto>> GetDoctors();
        Task<EmployeeDto?> GetDoctorById(int id);
        Task<EmployeeDto> AddDoctor(EmployeeDto doctorDto);
        Task<EmployeeDto> UpdateDoctor(int id, EmployeeDto doctorDto);
        Task<bool> DeleteDoctor(int id);
    }

}
