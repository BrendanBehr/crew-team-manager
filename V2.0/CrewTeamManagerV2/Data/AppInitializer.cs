namespace CrewTeamManagerV2.Data
{
    public class AppInitializer
    {
        public static void Initialize(AppContext context)
        {
            if (context.Teams.Any())
                return;


        }
    }
}
