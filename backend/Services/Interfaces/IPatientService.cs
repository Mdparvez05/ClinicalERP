using backend.DTOs.Patients;
using backend.Models;

namespace backend.Services.Interfaces
{
    public interface IPatientService
    {
        Task<PagedResult<PatientListDto>> GetPatientsAsync(int pageNumber, int pageSize);
        Task<PatientDetailDto?> GetPatientByIdAsync(int id);
        Task<PatientSearchDto?> SearchPatientsAsync(string term);
        Task<PatientDetailDto> CreatePatientAsync(CreatePatientDto patientDto);
        Task<PatientDetailDto> UpdatePatientAsync(UpdatePatientDto patientDto);
        Task<bool> DeletePatientAsync(int id);
    }
}
