namespace CrewTeamManagerV2.Models
{
    public enum Gender
    {
        Male,
        Female
    }

    public abstract class Person : User
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string StreetAddress { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string PostalCode { get; set; } = string.Empty;
        public string State { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string Country { get; set; } = string.Empty;
        public Gender? Gender { get; set; }
    }
}
