using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using backend.DTOs.Patients;

namespace backend.DTOs.Prescriptions
{
    public class PrescriptionDto
    {
        public int? PatientId { get; set; }
        public string? DoctorName { get; set; }
        public string? Notes { get; set; }
        public DateTime? CreatedOn { get; set; }
        public bool? IsSent { get; set; }
        public string? SentVia { get; set; }
        public DateTime? SentOn { get; set; }
        public List<PrescriptionMedicineDto>? Medicines { get; set; }
        public List<PrescriptionLabTestDto>? LabTests { get; set; }

    }
    public class GetPrescriptionDto
    {
        public int? Id { get; set; }
        public int? PatientId { get; set; }
        public string? DoctorName { get; set; }
        public string? Notes { get; set; }
        public DateTime? CreatedOn { get; set; }
        public bool? IsSent { get; set; }
        public string? SentVia { get; set; }
        public DateTime? SentOn { get; set; }
        public List<PrescriptionMedicineDto>? Medicines { get; set; }
        public List<PrescriptionLabTestDto>? LabTests { get; set; }
        public PatientSearchDto? Patient { get; set; }
    }
}
