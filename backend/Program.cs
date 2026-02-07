using backend.Data;
using backend.Services.Interfaces;
using backend.Services.Implementations;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// FORCE local connection string - Override any environment variables
string connectionString;
if (builder.Environment.IsDevelopment())
{
    // Force local connection for development
    connectionString = "Server=localhost\\SQLEXPRESS;Database=clinicalerp;Trusted_Connection=True;TrustServerCertificate=True;Connect Timeout=60";
    Console.WriteLine("?? FORCED Development connection string");
}
else
{
    // Use configuration for production
    connectionString = builder.Configuration.GetConnectionString("DefaultConnection") 
        ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
}

builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
        policy.WithOrigins("http://localhost:5173", "https://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod());
});

// Check what the configuration would have returned
var configConnectionString = builder.Configuration.GetConnectionString("DefaultConnection");
Console.WriteLine($"?? Configuration would return: {configConnectionString}");

builder.Services.AddDbContext<AppDbContext>(options => 
    options.UseSqlServer(connectionString));

// Register services
builder.Services.AddScoped<IMasterService, MasterService>();
builder.Services.AddScoped<IDashboardService, DashboardService>();
builder.Services.AddScoped<IAppointmentsService, AppointmentService>(); // ? Missing registration!
builder.Services.AddScoped<IPatientService, PatientService>();

var app = builder.Build();

app.MapGet("/", () => "Hello world!");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("Frontend");
app.UseAuthorization();
app.MapControllers();

app.Run();
