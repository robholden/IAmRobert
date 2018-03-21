using System;
using System.Globalization;

namespace IAmRobert.Core
{
    /// <summary>
    /// Custom exception class for throwing application specific exceptions (e.g. for validation)
    /// that can be caught and handled within the application
    /// </summary>
    /// <seealso cref="System.Exception" />
    public class AppException : Exception
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="AppException"/> class.
        /// </summary>
        public AppException() : base() { }

        /// <summary>
        /// Initializes a new instance of the <see cref="AppException"/> class.
        /// </summary>
        /// <param name="message">The message that describes the error.</param>
        public AppException(string message) : base(message) { }

        /// <summary>
        /// Initializes a new instance of the <see cref="AppException"/> class.
        /// </summary>
        /// <param name="message">The message.</param>
        /// <param name="validation">if set to <c>true</c> [validation].</param>
        public AppException(string message, bool validation) : base(message) { Validation = validation; }

        /// <summary>
        /// Initializes a new instance of the <see cref="AppException"/> class.
        /// </summary>
        /// <param name="message">The message.</param>
        /// <param name="args">The arguments.</param>
        public AppException(string message, params object[] args)
            : base(String.Format(CultureInfo.CurrentCulture, message, args))
        {
        }

        /// <summary>
        /// Gets or sets a value indicating whether this <see cref="AppException"/> is validation.
        /// </summary>
        /// <value>
        ///   <c>true</c> if validation; otherwise, <c>false</c>.
        /// </value>
        public bool Validation { get; set; } = false;
    }
}