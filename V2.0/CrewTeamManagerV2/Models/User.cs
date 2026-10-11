namespace CrewTeamManagerV2.Models
{
    public abstract class User
    {
        public int Id { get; set; }
        public int? TeamId { get; set; }
        public string EmailAddress { get; set; } = string.Empty;
    }
}
