namespace CrewTeamManagerV2.Models
{
    public enum Condition
    {
        BelowAverage,
        Average,
        AboveAverage
    }

    public enum ErgModel
    {
        C2Row,
        C2Bike,
        C2Ski,
        RP3
    }

    public class Erg
    {
        public int Id { get; set; }
        public int? TeamId { get; set; }
        public Condition Condition { get; set; }
        public string Location { get; set; }
        public ErgModel Model { get; set; }
        public int Number { get; set; }
        public string Screen { get; set; } = "PM5";
    }
}
