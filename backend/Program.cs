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
    connectionString = builder.Configuration.GetConnectionString("DefaultConnection") 
        ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");

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
builder.Services.AddScoped<IAppointmentsService, AppointmentService>();
builder.Services.AddScoped<IDoctorService, DoctorService>(); // ? Add missing DoctorService
builder.Services.AddScoped<IPatientService, PatientService>();
builder.Services.AddScoped<IEmployeeService, EmployeeService>();
builder.Services.AddScoped<ISettingsService, SettingsService>();

var app = builder.Build();

//app.MapGet("/", () => "Hello world!");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseDefaultFiles();
app.UseStaticFiles();


app.UseCors("Frontend");
app.UseAuthorization();
app.MapControllers();
app.MapFallbackToFile("index.html");

app.Run();
