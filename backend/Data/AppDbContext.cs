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

    public virtual DbSet<SystemOption> SystemOptions { get; set; }

    public virtual DbSet<User> Users { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Appointment>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Appointm__3214EC07FC92753E");

            entity.HasOne(d => d.AssignedEmployee)
                .WithMany(p => p.AppointmentAssignedEmployees)
                .HasForeignKey(d => d.AssignedEmployeeId)
                .HasConstraintName("FK_Appointments_AssignedEmployee");

            entity.HasOne(d => d.Client)
                .WithMany(p => p.Appointments)
                .HasForeignKey(d => d.ClientId)
                .HasConstraintName("FK_Appointments_Client");

            entity.HasOne(d => d.Parent)
                .WithMany(p => p.InverseParent)
                .HasForeignKey(d => d.ParentId)
                .HasConstraintName("FK_Appointments_Parent");

            entity.HasOne(d => d.PrescribedByNavigation)
                .WithMany(p => p.AppointmentPrescribedByNavigations)
                .HasForeignKey(d => d.PrescribedBy)
                .HasConstraintName("FK_Appointments_PrescribedBy");
        });

        modelBuilder.Entity<Client>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Clients__3214EC077FD082F0");

            entity.Property(e => e.CreatedOn).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.IsActive).HasDefaultValue(true);

            entity.HasOne(d => d.CreatedByNavigation)
                .WithMany(p => p.ClientCreatedByNavigations)
                .HasForeignKey(d => d.CreatedBy)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Clients_CreatedBy");

            entity.HasOne(d => d.UpdatedByNavigation)
                .WithMany(p => p.ClientUpdatedByNavigations)
                .HasForeignKey(d => d.UpdatedBy)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Clients_UpdatedBy");
        });

        modelBuilder.Entity<Employee>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Employee__3214EC07341107A6");

            entity.Property(e => e.CreatedOn).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.UpdatedOn).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.CreatedByNavigation)
                .WithMany(p => p.InverseCreatedByNavigation)
                .HasForeignKey(d => d.CreatedBy)
                .HasConstraintName("FK_Employees_CreatedBy");

            entity.HasOne(d => d.UpdatedByNavigation)
                .WithMany(p => p.InverseUpdatedByNavigation)
                .HasForeignKey(d => d.UpdatedBy)
                .HasConstraintName("FK_Employees_UpdatedBy");
        });

        modelBuilder.Entity<EmployeeAdditional>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Employee__3214EC0768EF4247");

            entity.HasOne(d => d.Employee)
                .WithOne(p => p.EmployeeAdditional)
                .HasForeignKey<EmployeeAdditional>(d => d.EmployeeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_EmployeeAdditional_Employee");
        });

        modelBuilder.Entity<Models.File>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Files__3214EC076EEB23E0");

            entity.Property(e => e.UploadedOn).HasDefaultValueSql("(getutcdate())");

            entity.HasOne(d => d.UploadedByNavigation)
                .WithMany(p => p.Files)
                .HasForeignKey(d => d.UploadedBy)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Files_UploadedBy");
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

            entity.HasOne(d => d.Employee)
                .WithMany(p => p.Users)
                .HasForeignKey(d => d.EmployeeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Users_Employee");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
