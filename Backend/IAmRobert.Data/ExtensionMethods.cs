using Microsoft.EntityFrameworkCore;
using IAmRobert.Data.Models;
using System.Linq;

namespace IAmRobert.Data
{
    /// <summary>
    /// Extension Methods
    /// </summary>
    public static class ExtensionMethods
    {
        /// <summary>
        /// Builds the specified query.
        /// </summary>
        /// <param name="query">The query.</param>
        /// <returns></returns>
        public static IQueryable<Post> Build(this IQueryable<Post> query)
        {
            return query.Include(x => x.User);
        }

        /// <summary>
        /// Builds the user token.
        /// </summary>
        /// <param name="query">The query.</param>
        /// <returns></returns>
        public static IQueryable<UserToken> Build(this IQueryable<UserToken> query)
        {
            return query.Include(x => x.User);
        }
    }
}