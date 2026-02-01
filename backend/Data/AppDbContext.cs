using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data
{
    public class AppDbContext: DbContext
    {

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Client> Clients { get; set; }
        public DbSet<Employee> Employees { get; set; }
        public DbSet<EmployeeAdditional> EmployeeAdditionals { get; set; }  
        public DbSet<Files> Files { get; set; } 
        public DbSet<Users> Users { get; set; } 
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Appointments>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).HasMaxLength(100);
                entity.Property(e => e.Description).HasMaxLength(100);
            });
            modelBuilder.Entity<Client>(entity =>
           { 
               entity.HasKey(e => e.Id);
               entity.Property(e => e.FirstName).IsRequired().HasMaxLength(100);
               entity.Property(e => e.LastName).IsRequired().HasMaxLength(100);
               entity.Property(e => e.Email).IsRequired().HasMaxLength(255);
               entity.Property(e => e.Phone).HasMaxLength(20);
               entity.Property(e => e.Address).HasMaxLength(500);
               entity.Property(e => e.Address2).HasMaxLength(500);
               entity.Property(e => e.City).HasMaxLength(100);
               entity.Property(e => e.ZipCode).HasMaxLength(20);
               entity.Property(e => e.Country).HasMaxLength(100);
               entity.Property(e => e.Phone).HasMaxLength(20);
               entity.Property(e => e.Phone2).HasMaxLength(20);
               entity.Property(e => e.MedicalRecordNumber).HasMaxLength(50);
               entity.Property(e => e.CreatedBy).IsRequired().HasMaxLength(100);
               entity.Property(e => e.UpdatedBy).HasMaxLength(100);

           });
            modelBuilder.Entity<Employee>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.FirstName).IsRequired().HasMaxLength(100);
                entity.Property(e => e.LastName).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Email).IsRequired().HasMaxLength(255);
                entity.Property(e => e.Phone).HasMaxLength(20);
                entity.Property(e => e.Address).HasMaxLength(500);
                entity.Property(e => e.Position).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Department).IsRequired().HasMaxLength(100);
                entity.Property(e => e.HireDate).IsRequired();
                entity.Property(e => e.CreatedBy).IsRequired().HasMaxLength(100);
                entity.Property(e => e.UpdatedBy).HasMaxLength(100);
            });
            modelBuilder.Entity<EmployeeAdditional>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.HighestQualification).IsRequired().HasMaxLength(255);
                entity.Property(e => e.BankName).IsRequired().HasMaxLength(100);
                entity.Property(e => e.BankBranch).IsRequired().HasMaxLength(100);
                entity.Property(e => e.BankAccountNumber).IsRequired().HasMaxLength(50);
                entity.Property(e => e.BankIFSC).IsRequired().HasMaxLength(20);
            }); 
            modelBuilder.Entity<Files>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Source).IsRequired();
                entity.Property(e => e.SubSource).IsRequired();
                entity.Property(e => e.FileName).IsRequired().HasMaxLength(255);
                entity.Property(e => e.FileType).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Data).IsRequired();
                entity.Property(e => e.TransactionId).IsRequired();
                entity.Property(e => e.UploadedOn).IsRequired();
                entity.Property(e => e.UploadedBy).IsRequired();
            });
            modelBuilder.Entity<Users>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.UserName).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Password).IsRequired().HasMaxLength(255);
                entity.Property(e => e.EmployeeId).IsRequired();
            });

        }

        
    }
}
