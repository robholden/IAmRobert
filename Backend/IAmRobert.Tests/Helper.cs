using IAmRobert.Core;
using IAmRobert.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace IAmRobert.Tests
{
    internal class Helper
    {
        public static IOptions<AppSettings> AppSettings()
        {
            return Options.Create(new AppSettings());
        }

        public static DataContext GetContext()
        {
            var options = new DbContextOptionsBuilder<DataContext>()
                            .UseLazyLoadingProxies()
                            .UseInMemoryDatabase("IAmRobert")
                            .Options;

            var context = new DataContext(options);
            //DbInitializer.Initialize(context);

            return context;
        }
    }
}