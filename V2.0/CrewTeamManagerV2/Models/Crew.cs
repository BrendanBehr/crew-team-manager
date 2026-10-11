namespace CrewTeamManagerV2.Models
{
    public class Crew
    {
        public int? Id { get; set; }
        public Boat Shell { get; set; }
        public List<Athlete> Athletes { get; set; }
        public Athlete Coxswain { get; set; }
        public List<Oar> Oars { get; set; }
    }
}
