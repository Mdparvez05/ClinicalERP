using backend.Models;
using backend.DTOs;
using backend.DTOs.Prescriptions;

namespace backend.Services.Interfaces
{
    public interface IPrescriptionService
    {
       Task<int> CreatePrescriptionAsync(PrescriptionDto prescriptionDto);

       Task<List<GetPrescriptionDto>> GetPrevious5PrescriptionsAsync();
       Task<List<PrescriptionTemplateDto>> GetPrescriptionTemplates();
    }
}
