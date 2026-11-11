using Microsoft.EntityFrameworkCore;
using Npgsql;

namespace SchoolAdmission.Data;

public static class DbErrors
{
    public static bool IsUniqueViolation(DbUpdateException ex, string? constraintName = null) =>
        ex.InnerException is PostgresException pg
        && pg.SqlState == PostgresErrorCodes.UniqueViolation
        && (constraintName is null || pg.ConstraintName == constraintName);
}
