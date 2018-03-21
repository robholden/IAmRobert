using System;
using System.Collections.Generic;
using System.Text;

namespace IAmRobert.Data.Enums
{
    /// <summary>
    /// Token enum.
    /// </summary>
    public enum TokenType
    {
        /// <summary>
        /// Any
        /// </summary>
        Any = 0,

        /// <summary>
        /// The authentication.
        /// </summary>
        Authentication = 1,

        /// <summary>
        /// The email confirmation.
        /// </summary>
        EmailConfirmation = 2,

        /// <summary>
        /// The reset password.
        /// </summary>
        ResetPassword = 3
    }
}
