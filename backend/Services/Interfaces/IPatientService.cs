using backend.DTOs.Patients;

namespace backend.Services.Interfaces
{
    public interface IPatientService
    {
        Task<List<PatientListDto>> GetPatientsAsync();
        Task<PatientDetailDto?> GetPatientByIdAsync(int id);
        Task<List<PatientSearchDto>> SearchPatientsAsync(string term);
        Task<PatientDetailDto> CreatePatientAsync(CreatePatientDto patientDto);
        Task<PatientDetailDto> UpdatePatientAsync(UpdatePatientDto patientDto);
        Task<bool> DeletePatientAsync(int id);
    }
}
