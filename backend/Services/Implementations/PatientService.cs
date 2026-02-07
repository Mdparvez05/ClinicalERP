using backend.Data;
using backend.DTOs.Patients;
using backend.Models;
using backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.Implementations
{
    public class PatientService : IPatientService
    {
        private readonly AppDbContext _context;
        private readonly ILogger<PatientService> _logger;

        public PatientService(AppDbContext context, ILogger<PatientService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<List<PatientListDto>> GetPatientsAsync()
        {
            try
            {
                var patients = await _context.Clients
                    .Where(c => c.IsActive)
                    .OrderBy(c => c.LastName)
                    .ThenBy(c => c.FirstName)
                    .Select(c => new PatientListDto
                    {
                        Id = c.Id,
                        FirstName = c.FirstName,
                        LastName = c.LastName,
                        FullName = c.FirstName + " " + c.LastName,
                        Gender = c.Gender,
                        DateOfBirth = c.DateOfBirth,
                        Email = c.Email,
                        Phone = c.Phone,
                        LastAppointmentDate = c.LastAppointmentDate,
                        MedicalRecordNumber = c.MedicalRecordNumber,
                        IsActive = c.IsActive
                    })
                    .ToListAsync();

                return patients;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving patients");
                throw;
            }
        }

        public async Task<PatientDetailDto?> GetPatientByIdAsync(int id)
        {
            try
            {
                return await _context.Clients
                    .Where(c => c.Id == id)
                    .Select(c => new PatientDetailDto
                    {
                        Id = c.Id,
                        FirstName = c.FirstName,
                        LastName = c.LastName,
                        FullName = c.FirstName + " " + c.LastName,
                        Gender = c.Gender,
                        DateOfBirth = c.DateOfBirth,
                        Email = c.Email,
                        Phone = c.Phone,
                        Phone2 = c.Phone2,
                        Address = c.Address,
                        Address2 = c.Address2,
                        City = c.City,
                        ZipCode = c.ZipCode,
                        Country = c.Country,
                        MedicalRecordNumber = c.MedicalRecordNumber,
                        LastAppointmentDate = c.LastAppointmentDate,
                        IsSubscribed = c.IsSubscribed,
                        IsActive = c.IsActive
                    })
                    .FirstOrDefaultAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving patient {PatientId}", id);
                throw;
            }
        }

        public async Task<List<PatientSearchDto>> SearchPatientsAsync(string term)
        {
            try
            {
                term = term.Trim();

                if (string.IsNullOrEmpty(term))
                {
                    return new List<PatientSearchDto>();
                }

                return await _context.Clients
                    .Where(c => c.IsActive
                                && (EF.Functions.Like(c.FirstName, $"%{term}%")
                                    || EF.Functions.Like(c.LastName, $"%{term}%")
                                    || EF.Functions.Like(c.Email, $"%{term}%")
                                    || EF.Functions.Like(c.MedicalRecordNumber, $"%{term}%")))
                    .OrderBy(c => c.LastName)
                    .ThenBy(c => c.FirstName)
                    .Select(c => new PatientSearchDto
                    {
                        Id = c.Id,
                        FirstName = c.FirstName,
                        LastName = c.LastName,
                        Email = c.Email,
                        MedicalRecordNumber = c.MedicalRecordNumber
                    })
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error searching patients with term: {SearchTerm}", term);
                throw;
            }
        }

        public async Task<PatientDetailDto> CreatePatientAsync(CreatePatientDto patientDto)
        {
            try
            {
                if (await _context.Clients.AnyAsync(c => c.MedicalRecordNumber == patientDto.MedicalRecordNumber))
                {
                    throw new InvalidOperationException("Medical record number already exists");
                }

                var employeeId = await GetDefaultEmployeeIdAsync();
                var now = DateTime.UtcNow;

                var patient = new Client
                {
                    FirstName = patientDto.FirstName.Trim(),
                    LastName = patientDto.LastName.Trim(),
                    Gender = patientDto.Gender,
                    DateOfBirth = patientDto.DateOfBirth,
                    Email = patientDto.Email.Trim(),
                    Phone = patientDto.Phone.Trim(),
                    Phone2 = string.IsNullOrWhiteSpace(patientDto.Phone2) ? null : patientDto.Phone2.Trim(),
                    Address = patientDto.Address.Trim(),
                    Address2 = string.IsNullOrWhiteSpace(patientDto.Address2) ? null : patientDto.Address2.Trim(),
                    City = patientDto.City.Trim(),
                    ZipCode = patientDto.ZipCode.Trim(),
                    Country = patientDto.Country.Trim(),
                    MedicalRecordNumber = patientDto.MedicalRecordNumber.Trim(),
                    LastAppointmentDate = patientDto.LastAppointmentDate ?? now,
                    IsSubscribed = patientDto.IsSubscribed,
                    IsActive = true,
                    CreatedBy = employeeId,
                    UpdatedBy = employeeId,
                    CreatedOn = now,
                    UpdatedOn = now
                };

                _context.Clients.Add(patient);
                await _context.SaveChangesAsync();

                return await GetPatientByIdAsync(patient.Id)
                       ?? throw new InvalidOperationException("Failed to retrieve created patient");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating patient");
                throw;
            }
        }

        public async Task<PatientDetailDto> UpdatePatientAsync(UpdatePatientDto patientDto)
        {
            try
            {
                var patient = await _context.Clients.FindAsync(patientDto.Id);
                if (patient == null)
                {
                    throw new ArgumentException($"Patient with ID {patientDto.Id} not found");
                }

                if (!string.IsNullOrWhiteSpace(patientDto.MedicalRecordNumber)
                    && patientDto.MedicalRecordNumber != patient.MedicalRecordNumber)
                {
                    var mrnExists = await _context.Clients.AnyAsync(c => c.MedicalRecordNumber == patientDto.MedicalRecordNumber);
                    if (mrnExists)
                    {
                        throw new InvalidOperationException("Medical record number already exists");
                    }

                    patient.MedicalRecordNumber = patientDto.MedicalRecordNumber.Trim();
                }

                if (!string.IsNullOrWhiteSpace(patientDto.FirstName))
                {
                    patient.FirstName = patientDto.FirstName.Trim();
                }

                if (!string.IsNullOrWhiteSpace(patientDto.LastName))
                {
                    patient.LastName = patientDto.LastName.Trim();
                }

                if (patientDto.Gender.HasValue)
                {
                    patient.Gender = patientDto.Gender.Value;
                }

                if (patientDto.DateOfBirth.HasValue)
                {
                    patient.DateOfBirth = patientDto.DateOfBirth.Value;
                }

                if (!string.IsNullOrWhiteSpace(patientDto.Email))
                {
                    patient.Email = patientDto.Email.Trim();
                }

                if (!string.IsNullOrWhiteSpace(patientDto.Phone))
                {
                    patient.Phone = patientDto.Phone.Trim();
                }

                if (patientDto.Phone2 != null)
                {
                    patient.Phone2 = string.IsNullOrWhiteSpace(patientDto.Phone2) ? null : patientDto.Phone2.Trim();
                }

                if (!string.IsNullOrWhiteSpace(patientDto.Address))
                {
                    patient.Address = patientDto.Address.Trim();
                }

                if (patientDto.Address2 != null)
                {
                    patient.Address2 = string.IsNullOrWhiteSpace(patientDto.Address2) ? null : patientDto.Address2.Trim();
                }

                if (!string.IsNullOrWhiteSpace(patientDto.City))
                {
                    patient.City = patientDto.City.Trim();
                }

                if (!string.IsNullOrWhiteSpace(patientDto.ZipCode))
                {
                    patient.ZipCode = patientDto.ZipCode.Trim();
                }

                if (!string.IsNullOrWhiteSpace(patientDto.Country))
                {
                    patient.Country = patientDto.Country.Trim();
                }

                if (patientDto.LastAppointmentDate.HasValue)
                {
                    patient.LastAppointmentDate = patientDto.LastAppointmentDate.Value;
                }

                if (patientDto.IsSubscribed.HasValue)
                {
                    patient.IsSubscribed = patientDto.IsSubscribed.Value;
                }

                if (patientDto.IsActive.HasValue)
                {
                    patient.IsActive = patientDto.IsActive.Value;
                }

                patient.UpdatedOn = DateTime.UtcNow;
                patient.UpdatedBy = await GetDefaultEmployeeIdAsync();

                await _context.SaveChangesAsync();

                return await GetPatientByIdAsync(patient.Id)
                       ?? throw new InvalidOperationException("Failed to retrieve updated patient");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating patient {PatientId}", patientDto.Id);
                throw;
            }
        }

        public async Task<bool> DeletePatientAsync(int id)
        {
            try
            {
                var patient = await _context.Clients.FindAsync(id);
                if (patient == null)
                {
                    return false;
                }

                patient.IsActive = false;
                patient.UpdatedOn = DateTime.UtcNow;
                patient.UpdatedBy = await GetDefaultEmployeeIdAsync();

                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting patient {PatientId}", id);
                throw;
            }
        }

        private async Task<int> GetDefaultEmployeeIdAsync()
        {
            var employeeId = await _context.Employees
                .Where(e => e.IsActive)
                .Select(e => e.Id)
                .FirstOrDefaultAsync();

            if (employeeId == 0)
            {
                throw new InvalidOperationException("No active employee available to assign patient audit fields");
            }

            return employeeId;
        }
    }
}
