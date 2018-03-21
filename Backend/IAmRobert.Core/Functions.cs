using System;
using System.Collections.Generic;
using System.Text;
using System.Text.RegularExpressions;

namespace IAmRobert.Core
{
    /// <summary>
    /// Helper Functions
    /// </summary>
    public class Functions
    {
        /// <summary>
        /// Determines whether [is valid email] [the specified email].
        /// </summary>
        /// <param name="email">The email.</param>
        /// <returns>
        ///   <c>true</c> if [is valid email] [the specified email]; otherwise, <c>false</c>.
        /// </returns>
        public static bool IsValidEmail(string email)
        {
            try
            {
                var addr = new System.Net.Mail.MailAddress(email);
                return addr.Address == email;
            }
            catch
            {
                return false;
            }
        }

        /// <summary>
        /// Determines whether [is valid username] [the specified username].
        /// </summary>
        /// <param name="username">The username.</param>
        /// <returns>
        ///   <c>true</c> if [is valid username] [the specified username]; otherwise, <c>false</c>.
        /// </returns>
        public static bool IsValidUsername(string username)
        {
            username = username.ToLower();

            // Only allow numbers & letters
            Regex regex = new Regex("^[a-zA-Z0-9][a-zA-Z0-9_]*$");

            return regex.IsMatch(username);
        }
    }
}
