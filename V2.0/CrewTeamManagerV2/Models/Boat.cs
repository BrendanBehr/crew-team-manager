namespace CrewTeamManagerV2.Models
{
    public enum BoatType
    {
        Sweep,
        Scull
    }

    public enum  Rigging
    {
        Port,
        Starboard,
        Bucket
    }

    public class Boat
    {
        public int Id { get; set; }
        public int? TeamId { get; set; }
        public Guid BoatId { get; set; }
        public string Name { get; set; }
        public Rigging Rig { get; set; }
        public int Size { get; set; }
        public BoatType Type { get; set; }
        public string Manufacturer { get; set; }

        public List<Rigger> Riggers { get; set; }
    }
}
