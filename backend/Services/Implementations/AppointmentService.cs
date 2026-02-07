using backend.Data;
using backend.DTOs.Appointments;
using backend.Services.Interfaces;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace backend.Services.Implementations
{
    public class AppointmentService : IAppointmentsService
    {
        private readonly AppDbContext _context;
        private readonly ILogger<AppointmentService> _logger;

        public AppointmentService(AppDbContext context, ILogger<AppointmentService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<AppointmentDetailDto> CreateAppointmentAsync(CreateAppointmentDto appointmentDto)
        {
            try
            {
                _logger.LogInformation("Creating new appointment for Client: {ClientName}", appointmentDto.ClientName);

                // Create appointment - much simpler now with denormalized fields
                var appointment = new Appointment
                {
                    ClientId = appointmentDto.ClientId,
                    ClientName = appointmentDto.ClientName,  // Store denormalized
                    AssignedEmployeeId = appointmentDto.AssignedEmployeeId,
                    AssignedEmployeeName = appointmentDto.AssignedEmployeeName,  // Store denormalized
                    PrescribedBy = appointmentDto.PrescribedBy,
                    ScheduledOn = appointmentDto.ScheduledOn,
                    Type = appointmentDto.Type,
                    AppointmentStatus = appointmentDto.AppointmentStatus,  // Direct string value
                    Name = appointmentDto.Name,
                    Description = appointmentDto.Description,
                    Notes = appointmentDto.Notes,
                    ParentId = appointmentDto.ParentId
                };

                _context.Appointments.Add(appointment);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Successfully created appointment with ID: {AppointmentId}", appointment.Id);

                // Return the created appointment
                return await GetAppointmentByIdAsync(appointment.Id) 
                       ?? throw new InvalidOperationException("Failed to retrieve created appointment");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while creating appointment");
                throw;
            }
        }

        public async Task<AppointmentDetailDto?> GetAppointmentByIdAsync(int id)
        {
            try
            {
                _logger.LogInformation("Fetching appointment with ID: {AppointmentId}", id);

                // Much simpler query - no complex joins needed
                var appointment = await _context.Appointments
                    .Where(a => a.Id == id)
                    .Select(a => new AppointmentDetailDto
                    {
                        Id = a.Id,
                        Name = a.Name,
                        Description = a.Description,
                        ScheduledOn = a.ScheduledOn,
                        ClosedOn = a.ClosedOn,
                        Notes = a.Notes,
                        Type = a.Type,
                        AppointmentStatus = a.AppointmentStatus,  // Direct field
                        ClientId = a.ClientId,
                        ClientName = a.ClientName,  // Direct denormalized field
                        AssignedEmployeeId = a.AssignedEmployeeId,
                        AssignedEmployeeName = a.AssignedEmployeeName,  // Direct denormalized field
                        PrescribedBy = a.PrescribedBy,
                        ParentId = a.ParentId
                    })
                    .FirstOrDefaultAsync();

                // Optionally fetch additional data from related tables if needed
                if (appointment != null)
                {
                    // Get client details if needed
                    if (appointment.ClientId.HasValue)
                    {
                        var client = await _context.Clients.FindAsync(appointment.ClientId.Value);
                        if (client != null)
                        {
                            appointment.ClientPhone = client.Phone;
                            appointment.ClientEmail = client.Email;
                        }
                    }

                    // Get prescriber name if needed
                    if (appointment.PrescribedBy.HasValue)
                    {
                        var prescriber = await _context.Employees.FindAsync(appointment.PrescribedBy.Value);
                        if (prescriber != null)
                        {
                            appointment.PrescribedByName = $"{prescriber.FirstName} {prescriber.LastName}";
                        }
                    }

                    _logger.LogInformation("Successfully retrieved appointment with ID: {AppointmentId}", id);
                }
                else
                {
                    _logger.LogWarning("Appointment with ID: {AppointmentId} not found", id);
                }

                return appointment;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while fetching appointment with ID: {AppointmentId}", id);
                throw;
            }
        }

        public async Task<List<AppointmentDetailDto>> GetAppointmentsAsync(int? clientId = null, int? employeeId = null, 
            string? status = null, DateTime? dateFrom = null, DateTime? dateTo = null)
        {
            try
            {
                _logger.LogInformation("Fetching appointments with filters");

                var query = _context.Appointments.AsQueryable();

                // Apply filters
                if (clientId.HasValue)
                    query = query.Where(a => a.ClientId == clientId.Value);

                if (employeeId.HasValue)
                    query = query.Where(a => a.AssignedEmployeeId == employeeId.Value);

                if (!string.IsNullOrEmpty(status))
                    query = query.Where(a => a.AppointmentStatus == status);

                if (dateFrom.HasValue)
                    query = query.Where(a => a.ScheduledOn >= dateFrom.Value);

                if (dateTo.HasValue)
                    query = query.Where(a => a.ScheduledOn <= dateTo.Value);

                var appointments = await query
                    .Select(a => new AppointmentDetailDto
                    {
                        Id = a.Id,
                        Name = a.Name,
                        Description = a.Description,
                        ScheduledOn = a.ScheduledOn,
                        ClosedOn = a.ClosedOn,
                        Notes = a.Notes,
                        Type = a.Type,
                        AppointmentStatus = a.AppointmentStatus,
                        ClientId = a.ClientId,
                        ClientName = a.ClientName,
                        AssignedEmployeeId = a.AssignedEmployeeId,
                        AssignedEmployeeName = a.AssignedEmployeeName,
                        PrescribedBy = a.PrescribedBy,
                        ParentId = a.ParentId
                    })
                    .OrderBy(a => a.ScheduledOn)
                    .ToListAsync();

                _logger.LogInformation("Successfully retrieved {Count} appointments", appointments.Count);
                return appointments;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while fetching appointments");
                throw;
            }
        }

        public async Task<AppointmentDetailDto> UpdateAppointmentAsync(UpdateAppointmentDto appointmentDto)
        {
            try
            {
                _logger.LogInformation("Updating appointment with ID: {AppointmentId}", appointmentDto.Id);

                var appointment = await _context.Appointments.FindAsync(appointmentDto.Id);
                if (appointment == null)
                {
                    throw new ArgumentException($"Appointment with ID {appointmentDto.Id} not found");
                }

                // Update fields
                if (appointmentDto.ClientId.HasValue)
                    appointment.ClientId = appointmentDto.ClientId.Value;
                
                if (!string.IsNullOrEmpty(appointmentDto.ClientName))
                    appointment.ClientName = appointmentDto.ClientName;
                
                if (appointmentDto.AssignedEmployeeId.HasValue)
                    appointment.AssignedEmployeeId = appointmentDto.AssignedEmployeeId.Value;
                
                if (!string.IsNullOrEmpty(appointmentDto.AssignedEmployeeName))
                    appointment.AssignedEmployeeName = appointmentDto.AssignedEmployeeName;
                
                if (appointmentDto.PrescribedBy.HasValue)
                    appointment.PrescribedBy = appointmentDto.PrescribedBy.Value;
                
                if (appointmentDto.ScheduledOn.HasValue)
                    appointment.ScheduledOn = appointmentDto.ScheduledOn.Value;
                
                if (!string.IsNullOrEmpty(appointmentDto.Type))
                    appointment.Type = appointmentDto.Type;
                
                if (!string.IsNullOrEmpty(appointmentDto.AppointmentStatus))
                    appointment.AppointmentStatus = appointmentDto.AppointmentStatus;
                
                if (!string.IsNullOrEmpty(appointmentDto.Name))
                    appointment.Name = appointmentDto.Name;
                
                if (!string.IsNullOrEmpty(appointmentDto.Description))
                    appointment.Description = appointmentDto.Description;
                
                if (!string.IsNullOrEmpty(appointmentDto.Notes))
                    appointment.Notes = appointmentDto.Notes;
                
                if (appointmentDto.ClosedOn.HasValue)
                    appointment.ClosedOn = appointmentDto.ClosedOn.Value;

                if (appointmentDto.ParentId.HasValue)
                    appointment.ParentId = appointmentDto.ParentId.Value;

                await _context.SaveChangesAsync();
                
                _logger.LogInformation("Successfully updated appointment with ID: {AppointmentId}", appointmentDto.Id);
                
                return await GetAppointmentByIdAsync(appointmentDto.Id) 
                       ?? throw new InvalidOperationException("Failed to retrieve updated appointment");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while updating appointment with ID: {AppointmentId}", appointmentDto.Id);
                throw;
            }
        }

        public async Task<bool> CancelAppointmentAsync(int id)
        {
            try
            {
                _logger.LogInformation("Cancelling appointment with ID: {AppointmentId}", id);

                var appointment = await _context.Appointments.FindAsync(id);
                if (appointment == null)
                {
                    _logger.LogWarning("Appointment with ID: {AppointmentId} not found for cancellation", id);
                    return false;
                }

                appointment.AppointmentStatus = "Cancelled";  // Simple string assignment
                appointment.ClosedOn = DateTime.Now;

                await _context.SaveChangesAsync();
                
                _logger.LogInformation("Successfully cancelled appointment with ID: {AppointmentId}", id);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while cancelling appointment with ID: {AppointmentId}", id);
                throw;
            }
        }

        public async Task<bool> CompleteAppointmentAsync(int id)
        {
            try
            {
                _logger.LogInformation("Completing appointment with ID: {AppointmentId}", id);

                var appointment = await _context.Appointments.FindAsync(id);
                if (appointment == null)
                {
                    _logger.LogWarning("Appointment with ID: {AppointmentId} not found for completion", id);
                    return false;
                }

                appointment.AppointmentStatus = "Completed";  // Simple string assignment
                appointment.ClosedOn = DateTime.Now;

                await _context.SaveChangesAsync();
                
                _logger.LogInformation("Successfully completed appointment with ID: {AppointmentId}", id);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while completing appointment with ID: {AppointmentId}", id);
                throw;
            }
        }

        public async Task<List<DoctorDto>> GetAllDoctorsAsync()
        {
            try
            {
                _logger.LogInformation("Fetching all active doctors/employees");

                var doctors = await _context.Employees
                    .Where(e => e.IsActive)
                    .Select(e => new DoctorDto
                    {
                        Id = e.Id,                                    // ← Essential for AssignedEmployeeId
                        FirstName = e.FirstName,
                        LastName = e.LastName,
                        FullName = e.FirstName + " " + e.LastName,   // ← Essential for AssignedEmployeeName
                        Email = e.Email,
                        Phone = e.Phone,
                        IsActive = e.IsActive
                    })
                    .OrderBy(d => d.LastName)
                    .ThenBy(d => d.FirstName)
                    .ToListAsync();

                _logger.LogInformation("Successfully retrieved {Count} doctors", doctors.Count);
                return doctors;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while fetching doctors");
                throw;
            }
        }

        public async Task<List<AppointmentDetailDto>> GetAppointmentsByDateAsync(DateTime date)
        {
            try
            {
                _logger.LogInformation("Fetching appointments for date: {Date}", date.ToString("yyyy-MM-dd"));
                
                var startOfDay = date.Date;
                var endOfDay = startOfDay.AddDays(1);

                return await GetAppointmentsAsync(
                    dateFrom: startOfDay, 
                    dateTo: endOfDay);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while fetching appointments for date: {Date}", date);
                throw;
            }
        }

        public async Task<bool> IsTimeSlotAvailableAsync(int employeeId, DateTime scheduledTime)
        {
            try
            {
                _logger.LogInformation("Checking time slot availability for Employee ID: {EmployeeId} at {ScheduledTime}", 
                    employeeId, scheduledTime);

                // Check for appointments within 30 minutes of the requested time
                var conflictStart = scheduledTime.AddMinutes(-30);
                var conflictEnd = scheduledTime.AddMinutes(30);

                var hasConflict = await _context.Appointments
                    .AnyAsync(a => a.AssignedEmployeeId == employeeId
                                && a.ScheduledOn.HasValue
                                && a.ScheduledOn.Value >= conflictStart
                                && a.ScheduledOn.Value <= conflictEnd
                                && a.AppointmentStatus != "Cancelled"); // String comparison

                var isAvailable = !hasConflict;
                
                _logger.LogInformation("Time slot availability check result: {IsAvailable}", isAvailable);
                return isAvailable;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while checking time slot availability");
                throw;
            }
        }
    }
}
