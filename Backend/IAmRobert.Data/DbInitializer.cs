using IAmRobert.Data.Models;
using System;
using System.Linq;

namespace IAmRobert.Data
{
    /// <summary>
    /// DbInitializer
    /// </summary>
    public static class DbInitializer
    {
        /// <summary>
        /// Initializes the specified context.
        /// </summary>
        /// <param name="context">The context.</param>
        public static void Initialize(DataContext context)
        {
            context.Database.EnsureCreated();

            // Look for any users.
            if (!context.Users.Any())
            {
                string password = "IAmRobert123$";
                byte[] passwordHash, passwordSalt;
                CreatePasswordHash(password, out passwordHash, out passwordSalt);

                User[] users = new User[] {
                    new User()
                    { 
                        Username = "robert", 
                        Name = "Robert Holden", 
                        Email = "rob.holden@live.co.uk",
                        PasswordHash = passwordHash, 
                        PasswordSalt = passwordSalt 
                    }
                };

                context.Users.AddRange(users);
                context.SaveChanges();
            }
        }

        /// <summary>
        /// Creates the password hash.
        /// </summary>
        /// <param name="password">Password.</param>
        /// <param name="passwordHash">Password hash.</param>
        /// <param name="passwordSalt">Password salt.</param>
        public static void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            if (password == null) throw new ArgumentNullException("Invalid Password");
            if (string.IsNullOrWhiteSpace(password)) throw new ArgumentException("Value cannot be empty or whitespace only string.", "password");

            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }
    }
}