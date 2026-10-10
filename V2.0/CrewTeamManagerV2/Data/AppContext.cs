using CrewTeamManagerV2.Models;
using Microsoft.EntityFrameworkCore;

namespace CrewTeamManagerV2.Data
{
    public class AppContext : DbContext
    {
        public AppContext(DbContextOptions<AppContext> options) : base(options)
        {
        }

        public DbSet<Team> Teams { get; set; }
    }
}
