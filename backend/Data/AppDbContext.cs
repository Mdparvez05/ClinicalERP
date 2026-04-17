using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Data;

public partial class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Appointment> Appointments { get; set; }

    public virtual DbSet<Client> Clients { get; set; }

    public virtual DbSet<Employee> Employees { get; set; }

    public virtual DbSet<EmployeeAdditional> EmployeeAdditionals { get; set; }

    public virtual DbSet<Models.File> Files { get; set; }

    public virtual DbSet<Prescription> Prescriptions { get; set; }

    public virtual DbSet<PrescriptionLabTest> PrescriptionLabTests { get; set; }

    public virtual DbSet<PrescriptionMedicine> PrescriptionMedicines { get; set; }

    public virtual DbSet<PrescriptionTemplate> PrescriptionTemplates { get; set; }

    public virtual DbSet<PrescriptionTemplateLabTest> PrescriptionTemplateLabTests { get; set; }

    public virtual DbSet<PrescriptionTemplateMedicine> PrescriptionTemplateMedicines { get; set; }

    public virtual DbSet<SystemOption> SystemOptions { get; set; }

    public virtual DbSet<User> Users { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Appointment>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Appointm__3214EC07FC92753E");

            entity.HasOne(d => d.AssignedEmployee).WithMany(p => p.AppointmentAssignedEmployees).HasConstraintName("FK_Appointments_AssignedEmployee");

            entity.HasOne(d => d.Client).WithMany(p => p.Appointments).HasConstraintName("FK_Appointments_Client");

            entity.HasOne(d => d.Parent).WithMany(p => p.InverseParent).HasConstraintName("FK_Appointments_Parent");

            entity.HasOne(d => d.PrescribedByNavigation).WithMany(p => p.AppointmentPrescribedByNavigations).HasConstraintName("FK_Appointments_PrescribedBy");
        });

        modelBuilder.Entity<Client>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Clients__3214EC077FD082F0");

            entity.Property(e => e.CreatedOn).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.IsActive).HasDefaultValue(true);

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.ClientCreatedByNavigations)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Clients_CreatedBy");

            entity.HasOne(d => d.UpdatedByNavigation).WithMany(p => p.ClientUpdatedByNavigations)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Clients_UpdatedBy");
        });

        modelBuilder.Entity<Employee>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Employee__3214EC07341107A6");

            entity.Property(e => e.CreatedOn).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.UpdatedOn).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.InverseCreatedByNavigation).HasConstraintName("FK_Employees_CreatedBy");

            entity.HasOne(d => d.UpdatedByNavigation).WithMany(p => p.InverseUpdatedByNavigation).HasConstraintName("FK_Employees_UpdatedBy");
        });

        modelBuilder.Entity<EmployeeAdditional>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Employee__3214EC0768EF4247");

            entity.HasOne(d => d.Employee).WithOne(p => p.EmployeeAdditional)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_EmployeeAdditional_Employee");
        });

        modelBuilder.Entity<Models.File>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Files__3214EC076EEB23E0");

            entity.Property(e => e.UploadedOn).HasDefaultValueSql("(getutcdate())");

            entity.HasOne(d => d.UploadedByNavigation).WithMany(p => p.Files)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Files_UploadedBy");
        });

        modelBuilder.Entity<Prescription>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Prescrip__3214EC07BF5EBF0E");

            entity.Property(e => e.CreatedOn).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.IsSent).HasDefaultValue(false);
        });

        modelBuilder.Entity<PrescriptionLabTest>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Prescrip__3214EC078243F3D6");

            entity.HasOne(d => d.Prescription).WithMany(p => p.PrescriptionLabTests)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Prescript__Presc__236943A5");
        });

        modelBuilder.Entity<PrescriptionMedicine>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Prescrip__3214EC07A8D2AC4E");

            entity.HasOne(d => d.Prescription).WithMany(p => p.PrescriptionMedicines)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Prescript__Presc__208CD6FA");
        });

        modelBuilder.Entity<PrescriptionTemplate>(entity =>
        {
            entity.HasKey(e => e.TemplateId).HasName("PK__Prescrip__F87ADD270A09276C");

            entity.Property(e => e.CreatedOn).HasDefaultValueSql("(getdate())");
        });

        modelBuilder.Entity<PrescriptionTemplateLabTest>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Prescrip__3214EC072D837A06");

            entity.HasOne(d => d.Template).WithMany(p => p.PrescriptionTemplateLabTests)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Prescript__Templ__2DE6D218");
        });

        modelBuilder.Entity<PrescriptionTemplateMedicine>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Prescrip__3214EC07216BF8C4");

            entity.HasOne(d => d.Template).WithMany(p => p.PrescriptionTemplateMedicines)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Prescript__Templ__2B0A656D");
        });

        modelBuilder.Entity<SystemOption>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__SystemOp__3214EC07DF4BB94E");

            entity.Property(e => e.CreatedOn).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.IsActive).HasDefaultValue(true);
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Users__3214EC07E201C55B");

            entity.HasOne(d => d.Employee).WithMany(p => p.Users)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Users_Employee");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
