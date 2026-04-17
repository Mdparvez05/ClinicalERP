using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.DTOs.Prescriptions
{
    public class PrescriptionDto
    {
        public int? PatientId { get; set; }
        public string? DoctorName { get; set; }
        public string? Notes { get; set; }
        public DateTime? CreatedOn { get; set; }
        public List<PrescriptionMedicineDto>? Medicines { get; set; }
        public List<PrescriptionLabTestDto>? LabTests { get; set; }

    }
}
