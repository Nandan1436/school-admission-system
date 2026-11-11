namespace SchoolAdmission.Services.Options;

public class HoldOptions
{
    public const int DefaultDurationSeconds = 600;

    public int DurationSeconds { get; set; } = DefaultDurationSeconds;
}
