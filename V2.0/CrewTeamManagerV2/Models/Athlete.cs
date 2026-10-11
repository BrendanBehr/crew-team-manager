using System.ComponentModel.DataAnnotations;
using System.Security;

namespace CrewTeamManagerV2.Models
{
    public enum Side
    {
        Starboard,
        Port,
        Sculling
    }

    public enum Year
    {
        Freshman,
        Sophomore,
        Junior,
        Senior
    }

    public class Athlete : Person
    {
        public DateTime? ErgScore { get; set; }
        [DisplayFormat(NullDisplayText = "No side")]
        public Side? Side { get; set; }
        public int? WeightInPounds { get; set; }
        public Year? Year { get; set; }

        public void SetCaptain()
        {
            //Update perms/role
        }

        public void RemoveCaptian()
        {
            //Update perms/role
        }
    }
}
