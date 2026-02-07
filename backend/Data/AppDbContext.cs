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

    public virtual DbSet<backend.Models.File> Files { get; set; }

    public virtual DbSet<User> Users { get; set; }
    public virtual DbSet<SystemOption> SystemOptions { get; set; }


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Appointment>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Appointm__3214EC0770750322");

            entity.HasOne(d => d.AssignedEmployee).WithMany(p => p.AppointmentAssignedEmployees)
                .OnDelete(DeleteBehavior.SetNull)  // Changed to SetNull since FK is nullable
                .HasConstraintName("FK_Appointments_AssignedEmployee");

            entity.HasOne(d => d.Client).WithMany(p => p.Appointments)
                .OnDelete(DeleteBehavior.SetNull)  // Changed to SetNull since FK is nullable
                .HasConstraintName("FK_Appointments_Client");

            entity.HasOne(d => d.PrescribedByNavigation).WithMany(p => p.AppointmentPrescribedByNavigations)
                .HasConstraintName("FK_Appointments_PrescribedBy");

            entity.HasOne(d => d.ParentAppointment).WithMany(p => p.InverseParentAppointments)
                .HasConstraintName("FK_Appointments_Parent");
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

        modelBuilder.Entity<backend.Models.File>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Files__3214EC076EEB23E0");

            entity.Property(e => e.UploadedOn).HasDefaultValueSql("(getutcdate())");

            entity.HasOne(d => d.UploadedByNavigation).WithMany(p => p.Files)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Files_UploadedBy");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Users__3214EC07E201C55B");

            entity.HasOne(d => d.Employee).WithMany(p => p.Users)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Users_Employee");
        });
        modelBuilder.Entity<SystemOption>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__SystemOp__3214EC07DF4BB94E");

            entity.Property(e => e.CreatedOn)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Description)
                .HasMaxLength(255)
                .IsUnicode(false);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.Module)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.Notes).IsUnicode(false);
            entity.Property(e => e.Type)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.UpdatedOn).HasColumnType("datetime");
            entity.Property(e => e.Value)
                .HasMaxLength(100)
                .IsUnicode(false);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
