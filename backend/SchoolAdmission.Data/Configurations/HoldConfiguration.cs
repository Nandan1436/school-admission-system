using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SchoolAdmission.Domain.Entities;
using SchoolAdmission.Domain.Enums;

namespace SchoolAdmission.Data.Configurations;

public class HoldConfiguration : IEntityTypeConfiguration<Hold>
{
    public void Configure(EntityTypeBuilder<Hold> builder)
    {
        builder.ToTable("hold");

        builder.HasKey(h => h.Id);

        builder.Property(h => h.StudentId)
            .HasMaxLength(17)
            .IsRequired();

        builder.Property(h => h.Status)
            .HasConversion(
                status => status.ToString().ToUpper(),
                value => Enum.Parse<HoldStatus>(value, true))
            .HasMaxLength(20)
            .IsRequired();

        builder.Property(h => h.ExpiresAt).IsRequired();
        builder.Property(h => h.CreatedAt).IsRequired();

        builder.HasOne(h => h.Class)
            .WithMany(c => c.Holds)
            .HasForeignKey(h => h.ClassId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(h => new { h.ClassId, h.Status, h.ExpiresAt })
            .HasDatabaseName("ix_hold_class_id_status_expires_at");

        builder.HasIndex(h => h.StudentId)
            .HasDatabaseName("ix_hold_student_id");

        builder.HasIndex(h => new { h.ClassId, h.StudentId })
            .IsUnique()
            .HasFilter("status IN ('HELD', 'CONFIRMED')")
            .HasDatabaseName("ux_hold_active_student_class");
    }
}
