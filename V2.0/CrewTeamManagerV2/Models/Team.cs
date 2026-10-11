using Microsoft.EntityFrameworkCore;

namespace CrewTeamManagerV2.Models
{
    public class Team
    {
        public int Id { get; set; }
        public string Name { get; set; } 
        public string PostalCode { get; set; }
        public string Country { get; set; }
        public string StreetAddress { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Color { get; set; }
        public string Logo { get; set; }
    }
}
