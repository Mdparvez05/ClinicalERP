using backend.Data;
using backend.Models;
using System.Text.Json;

public class ExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionMiddleware> _logger;
    private readonly IServiceScopeFactory _scopeFactory;

    public ExceptionMiddleware(
        RequestDelegate next,
        ILogger<ExceptionMiddleware> logger,
        IServiceScopeFactory scopeFactory)
    {
        _next = next;
        _logger = logger;
        _scopeFactory = scopeFactory;
    }

    public async Task Invoke(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unhandled Exception");

            int statusCode = StatusCodes.Status500InternalServerError;
            string message = "Something went wrong";

            if (ex is KeyNotFoundException)
            {
                statusCode = StatusCodes.Status404NotFound;
                message = ex.Message;
            }
            else if (ex is ArgumentException || ex is FormatException)
            {
                statusCode = StatusCodes.Status400BadRequest;
                message = ex.Message;
            }

            using var scope = _scopeFactory.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            var httpContext = context;
            var ip = httpContext.Connection.RemoteIpAddress?.ToString();
            var userName = httpContext.User?.Identity?.Name;
            var userId = httpContext.User?.FindFirst("sub")?.Value
                         ?? httpContext.User?.FindFirst("id")?.Value;
            var userAgent = httpContext.Request.Headers["User-Agent"].ToString();
            var currentUrl = httpContext.Request.Path;
            var previousUrl = httpContext.Request.Headers["Referer"].ToString();
            db.ErrorLogs.Add(new ErrorLog
            {
                Message = ex.Message,
                StackTrace = ex.StackTrace,
                Path = currentUrl,
                Method = httpContext.Request.Method,
                IPAddress = ip,
                UserName = userName,
                UserId = userId,
                UserAgent = userAgent,
                CurrentUrl = currentUrl,
                PreviousUrl = previousUrl,
                CreatedAt = DateTime.UtcNow
            });
            await db.SaveChangesAsync();
            context.Response.StatusCode = statusCode;
            context.Response.ContentType = "application/json";
            var response = new
            {
                success = false,
                message
            };
            await context.Response.WriteAsync(JsonSerializer.Serialize(response));
        }
    }
}