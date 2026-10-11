using CrewTeamManagerV2.Models;
using Microsoft.EntityFrameworkCore.Storage;

namespace CrewTeamManagerV2.Data
{
    public class AppInitializer
    {
        public static void Initialize(AppContext context)
        {
            //if (context.IsDatabaseCreated())
            //    return;

            context.Database.EnsureDeleted();
            context.Database.EnsureCreated();
            AddAC(context);
        }

        private static void AddAC(AppContext context)
        {
            var team = new Team
            {
                Name = "NYAC",
                PostalCode = "10001",
                Country = "USA",
                StreetAddress = "123 Shore Rd",
                City = "New York",
                State = "NY",
                Color = "RED",
                Logo = "Winged Foot",
            };


            var oars = new List<Oar>
            {
                new Oar { Name = "Oar 1" , BladeColor = "RED", HandleType = "Suede", Length = 371},
                new Oar { Name = "Oar 2", BladeColor = "RED", HandleType = "Suede", Length = 371},
                new Oar { Name = "Oar 3", BladeColor = "RED", HandleType = "Suede", Length = 371},
                new Oar { Name = "Oar 4", BladeColor = "RED", HandleType = "Suede", Length = 371},
                new Oar { Name = "Oar 5", BladeColor = "RED", HandleType = "Rubber", Length = 281},
                new Oar { Name = "Oar 6", BladeColor = "RED", HandleType = "Rubber", Length = 281},
                new Oar { Name = "Oar 7", BladeColor = "RED", HandleType = "Rubber", Length = 281},
                new Oar { Name = "Oar 8", BladeColor = "RED", HandleType = "Rubber", Length = 281},
            };

            var users = new List<User>
            {
                new Athlete { EmailAddress = "ac@example.com" },
                new Athlete { EmailAddress = "a2@nyac.org" },
                new Athlete { EmailAddress = "a3@nyac.org" },
                new Athlete { EmailAddress = "a4@nyac.org" },
                new Coach { EmailAddress = "coach@nyac.org" },
                new Athlete { EmailAddress = "cox@nyac.org" },
            };

            var boats = new List<Boat>
            {
                new Boat { Name = "Boat 1", Type = BoatType.Sweep, Size = 4, BoatId = new Guid(), Manufacturer = "Vespo",  Rig = Rigging.Starboard },
                new Boat { Name = "Boat 2", Type = BoatType.Scull, Size = 4, BoatId = new Guid(), Manufacturer = "Filippi" },
                new Boat { Name = "Boat 3", Type = BoatType.Scull, Size = 2, BoatId = new Guid(), Manufacturer = "Filippi" },
            };

            var ergs = new List<Erg>
            {
                new Erg { Location = "Erg 1", Condition = Condition.Average, Model = ErgModel.C2Row, Number = 1 },
                new Erg { Location = "Erg 2", Condition = Condition.AboveAverage, Model = ErgModel.C2Bike, Number = 2 },
                new Erg { Location = "Erg 3", Condition = Condition.Average, Model = ErgModel.RP3, Number = 3 },
            };

            var riggers = new List<Rigger>
            {
                new Rigger { BoatId = boats[0].BoatId, Type = RiggerType.Wing, Style = Style.Sweep, Mounted = Mount.Bow },
                new Rigger { BoatId = boats[0].BoatId, Type = RiggerType.Wing, Style = Style.Sweep, Mounted = Mount.Bow },
                new Rigger { BoatId = boats[0].BoatId, Type = RiggerType.Wing, Style = Style.Sweep, Mounted = Mount.Bow },
                new Rigger { BoatId = boats[0].BoatId, Type = RiggerType.Wing, Style = Style.Sweep, Mounted = Mount.Bow },
                new Rigger { BoatId = boats[1].BoatId, Type = RiggerType.Euro, Style = Style.Scull, Mounted = Mount.Side },
                new Rigger { BoatId = boats[2].BoatId, Type = RiggerType.Wing, Style = Style.Scull, Mounted = Mount.Stern },
            };

            var crews = new List<Crew>
            {
                new Crew { Shell = boats[0], Athletes = new List<Athlete> { (Athlete)users[0], (Athlete)users[1], (Athlete)users[2], (Athlete)users[3] }, Coxswain = (Athlete)users[5], Oars = oars.Take(4).ToList() },
                new Crew { Shell = boats[1], Athletes = new List<Athlete> { (Athlete)users[0], (Athlete)users[1], (Athlete)users[2], (Athlete)users[3] }, Coxswain = (Athlete)users[5], Oars = oars.Skip(4).ToList() },
                new Crew { Shell = boats[2], Athletes = new List<Athlete> { (Athlete)users[0], (Athlete)users[1] }, Oars = oars.Skip(4).Take(2).ToList() },
            };

            context.Teams.Add(team);
            context.Athletes.AddRange(users.Where(u => u is Athlete).Select(u => (Athlete)u));
            context.Coaches.AddRange(users.Where(u => u is Coach).Select(u => (Coach)u));
            context.Oars.AddRange(oars);
            context.Boats.AddRange(boats);
            context.Ergs.AddRange(ergs);
            context.SaveChanges();
        }
    }
}
