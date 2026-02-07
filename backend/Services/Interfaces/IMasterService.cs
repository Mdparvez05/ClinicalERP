using backend.Models;

namespace backend.Services.Interfaces
{
    public interface IMasterService
    {
        /// <summary>
        /// Retrieves all master data required for the application
        /// </summary>
        /// <returns>Master data object containing countries, currencies, and languages</returns>
        Task<object> GetMasterDataAsync();
        
        /// <summary>
        /// Retrieves list of countries
        /// </summary>
        /// <returns>List of countries</returns>
        Task<IEnumerable<string>> GetCountriesAsync();
        
        /// <summary>
        /// Retrieves list of currencies
        /// </summary>
        /// <returns>List of currencies</returns>
        Task<IEnumerable<string>> GetCurrenciesAsync();
        
        /// <summary>
        /// Retrieves list of languages
        /// </summary>
        /// <returns>List of languages</returns>
        Task<IEnumerable<string>> GetLanguagesAsync();

        /// <summary>
        /// Retrieves list of appointment types
        /// </summary>
        /// <returns>List of appointment types</returns>
        Task<IEnumerable<string>> GetAllAppointmentAsync();

        /// <summary>
        /// Retrieves list of genders
        /// </summary>
        /// <returns>List of genders</returns>
        Task<IEnumerable<string>> Getgenders();

        /// <summary>
        /// Retrieves list of departments
        /// </summary>
        /// <returns>List of departments</returns>
        Task<IEnumerable<string>> GetAllDepartments();

        /// <summary>
        /// Retrieves list of designations/positions
        /// </summary>
        /// <returns>List of designations</returns>
        Task<IEnumerable<string>> GetAllDesignations();

        /// <summary>
        /// Retrieves list of appointment statuses
        /// </summary>
        /// <returns>List of appointment statuses</returns>
        Task<IEnumerable<string>> GetAllAppointmentStatus();
    }
}