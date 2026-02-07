using backend.Data;
using backend.Services.Interfaces;
using backend.DTOs.Dashboard;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;
using backend.Models;

namespace backend.Services.Implementations
{
    public class DashboardService : IDashboardService
    {
        private readonly AppDbContext _context;
        private readonly ILogger<DashboardService> _logger;
        private readonly IConfiguration _configuration;

        public DashboardService(AppDbContext context, ILogger<DashboardService> logger, IConfiguration configuration)
        {
            _context = context;
            _logger = logger;
            _configuration = configuration;
        }

        public async Task<TodayAppointmentsDto> GetTodayAppointmentsAsync()
        {
            try
            {
                _logger.LogInformation("Fetching today's appointments");

                var today = DateTime.Today;
                var tomorrow = today.AddDays(1);

                // Much simpler now - no complex joins needed!
                var appointments = await _context.Appointments
                    .Where(a => a.ScheduledOn.HasValue
                                && a.ScheduledOn.Value >= today
                                && a.ScheduledOn.Value < tomorrow)
                    .Select(a => new AppointmentDto
                    {
                        Id = a.Id,
                        ClientId = a.ClientId,
                        ClientName = a.ClientName,  // Direct from denormalized field
                        EmployeeName = a.AssignedEmployeeName,  // Direct from denormalized field  
                        ScheduledOn = a.ScheduledOn,
                        AppointmentStatus = a.AppointmentStatus,  // Direct VARCHAR field - no joins!
                        AppointmentType = a.Type,  // Direct VARCHAR field - no joins needed!
                        AssignedEmployeeId = a.AssignedEmployeeId,
                        Name = a.Name,
                        Description = a.Description,
                        Notes = a.Notes
                    })
                    .OrderBy(a => a.ScheduledOn)
                    .ToListAsync();

                _logger.LogInformation("Successfully retrieved {Count} appointments for today", appointments.Count);

                return new TodayAppointmentsDto
                {
                    Date = today,
                    TotalAppointments = appointments.Count,
                    Appointments = appointments
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while fetching today's appointments");
                throw;
            }
        }

        public async Task<int> GetTotalClientsAsync()
        {
            try
            {
                _logger.LogInformation("Fetching total number of clients");
                var totalClients = await _context.Clients.CountAsync();
                _logger.LogInformation("Successfully retrieved total clients: {TotalClients}", totalClients);
                return totalClients;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while fetching total clients");
                throw;
            }
        }

        public async Task<int> GetPendingLabTests()
        {
            try
            {
                _logger.LogInformation("Fetching pending lab tests count");
                
                // Now using string comparison for both Type and Status
                var count = await _context.Appointments
                    .Where(a => a.Type == "Lab Test" && a.AppointmentStatus == "Scheduled")  // Both string comparisons
                    .CountAsync();
                    
                _logger.LogInformation("Successfully retrieved pending lab tests count: {Count}", count);
                return count;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while fetching pending lab tests");
                throw;
            }
        }

        public async Task<List<AppointmentDto>> GetTotalAppointmentsAsync()
        {
            try
            {
                _logger.LogInformation("Fetching all appointments with full details");
                
                // Much simpler now - no complex joins needed!
                var totalAppointments = await _context.Appointments
                    .Select(a => new AppointmentDto
                    {
                        Id = a.Id,
                        ClientId = a.ClientId,
                        ClientName = a.ClientName,  // Direct from denormalized field
                        ScheduledOn = a.ScheduledOn,
                        EmployeeName = a.AssignedEmployeeName,  // Direct from denormalized field
                        AppointmentStatus = a.AppointmentStatus,  // Direct VARCHAR field
                        AppointmentType = a.Type,  // Direct VARCHAR field - no joins needed!
                        AssignedEmployeeId = a.AssignedEmployeeId,
                        Name = a.Name,
                        Description = a.Description,
                        Notes = a.Notes
                    })
                    .OrderBy(a => a.ScheduledOn)
                    .ToListAsync();
                
                _logger.LogInformation("Successfully retrieved {Count} total appointments", totalAppointments.Count);
                return totalAppointments;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while fetching total appointments");
                throw;
            }
        }

        /// <summary>
        /// Gets the current connection string being used
        /// </summary>
        public string GetCurrentConnectionString()
        {
            try
            {
                var connectionString = _configuration.GetConnectionString("DefaultConnection");
                _logger.LogInformation("Current connection string retrieved");
                return connectionString ?? "Connection string not found";
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving connection string");
                return "Error retrieving connection string";
            }
        }
    }
}
