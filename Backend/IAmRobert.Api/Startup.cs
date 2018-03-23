using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.Runtime.InteropServices;
using IAmRobert.Core;
using IAmRobert.Data;
using IAmRobert.Core.Services;
using IAmRobert.Data.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Authorization;
using IAmRobert.Api.Auth;

namespace IAmRobert.Api
{
    /// <summary>
    /// Start Up
    /// </summary>
    public class Startup
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="Startup"/> class.
        /// </summary>
        /// <param name="env">The env.</param>
        public Startup(IHostingEnvironment env)
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                .AddEnvironmentVariables();
            Configuration = builder.Build();
        }

        /// <summary>
        /// Gets the configuration.
        /// </summary>
        /// <value>
        /// The configuration.
        /// </value>
        public IConfigurationRoot Configuration { get; }

        /// <summary>
        /// Configures the services.
        /// This method gets called by the runtime. Use this method to add services to the container.
        /// </summary>
        /// <param name="services">The services.</param>
        public void ConfigureServices(IServiceCollection services)
        {
            services
                .AddAuthorization(options =>
                {
                    options.AddPolicy("User", policy => policy.Requirements.Add(new UserRequirement()));
                })
                .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(opts =>
                {
                    opts.IncludeErrorDetails = true;
                    opts.RequireHttpsMetadata = false;
                    opts.SaveToken = true;
                    opts.TokenValidationParameters = new TokenValidationParameters()
                    {
                        ValidateIssuer = true,
                        ValidIssuer = Configuration["TokenSettings:Issuer"],
                        ValidateAudience = true,
                        ValidAudience = Configuration["TokenSettings:Audience"],
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["TokenSettings:Key"]))
                    };
                });

            services.AddMvc().AddJsonOptions(
                options => options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
            );
            services.AddCors();
            services.AddAutoMapper();
            services.AddApiVersioning(o => o.ReportApiVersions = true);

            services.Configure<TokenSettings>(Configuration.GetSection("TokenSettings"));
            services.Configure<AppSettings>(Configuration.GetSection("AppSettings"));

            // Angular's default header name for sending the XSRF token.
            services.AddAntiforgery(options => options.HeaderName = "X-XSRF-TOKEN");

            // Auth di
            services.AddTransient<IAuthorizationHandler, UserAuthorizeHandler>();

            // configure DI for db repos
            services.AddScoped<IRepository<AccessLog>, Repository<AccessLog>>();
            services.AddScoped<IRepository<Post>, Repository<Post>>();
            services.AddScoped<IRepository<User>, Repository<User>>();
            services.AddScoped<IRepository<UserToken>, Repository<UserToken>>();

            // configure DI for application services
            services.AddTransient<IAccessLogService, AccessLogService>();
            services.AddTransient<IPostService, PostService>();
            services.AddTransient<IUserService, UserService>();
            services.AddTransient<IUserTokenService, UserTokenService>();

            // If Mac use in memory
            if (OperatingSystem.IsMacOS() || true)
            {
                services.AddDbContext<DataContext>(x => x.UseLazyLoadingProxies().UseInMemoryDatabase("IAmRobert"));
            }
            else
            {
                var connection = @"Server=localhost\SQLEXPRESS;Database=IAmRobert;Trusted_Connection=True;";
                services.AddDbContext<DataContext>(x => x.UseLazyLoadingProxies().UseSqlServer(connection, b => b.MigrationsAssembly("IAmRobert.Api")));
            }
        }

        /// <summary>
        /// Configures the specified application.
        /// This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        /// </summary>
        /// <param name="app">The application.</param>
        /// <param name="env">The env.</param>
        /// <param name="loggerFactory">The logger factory.</param>
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            // TODO: https://github.com/aspnet/Docs/tree/master/aspnetcore/fundamentals/logging/index/sample2
            
            loggerFactory.AddConsole(Configuration.GetSection("Logging"));
            loggerFactory.AddDebug();
 
            // Enable cors            
            app.UseCors(x => x
                .WithOrigins(Configuration["AppSettings:CorsOrigin"].Split(','))
                .AllowAnyMethod()
                .AllowAnyHeader()
                .AllowCredentials()
            );

            app.UseStaticFiles(new StaticFileOptions()
            {
                OnPrepareResponse = ctx =>
                {
                    ctx.Context.Response.Headers.Append("Cache-Control", "public,max-age=600");
                }
            });
            if (env.IsDevelopment()) app.UseDeveloperExceptionPage();
            app.UseAuthentication();
            app.UseMvc();            
        }
    }

    /// <summary>
    /// Operating System
    /// </summary>
    public static class OperatingSystem
    {
        /// <summary>
        /// Determines whether this instance is windows.
        /// </summary>
        /// <returns>
        ///   <c>true</c> if this instance is windows; otherwise, <c>false</c>.
        /// </returns>
        public static bool IsWindows() => RuntimeInformation.IsOSPlatform(OSPlatform.Windows);

        /// <summary>
        /// Determines whether [is mac os].
        /// </summary>
        /// <returns>
        ///   <c>true</c> if [is mac os]; otherwise, <c>false</c>.
        /// </returns>
        public static bool IsMacOS() => RuntimeInformation.IsOSPlatform(OSPlatform.OSX);

        /// <summary>
        /// Determines whether this instance is linux.
        /// </summary>
        /// <returns>
        ///   <c>true</c> if this instance is linux; otherwise, <c>false</c>.
        /// </returns>
        public static bool IsLinux() => RuntimeInformation.IsOSPlatform(OSPlatform.Linux);
    }
}