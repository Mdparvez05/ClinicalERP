using System.Net.Http.Headers;
using System.Net.Http.Json;
using backend.Services.Interfaces;
namespace backend.Services.Implementations
{
    public class ChatService : IChatService
    {

        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;
        public ChatService(HttpClient httpClient , IConfiguration configuration)
        {
            _httpClient = httpClient;
            _configuration = configuration;



        }
        //public async Task<string> AskAI(string message)
        //{
        //    return "Hello from AI";
        //}
        public async Task<string> AskOpenAI(string message)
        {
            var apiKey = _configuration["OpenAI:ApiKey"];

            _httpClient.DefaultRequestHeaders.Clear();

            _httpClient.DefaultRequestHeaders.Add(
                "Authorization",
                $"Bearer {apiKey}");

            var requestBody = new
            {
                model = "gpt-4.1-mini",
                messages = new[]
                {
            new
            {
                role = "system",
                content = "You are a clinic ERP assistant."
            },
            new
            {
                role = "user",
                content = message
            }
        }
            };

            var response = await _httpClient.PostAsJsonAsync(
                "https://api.openai.com/v1/chat/completions",
                requestBody);

            var result = await response.Content.ReadAsStringAsync();

            return result;
        }
        public async Task<string> AskAI(string message)
        {
            var apiKey = _configuration["Gemini:ApiKey"];

            var url =
                $"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={apiKey}";

            var requestBody = new
            {
                contents = new[]
                {
            new
            {
                parts = new[]
                {
                    new
                    {
                        text = message
                    }
                }
            }
        }
            };

            var response = await _httpClient.PostAsJsonAsync(url, requestBody);

            var result = await response.Content.ReadAsStringAsync();

            return result;
        }
    }
}
