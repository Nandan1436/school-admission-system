namespace SchoolAdmission.Data.Models;

public record ClassWithSeats(Guid Id, string Name, int TotalSeats, int HeldSeats, int ConfirmedSeats)
{
    public int AvailableSeats => TotalSeats - HeldSeats - ConfirmedSeats;
}
