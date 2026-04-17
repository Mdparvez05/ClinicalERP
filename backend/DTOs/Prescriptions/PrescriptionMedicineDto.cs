namespace backend.DTOs.Prescriptions
{
    public class PrescriptionMedicineDto
    {
        public int? MedicineId { get; set; }
        public string? MedicineName { get; set; }
        public int? Dosage { get; set; }
        public string? FrequencyPattern { get; set; }
        public string? MealTiming { get; set; }
        public int? Duration { get; set; }
        public string? DurationType { get; set; }
    }
}
