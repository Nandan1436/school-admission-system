namespace SchoolAdmission.Services.Dtos;

public record CreateClassRequest(string? Name, int TotalSeats);

public record CreateClassResponse(Guid Id, string Name, int TotalSeats);

public record ClassResponse(
    Guid Id,
    string Name,
    int TotalSeats,
    int HeldSeats,
    int ConfirmedSeats,
    int AvailableSeats);
