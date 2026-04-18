using backend.Data;
using backend.DTOs.Patients;
using backend.DTOs.Prescriptions;
using backend.Models;
using backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
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
                    Notes = prescriptionDto.Notes,
                    CreatedOn = DateTime.UtcNow
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
                            DosageUnit = med.DosageUnit,
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

        public async Task<List<GetPrescriptionDto>> GetPrevious5PrescriptionsAsync()
        {
            try
            {
                var prescriptions = await _context.Prescriptions
                    .Include(p => p.Clients)
                    .Include(p => p.PrescriptionMedicines)
                    .Include(p => p.PrescriptionLabTests)
                    .OrderByDescending(p => p.CreatedOn)
                    .Take(5)
                    .ToListAsync(); // ← materialise first

                var result = prescriptions.Select(p => new GetPrescriptionDto
                {
                    Id = p.Id,
                    PatientId = p.PatientId,
                    DoctorName = p.DoctorName,
                    Notes = p.Notes,
                    CreatedOn = p.CreatedOn,
                    SentOn = p.SentOn,
                    SentVia = p.SentVia,
                    Patient = new PatientSearchDto
                    {
                        FirstName = p.Clients.FirstOrDefault()?.FirstName ?? string.Empty,
                        LastName = p.Clients.FirstOrDefault()?.LastName ?? string.Empty,
                        Email = p.Clients.FirstOrDefault()?.Email,
                        Phone = p.Clients.FirstOrDefault()?.Phone ?? string.Empty
                    },
                    Medicines = p.PrescriptionMedicines.Select(m => new PrescriptionMedicineDto
                    {
                        MedicineName = m.MedicineName,
                        Dosage = m.Dosage,
                        DosageUnit = m.DosageUnit,
                        FrequencyPattern = m.FrequencyPattern,
                        MealTiming = m.MealTiming,
                        Duration = m.Duration,
                        DurationType = m.DurationType
                    }).ToList(),
                    LabTests = p.PrescriptionLabTests.Select(l => new PrescriptionLabTestDto
                    {
                        TestName = l.TestName,
                        Requirement = l.Requirement,
                        Category = l.Category
                    }).ToList()
                }).ToList();

                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching previous prescriptions");
                throw;
            }
        }

        public async Task<List<PrescriptionTemplateDto>> GetPrescriptionTemplates()
        {
            try
            {
                var templates = await _context.PrescriptionTemplates
                    .OrderByDescending(p => p.CreatedOn)
                    .Select(p => new PrescriptionTemplateDto
                    {
                        TemplateId = p.TemplateId,
                        Name = p.Name,
                        Notes = p.Notes,
                        Medicines = p.PrescriptionTemplateMedicines.Select(m => new TemplateMedicineDto
                        {
                            Id = m.Id,
                            TemplateId = m.TemplateId,
                            MedicineName = m.MedicineName,
                            Dosage = m.Dosage,
                            DosageUnit = m.DosageUnit,
                            FrequencyPattern = m.FrequencyPattern,
                            MealTiming = m.MealTiming,
                            Duration = m.Duration,
                            DurationType = m.DurationType
                        }).ToList(),

                        LabTests = p.PrescriptionTemplateLabTests.Select(l => new TemplateLabTestDto
                        {
                            TestName = l.TestName,
                            Requirement = l.Requirement,
                            Category = l.Category
                        }).ToList()
                    })
                    .ToListAsync();
               

            return templates;
            }
            catch(Exception ex)
            {
                _logger.LogError(ex, "Error fetching prescription templates");
                throw;
            }
        }



    }
}
