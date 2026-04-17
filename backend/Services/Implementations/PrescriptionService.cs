using backend.Data;
using backend.DTOs.Prescriptions;
using backend.Models;
using backend.Services.Interfaces;
using Microsoft.Identity.Client;

namespace backend.Services.Implementations
{
    public class PrescriptionService : IPrescriptionService
    {
        public readonly AppDbContext _context;
        private readonly ILogger<PrescriptionService> _logger;
        public PrescriptionService(AppDbContext context , ILogger<PrescriptionService> logger)
        {
            _context = context;
            _logger = logger;
        }
        public async Task<int> CreatePrescriptionAsync(PrescriptionDto prescriptionDto)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                var prescription = new Prescription
                {
                    PatientId = prescriptionDto.PatientId,
                    DoctorName = prescriptionDto.DoctorName,
                    Notes = prescriptionDto.Notes
                };

                _context.Prescriptions.Add(prescription);
                await _context.SaveChangesAsync();

                var prescriptionId = prescription.Id;

                if (prescriptionDto.Medicines != null && prescriptionDto.Medicines.Any())
                {
                    foreach (var med in prescriptionDto.Medicines)
                    {
                        var prescriptionMedicine = new PrescriptionMedicine
                        {
                            PrescriptionId = prescriptionId,
                            MedicineName = med.MedicineName,
                            Dosage = med.Dosage,
                            FrequencyPattern = med.FrequencyPattern,
                            MealTiming = med.MealTiming,
                            Duration = med.Duration,
                            DurationType = med.DurationType
                        };

                        _context.PrescriptionMedicines.Add(prescriptionMedicine);
                    }

                    await _context.SaveChangesAsync();
                }
                if (prescriptionDto.LabTests != null && prescriptionDto.LabTests.Any())
                {
                    var labTests = prescriptionDto.LabTests.Select(test => new PrescriptionLabTest
                    {
                        PrescriptionId = prescriptionId,
                        TestName = test.TestName,
                        Requirement = test.Requirement,
                        Category = test.Category
                    });

                    _context.PrescriptionLabTests.AddRange(labTests);
                    await _context.SaveChangesAsync();
                }

                await transaction.CommitAsync();

                return prescriptionId;
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                _logger.LogError(ex, "Error creating prescription");
                throw;
            }
        }

        
    }
}
