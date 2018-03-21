using Microsoft.Extensions.Options;
using IAmRobert.Data;
using IAmRobert.Data.Enums;
using IAmRobert.Data.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace IAmRobert.Core.Services
{
    /// <summary>
    /// Interface for User Service
    /// </summary>
    public interface IUserService
    {
        /// <summary>
        /// Creates a given user
        /// </summary>
        /// <param name="user">"User": the user to create</param>
        /// <param name="password">"string": the password</param>
        /// <returns>User</returns>
        User Create(User user, string password);

        /// <summary>
        /// Deletes a user with a given id
        /// </summary>
        /// <param name="id">"int": the user id</param>
        void Delete(int id);

        /// <summary>
        /// Returns a user with a given email
        /// </summary>
        /// <param name="email">"string": the email</param>
        /// <returns>User</returns>
        User GetByEmail(string email);

        /// <summary>
        /// Returns a user with a given id
        /// </summary>
        /// <param name="id">"int": the user id</param>
        /// <returns>User</returns>
        User GetById(int id);

        /// <summary>
        /// Returns a user with a given username
        /// </summary>
        /// <param name="username">"string": the username</param>
        /// <returns>User</returns>
        User GetByUsername(string username);

        /// <summary>
        /// Returns a user after logging in with given credentials
        /// </summary>
        /// <param name="username">"string": the username</param>
        /// <param name="password">"string": the password</param>
        /// <returns>User</returns>
        User Login(string username, string password);

        /// <summary>
        /// Searches the specified where.
        /// </summary>
        /// <param name="where">The where.</param>
        /// <param name="order">The order.</param>
        /// <param name="orderDir">The order dir.</param>
        /// <param name="page">The page.</param>
        /// <returns></returns>
        IList<User> Search(Func<User, bool> where = null, Func<User, string> order = null, string orderDir = "", int page = 1);

        /// <summary>
        /// Updates the specified user.
        /// </summary>
        /// <param name="user">The user.</param>
        /// <param name="level">The level.</param>
        /// <param name="password">The password.</param>
        /// <returns></returns>
        User Update(User user, string password = null);
    }

    /// <summary>
    /// Core class that handles User crud operations and other business logic
    /// </summary>
    public class UserService : IUserService
    {
        private readonly AppSettings _appSettings;
        private readonly IRepository<User> _repo;
        private readonly IUserTokenService _tokenService;

        /// <summary>
        /// Initializes a new instance of the <see cref="UserService"/> class.
        /// </summary>
        /// <param name="repo">The repo.</param>
        /// <param name="tokenService">The token service.</param>
        /// <param name="appSettings">The application settings.</param>
        public UserService(
            IRepository<User> repo,
            IUserTokenService tokenService,
            IOptions<AppSettings> appSettings)
        {
            _repo = repo;
            _tokenService = tokenService;
            _appSettings = appSettings.Value;
        }

        /// <summary>
        /// Creates a given user
        /// </summary>
        /// <param name="user">"User": the user to create</param>
        /// <param name="password">"string": the password</param>
        /// <returns>User</returns>
        public User Create(User user, string password)
        {
            // Create new object to ensure properties aren't tampered with
            user = new User()
            {
                Email = user.Email,
                Name = user.Name,
                Username = user.Username
            };

            // Validation
            if (string.IsNullOrWhiteSpace(password)) throw new AppException("Password is required", true);

            var error = Validate(user, true, true);
            if (!string.IsNullOrWhiteSpace(error)) throw new AppException(error, true);

            byte[] passwordHash, passwordSalt;
            CreatePasswordHash(password, out passwordHash, out passwordSalt);

            user.PasswordHash = passwordHash;
            user.PasswordSalt = passwordSalt;

            // Create user
            return _repo.Create(user);
        }

        /// <summary>
        /// Deletes a user with a given id
        /// </summary>
        /// <param name="id">"int": the user id</param>
        public void Delete(int id)
        {
            _repo.Delete(GetById(id));
        }

        /// <summary>
        /// Searches the specified where.
        /// </summary>
        /// <param name="where">The where.</param>
        /// <param name="order">The order.</param>
        /// <param name="orderDir">The order dir.</param>
        /// <param name="page">The page.</param>
        /// <returns></returns>
        public IList<User> Search(Func<User, bool> where = null, Func<User, string> order = null, string orderDir = "", int page = 1)
        {
            if (where == null) where = new Func<User, bool>(x => x.Id > 0);
            if (order == null) order = new Func<User, string>(x => x.Username);

            var items = _repo.Items().Where(where);

            if (orderDir.ToLower() == "asc") items = items.OrderBy(order);
            else if (orderDir.ToLower() == "desc") items = items.OrderByDescending(order);

            return items.Skip((page - 1) * 10)
                        .Take(10)
                        .ToList();
        }

        /// <summary>
        /// Returns a user with a given email
        /// </summary>
        /// <param name="email">"string": the email</param>
        /// <returns>User</returns>
        public User GetByEmail(string email)
        {
            return _repo.FindOne(x => x.Email == email);
        }

        /// <summary>
        /// Returns a user with a given id
        /// </summary>
        /// <param name="id">"int": the user id</param>
        /// <returns>User</returns>
        public User GetById(int id)
        {
            return _repo.Find(x => x.Id == id);
        }

        /// <summary>
        /// Returns a user with a given username
        /// </summary>
        /// <param name="username">"string": the username</param>
        /// <returns>User</returns>
        public User GetByUsername(string username)
        {
            return _repo.FindOne(x => x.Username == username);
        }

        /// <summary>
        /// Returns a user after logging in with given credentials
        /// </summary>
        /// <param name="username">"string": the username</param>
        /// <param name="password">"string": the password</param>
        /// <returns>User</returns>
        public User Login(string username, string password)
        {
            if (string.IsNullOrEmpty(username) || string.IsNullOrEmpty(password))
                return null;

            var user = _repo.FindOne(x => x.Username == username);

            // Check if username exists
            if (user == null)
                return null;

            // Check if password is correct
            if (!VerifyPasswordHash(password, user.PasswordHash, user.PasswordSalt))
                return null;

            // Authentication successful
            return user;
        }

        /// <summary>
        /// Updates the specified user.
        /// </summary>
        /// <param name="user">The user.</param>
        /// <param name="password">The password.</param>
        /// <returns></returns>
        /// <exception cref="AppException">
        /// User not found
        /// or
        /// true
        /// </exception>
        public User Update(User user, string password = null)
        {
            // Get user
            var _user = GetById(user.Id);
            if (_user == null) throw new AppException("User not found");

            // Validate
            var error = Validate(user, user.Username != _user.Username, user.Email != _user.Email);
            if (!string.IsNullOrWhiteSpace(error)) throw new AppException(error, true);

            // Update user properties
            _user.Name = user.Name;
            _user.Email = user.Email;
            _user.Username = user.Username;
            _user.LastActiveDate = user.LastActiveDate;

            // Update password if it was entered
            if (!string.IsNullOrWhiteSpace(password))
            {
                byte[] passwordHash, passwordSalt;
                CreatePasswordHash(password, out passwordHash, out passwordSalt);

                _user.PasswordHash = passwordHash;
                _user.PasswordSalt = passwordSalt;
            }

            _repo.Update(_user);
            return _user;
        }

        /// <summary>
        /// Creates a new password hash
        /// </summary>
        /// <param name="password">"string": the plaintext password</param>
        /// <param name="passwordHash">"byte" [out]: returned password hash</param>
        /// <param name="passwordSalt">"byte" [out]: returned password salt</param>
        private static void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            if (password == null) throw new ArgumentNullException("Invalid Password");
            if (string.IsNullOrWhiteSpace(password)) throw new ArgumentException("Value cannot be empty or whitespace only string.", "password");

            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }

        /// <summary>
        /// Verifies a password and its hash
        /// </summary>
        /// <param name="password">"string": the plaintext password</param>
        /// <param name="storedHash">"byte": given password hash</param>
        /// <param name="storedSalt">"byte": given password salt</param>
        /// <returns>bool</returns>
        private static bool VerifyPasswordHash(string password, byte[] storedHash, byte[] storedSalt)
        {
            if (password == null) throw new ArgumentNullException("Invalid Password");
            if (string.IsNullOrWhiteSpace(password)) throw new ArgumentException("Value cannot be empty or whitespace only string.", "password");
            if (storedHash.Length != 64) throw new ArgumentException("Invalid length of password hash (64 bytes expected).", "passwordHash");
            if (storedSalt.Length != 128) throw new ArgumentException("Invalid length of password salt (128 bytes expected).", "passwordHash");

            using (var hmac = new System.Security.Cryptography.HMACSHA512(storedSalt))
            {
                var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                for (int i = 0; i < computedHash.Length; i++)
                {
                    if (computedHash[i] != storedHash[i]) return false;
                }
            }

            return true;
        }

        /// <summary>
        /// Validates the specified user.
        /// </summary>
        /// <param name="user">The user.</param>
        /// <param name="checkUniqueUsername">if set to <c>true</c> [check unique username].</param>
        /// <param name="checkUniqueEmail">if set to <c>true</c> [check unique email].</param>
        /// <returns></returns>
        /// <exception cref="AppException">
        /// Username is already taken - true
        /// or
        /// Email is already taken - true
        /// </exception>
        private string Validate(User user, bool checkUniqueUsername, bool checkUniqueEmail)
        {
            if (string.IsNullOrWhiteSpace(user.Name)) return "Name is required";
            if (string.IsNullOrWhiteSpace(user.Email)) return "Email is required";
            if (string.IsNullOrWhiteSpace(user.Username)) return "Username is required";
            if (user.Username.Length < 3) return "Your username must be at least 3 characters long";

            if (!Functions.IsValidEmail(user.Email)) return "Email is invalid";
            if (!Functions.IsValidUsername(user.Username)) return "Username is invalid";

            // Ensure username is unique?
            if (checkUniqueUsername && GetByUsername(user.Username) != null)
            {
                throw new AppException("Username is already taken", true);
            }

            // Ensure email is unique?
            if (checkUniqueEmail && GetByEmail(user.Email) != null)
            {
                throw new AppException("Email is already taken", true);
            }

            return "";
        }
    }
}