using System.Linq;
using System.Security.Claims;

namespace IAmRobert.Api.Helpers
{
    /// <summary>
    ///
    /// </summary>
    public class AuthHelper
    {
        /// <summary>
        /// Gets the user identifier.
        /// </summary>
        /// <returns></returns>
        public static int GetUserId(ClaimsPrincipal User)
        {
            try
            {
                if (User.Identity.IsAuthenticated)
                {
                    var value = User.Claims.Where(c => c.Type == "UserId").Select(c => c.Value).FirstOrDefault();
                    if (string.IsNullOrEmpty(value)) return 0;

                    return int.Parse(value);
                }
            }
            catch { return 0; }

            return 0;
        }
    }
}