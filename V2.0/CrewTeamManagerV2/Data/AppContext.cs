using CrewTeamManagerV2.Models;
using Microsoft.EntityFrameworkCore;

namespace CrewTeamManagerV2.Data
{
    public class AppContext : DbContext
    {
        public AppContext(DbContextOptions<AppContext> options) : base(options)
        {

        }

        string[] tables = { "Teams", "Oars", "Athletes", "Coaches", "Boats", "Riggers", "Ergs", "Crews" };

        public bool IsDatabaseCreated()
        {
            var tableNames = Model.GetEntityTypes()
                .Select(t => t.GetTableName())
                .Where(t => !string.IsNullOrEmpty(t))
                .Cast<string>();


            return tables.Any( t => !tableNames.Contains(t));
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            // Configure the relationships and constraints here if needed

            modelBuilder.Entity<Team>()
                .UseTpcMappingStrategy()
                .ToTable("Teams");

            modelBuilder.Entity<Oar>()
                .UseTpcMappingStrategy()
                .ToTable("Oars");

            modelBuilder.Entity<Athlete>()
                .UseTpcMappingStrategy()
                .ToTable("Athletes");

            modelBuilder.Entity<Coach>()
                .UseTpcMappingStrategy()
                .ToTable("Coaches");

            modelBuilder.Entity<Boat>()
                .UseTpcMappingStrategy()
                .ToTable("Boats");

            modelBuilder.Entity<Rigger>()
                .UseTpcMappingStrategy()
                .ToTable("Riggers");

            modelBuilder.Entity<Erg>()
                .UseTpcMappingStrategy()
                .ToTable("Ergs");

            modelBuilder.Entity<Crew>()
                .UseTpcMappingStrategy()
                .ToTable("Crews"); 
        }

        public DbSet<Team> Teams { get; set; }
        public DbSet<Oar> Oars { get; set; }
        public DbSet<Athlete> Athletes { get; set; }
        public DbSet<Coach> Coaches { get; set; }
        public DbSet<Boat> Boats { get; set; }
        public DbSet<Rigger> Riggers { get; set; }
        public DbSet<Erg> Ergs { get; set; }
        public DbSet<Crew> Crews { get; set; }
    }
}
