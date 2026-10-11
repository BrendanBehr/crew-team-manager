namespace CrewTeamManagerV2.Models
{
    public class Oar
    {
        public int Id { get; set; }
        public int? TeamId { get; set; }
        public string BladeColor { get; set; } = string.Empty;
        public string BladeShape { get; set; } = string.Empty;
        public string HandleType { get; set; } = string.Empty;
        public int Length { get; set; }
        public string Name { get; set; } = "HP";

        public string GetLength()
        {
            return $"{Length} cm";
        }
    }
}
