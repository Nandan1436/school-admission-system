namespace SchoolAdmission.Domain.Entities;

/// <summary>
/// A class for one shift, e.g. "Class 6 - Morning Shift", with a fixed number of seats.
/// </summary>
public class Class
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int TotalSeats { get; set; }
    public DateTime CreatedAt { get; set; }

    public ICollection<Hold> Holds { get; set; } = new List<Hold>();
}
