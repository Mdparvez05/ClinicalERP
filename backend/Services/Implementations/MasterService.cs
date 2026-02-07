using backend.Data;
using backend.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.Implementations
{
    public class MasterService : IMasterService
    {
        private readonly AppDbContext _context;
        private readonly ILogger<MasterService> _logger;

        public MasterService(AppDbContext context, ILogger<MasterService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<object> GetMasterDataAsync()
        {
            try
            {
                _logger.LogInformation("Fetching master data");

                // Removed Doctors from here since AppointmentService handles it better
                var masterData = new
                {
                    Countries = await GetCountriesAsync(),
                    Currencies = await GetCurrenciesAsync(),
                    Languages = await GetLanguagesAsync(),
                    AppointmentTypes = await GetAllAppointmentAsync(),
                    Genders = await Getgenders(),
                    Departments = await GetAllDepartments(),
                    Designations = await GetAllDesignations(),
                    AppointmentStatuses = await GetAllAppointmentStatus()
                };

                _logger.LogInformation("Successfully retrieved master data");
                return masterData;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while fetching master data");
                throw;
            }
        }

        public async Task<IEnumerable<string>> GetCountriesAsync()
        {
            try
            {
                // Fetch countries from SystemOptions table
                var result = await _context.SystemOptions
                    .Where(x => x.IsActive && x.Name == "Country")
                    .Select(x => x.Value)
                    .OrderBy(x => x)
                    .ToListAsync();
                
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while fetching countries");
                throw;
            }
        }

        public async Task<IEnumerable<string>> GetCurrenciesAsync()
        {
            try
            {
                // Business logic for currencies
                // This could involve validation, filtering based on user preferences, etc.
                
                await Task.Delay(1); // Simulate async operation
                return new[] { "USD", "CAD", "GBP", "INR", "AUD" };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while fetching currencies");
                throw;
            }
        }

        public async Task<IEnumerable<string>> GetLanguagesAsync()
        {
            try
            {
                // Business logic for languages
                // This could involve localization logic, user preference filtering, etc.
                
                await Task.Delay(1); // Simulate async operation
                return new[] { "English", "French", "Spanish", "Hindi", "German" };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while fetching languages");
                throw;
            }
        }

        public async Task<IEnumerable<string>> GetAllAppointmentAsync()
        {
            try
            {
                 var result = await _context.SystemOptions
                    .Where(x => x.IsActive && x.Name == "AppointmentType")
                    .Select(x => x.Value) .ToListAsync();
                return result;
            }
            catch(Exception ex)
            {
                _logger.LogError(ex, "Error occurred while fetching appointment types");
                throw;
            }
        }
        public async Task<IEnumerable<string>> Getgenders()
        {
            try
            {
                var result = await _context.SystemOptions
               .Where(x => x.Name == "Gender")
               .Select(x => x.Value).ToListAsync();
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while fetching genders");
                throw;
            }
        }
        public async Task<IEnumerable<string>> GetAllDepartments()
        {
            try
            {
                var result = await _context.SystemOptions
               .Where(x => x.Name == "Department")
               .Select(x => x.Value).ToListAsync();
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while fetching departments");
                throw;
            }
        }

        public async Task<IEnumerable<string>> GetAllDesignations()
        {
            try
            {
                var result = await _context.SystemOptions
               .Where(x => x.Name == "Position")
               .Select(x => x.Value).ToListAsync();
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while fetching designations");
                throw;
            }
        }
        public async Task<IEnumerable<string>> GetAllAppointmentStatus()
        {
            try
            {
                var result = await _context.SystemOptions
               .Where(x => x.Name == "AppointmentStatus")
               .Select(x => x.Value).ToListAsync();
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while fetching appointment statuses    ");
                throw;
            }
        }
    }
}