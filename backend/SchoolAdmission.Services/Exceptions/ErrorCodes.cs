namespace SchoolAdmission.Services.Exceptions;

public static class ErrorCodes
{
    public const string InvalidRequest = "INVALID_REQUEST";
    public const string InvalidStudentId = "INVALID_STUDENT_ID";
    public const string ClassNotFound = "CLASS_NOT_FOUND";
    public const string ClassNameTaken = "CLASS_NAME_TAKEN";
    public const string NoSeatsAvailable = "NO_SEATS_AVAILABLE";
    public const string AlreadyApplied = "ALREADY_APPLIED";
    public const string HoldNotFound = "HOLD_NOT_FOUND";
    public const string NotYourHold = "NOT_YOUR_HOLD";
    public const string HoldExpired = "HOLD_EXPIRED";
    public const string HoldCancelled = "HOLD_CANCELLED";
    public const string HoldAlreadyConfirmed = "HOLD_ALREADY_CONFIRMED";
}
