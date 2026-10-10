# Crew Team Manager V2
This is an updated project frm the original written as an intern.  The goals are to practice and learn WebDevelopment using a Blazor ASP.NET app. 

The original version had 3 levels:
1. Coach/Captain view
2. Player view
3. Visitor View

### Visitors
Least privileges, can view the team roster and upcoming games.  Can also view the team stats.

### rowers
All privileges of visitors, plus can view their own stats and update their personal information.  They can also see equipment and request uses

### Coaches/Captains
All privileges of rowers, plus can view all player stats, update team information, and manage equipment requests.  They can also schedule games and practices.

### Teams
Teams consist of rowers, coaches, and captains.  Each team has a roster of rowers, a schedule of games and practices, and a list of equipment.  Teams can be created and managed by coaches and captains.
rowers can be added to teams by coaches and captains, and rowers can request to join a team.  rowers can also be removed from teams by coaches and captains.
rowers and coaches are considered visitors to other teams, and can view the roster and schedule of other teams.  rowers can also view the stats of other rowers on their team, but cannot view the stats of rowers on other teams.

### Equipment
The equipment that rowers can use as per the old version:
- Boats
- Oars
- Ergometers
- Riggers

Equipment that can be added in this version:
- Speed Coaches
- Cox Boxes