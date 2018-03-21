using IAmRobert.Data;
using IAmRobert.Data.Enums;
using IAmRobert.Data.Models;
using System.Collections.Generic;
using System.Linq;

namespace IAmRobert.Core.Services
{
    /// <summary>
    /// Interface for Token Service
    /// </summary>
    public interface IUserTokenService
    {
        /// <summary>
        /// Creates a given user
        /// </summary>
        /// <param name="token">"token": the user token to create</param>
        /// <returns>UserToken</returns>
        UserToken Create(UserToken token);

        /// <summary>
        /// Deletes a user token with a given id
        /// </summary>
        /// <param name="id">"int": the user token id</param>
        void Delete(int id);

        /// <summary>
        /// Deletes a user token with a given key
        /// </summary>
        /// <param name="key">"string": the key value</param>
        /// <param name="type">"TokenType": the token type</param>
        void DeleteByKey(string key, TokenType type);

        /// <summary>
        /// Returns a user token by a given guid
        /// </summary>
        /// <param name="guid">"string": the guid value</param>
        /// <returns>UserToken</returns>
        UserToken GetByGuid(string guid);

        /// <summary>
        /// Returns a user token with a given id
        /// </summary>
        /// <param name="id">"int": the user token id</param>
        /// <returns>UserToken</returns>
        UserToken GetById(int id);

        /// <summary>
        /// Returns a user token with a given token value
        /// </summary>
        /// <param name="token">"string": the token value</param>
        /// <param name="type">"TokenType": the token type</param>
        /// <returns>UserToken</returns>
        UserToken GetByToken(string token, TokenType type);

        /// <summary>
        /// Returns user tokens with a given user id
        /// </summary>
        /// <param name="userId">"int": the user id</param>
        /// <param name="type">"TokenType": the token type</param>
        /// <returns>List->UserToken</returns>
        List<UserToken> GetByUserId(int userId, TokenType type);

        /// <summary>
        /// Returns whether a given key is valid against a given user
        /// </summary>
        /// <param name="userId">"int": the user id</param>
        /// <param name="key">"string": the key value</param>
        /// <returns>bool</returns>
        bool IsKeyValid(int userId, string key);

        /// <summary>
        /// Updates a given user token
        /// </summary>
        /// <param name="token">"token": the user token to update</param>
        void Update(UserToken token);
    }

    /// <summary>
    /// Core class that handles User token crud operations and other business logic
    /// </summary>
    public class UserTokenService : IUserTokenService
    {
        private readonly IRepository<UserToken> _repo;

        /// <summary>
        /// Initializes a new instance of the <see cref="UserTokenService"/> class.
        /// </summary>
        /// <param name="repo">The repo.</param>
        public UserTokenService(IRepository<UserToken> repo)
        {
            _repo = repo;
        }

        /// <summary>
        /// Creates a given user token
        /// </summary>
        /// <param name="token">"token": the user token to create</param>
        /// <returns>UserToken</returns>
        public UserToken Create(UserToken token)
        {
            return _repo.Create(token);
        }

        /// <summary>
        /// Deletes a user token with a given id
        /// </summary>
        /// <param name="id">"int": the user token id</param>
        public void Delete(int id)
        {
            var token = GetById(id);
            if (token != null)
            {
                token.Deleted = true;
                Update(token);
            }
        }

        /// <summary>
        /// Deletes a user token with a given key
        /// </summary>
        /// <param name="key">"string": the key value</param>
        /// <param name="type">"TokenType": the token type</param>
        public void DeleteByKey(string key, TokenType type)
        {
            var tokens = _repo.Items()
                            .Where(x => x.Key == key && x.Type == type)
                            .ToList();
            if (tokens.Count > 0)
            {
                foreach (UserToken token in tokens)
                    token.Deleted = true;

                _repo.UpdateRange(tokens);
            }
        }

        /// <summary>
        /// Returns a user token by a given guid
        /// </summary>
        /// <param name="guid">"string": the guid value</param>
        /// <returns>UserToken</returns>
        public UserToken GetByGuid(string guid)
        {
            return _repo.Items().SingleOrDefault(t => t.Guid == guid);
        }

        /// <summary>
        /// Returns a user token with a given id
        /// </summary>
        /// <param name="id">"int": the user token id</param>
        /// <returns>UserToken</returns>
        public UserToken GetById(int id)
        {
            return _repo.Find(x => x.Id == id);
        }

        /// <summary>
        /// Returns a user token with a given token value
        /// </summary>
        /// <param name="token">"string": the token value</param>
        /// <param name="type">"TokenType": the token type</param>
        /// <returns>UserToken</returns>
        public UserToken GetByToken(string token, TokenType type)
        {
            return _repo.Items().SingleOrDefault(t => t.Token == token && t.Type == type);
        }

        /// <summary>
        /// Returns user tokens with a given user id
        /// </summary>
        /// <param name="userId">"int": the user id</param>
        /// <param name="type">"TokenType": the token type</param>
        /// <returns>List->UserToken</returns>
        public List<UserToken> GetByUserId(int userId, TokenType type)
        {
            return _repo.Items().Where(x => x.UserId == userId && x.Type == type && !x.Deleted).ToList();
        }

        /// <summary>
        /// Returns whether a given key is valid against a given user
        /// </summary>
        /// <param name="userId">"int": the user id</param>
        /// <param name="key">"string": the key value</param>
        /// <returns>bool</returns>
        public bool IsKeyValid(int userId, string key)
        {
            return _repo.Items().FirstOrDefault(x => x.Key == key && x.UserId == userId && !x.Deleted) != null;
        }

        /// <summary>
        /// Updates a given user token
        /// </summary>
        /// <param name="token">"UserToken": the user token to update</param>
        public void Update(UserToken token)
        {
            _repo.Update(token);
        }
    }
}