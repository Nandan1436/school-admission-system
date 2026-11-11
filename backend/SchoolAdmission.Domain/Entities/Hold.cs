using SchoolAdmission.Domain.Enums;

namespace SchoolAdmission.Domain.Entities;

/// <summary>
/// One admission application: a seat held for a student until <see cref="ExpiresAt"/>.
/// </summary>
public class Hold
{
    public Guid Id { get; set; }
    public Guid ClassId { get; set; }
    public string StudentId { get; set; } = string.Empty;
    public HoldStatus Status { get; set; }
    public DateTime ExpiresAt { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? ConfirmedAt { get; set; }
    public DateTime? CancelledAt { get; set; }

    public Class Class { get; set; } = null!;

    /// <summary>
    /// The status a client should see. A HELD row whose time has passed is EXPIRED,
    /// even if the background worker has not updated the row yet.
    /// </summary>
    public HoldStatus GetEffectiveStatus(DateTime utcNow) =>
        Status == HoldStatus.Held && ExpiresAt <= utcNow ? HoldStatus.Expired : Status;
}
