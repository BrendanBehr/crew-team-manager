namespace CrewTeamManagerV2.Models
{
    public enum RiggerType
    {
        Wing,
        Euro

    }

    public enum Mount
    {
        Bow,
        Stern,
        Side
    }

    public enum Style
    {
        Sweep,
        Scull
    }


    public class Rigger
    {
        public int Id { get; set; }
        public Guid BoatId { get; set; }
        public RiggerType Type { get; set; }
        public Mount Mounted { get; set; }
        public Style Style { get; set; }
    }
}
