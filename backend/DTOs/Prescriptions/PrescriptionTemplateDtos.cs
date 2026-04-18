namespace backend.DTOs.Prescriptions
{
    public class PrescriptionTemplateDto
    {
        public int TemplateId { get; set; }
        public string Name { get; set; } = null!;   
        public string? Diagnosis { get; set; }
        public string? Notes { get; set; }
        public DateTime? CreatedOn { get; set; }
        public List<TemplateMedicineDto>? Medicines { get; set; }
        public List<TemplateLabTestDto>? LabTests { get; set; }

    }
    public class TemplateLabTestDto
    {
        public int Id { get; set; }
        public int TemplateId { get; set; }
        public string TestName { get; set; } = null!;
        public string? Requirement { get; set; }
        public string? Category { get; set; }


    }
    public class TemplateMedicineDto
    {
        public int Id { get; set; }
        public int TemplateId { get; set; }
        public string MedicineName { get; set; } = null!;
        public int? Dosage { get; set; } = null!;
        public string DosageUnit { get; set; } = null!;
        public string? FrequencyPattern { get; set; }
        public string? MealTiming { get; set; }
        public int? Duration { get; set; }
        public string? DurationType { get; set; }
    }
}
