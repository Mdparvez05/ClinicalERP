using System.Net;
using System.Text.Json;

namespace backend.Middleware
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _logger;

        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                // 🔥 Log full error (for developers)
                _logger.LogError(ex, "Unhandled Exception");
                int statusCode = context.Response.StatusCode;
                string message = context.Response.ContentType;

                statusCode = (int)HttpStatusCode.InternalServerError;
                message = "application/json";
                if (ex is KeyNotFoundException)
                {
                    statusCode = StatusCodes.Status404NotFound;
                    message = "Resource not found";
                }
                // 🔥 Bad Request
                else if (ex is ArgumentException || ex is FormatException)
                {
                    statusCode = StatusCodes.Status400BadRequest;
                    message = "Invalid input";
                }
                var response = new
                {
                    success = false,
                    message = "Something went wrong. Please try again later."
                };

                var json = JsonSerializer.Serialize(response);

                await context.Response.WriteAsync(json);
            }
        }
    }
}
