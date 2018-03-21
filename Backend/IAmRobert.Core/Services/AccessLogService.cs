using IAmRobert.Data;
using IAmRobert.Data.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace IAmRobert.Core.Services
{
    /// <summary>
    /// Interface for Token Service
    /// </summary>
    public interface IAccessLogService
    {
        /// <summary>
        /// Counts the specified search.
        /// </summary>
        /// <param name="search">The search.</param>
        /// <returns></returns>
        int Count(Func<AccessLog, bool> search);

        /// <summary>
        /// Creates a given user
        /// </summary>
        /// <param name="token">"token": the user token to create</param>
        /// <returns>AccessLog</returns>
        AccessLog Create(AccessLog token);

        /// <summary>
        /// Gets the specified search.
        /// </summary>
        /// <param name="search">The search.</param>
        /// <returns></returns>
        List<AccessLog> Get(Func<AccessLog, bool> search);

        /// <summary>
        /// Removes the specified search.
        /// </summary>
        /// <param name="search">The search.</param>
        void Remove(Func<AccessLog, bool> search);
    }

    /// <summary>
    /// Core class that handles User token crud operations and other business logic
    /// </summary>
    public class AccessLogService : IAccessLogService
    {
        private readonly IRepository<AccessLog> _repo;

        /// <summary>
        /// Initializes a new instance of the <see cref="AccessLogService"/> class.
        /// </summary>
        /// <param name="repo">The repo.</param>
        public AccessLogService(IRepository<AccessLog> repo)
        {
            _repo = repo;
        }

        /// <summary>
        /// Counts the specified search.
        /// </summary>
        /// <param name="search">The search.</param>
        /// <returns></returns>
        public int Count(Func<AccessLog, bool> search)
        {
            return _repo.Items().Where(search).Count();
        }

        /// <summary>
        /// Creates a given user token
        /// </summary>
        /// <param name="token">"token": the user token to create</param>
        /// <returns>AccessLog</returns>
        public AccessLog Create(AccessLog token)
        {
            return _repo.Create(token);
        }

        /// <summary>
        /// Gets the specified search.
        /// </summary>
        /// <param name="search">The search.</param>
        /// <returns></returns>
        public List<AccessLog> Get(Func<AccessLog, bool> search)
        {
            return _repo.Items().Where(search).ToList();
        }

        /// <summary>
        /// Removes the specified search.
        /// </summary>
        /// <param name="search">The search.</param>
        public void Remove(Func<AccessLog, bool> search)
        {
            _repo.DeleteByRange(Get(search).ToList());
        }
    }
}