namespace IAmRobert.Core
{
    /// <summary>
    /// App Settngs
    /// </summary>
    public class AppSettings
    {
        /// <summary>
        /// Gets or sets the API URL.
        /// </summary>
        /// <value>
        /// The API URL.
        /// </value>
        public string ApiUrl { get; set; }

        /// <summary>
        /// Gets or sets the brute force attempts.
        /// </summary>
        /// <value>
        /// The brute force attempts.
        /// </value>
        public int BruteForceAttempts { get; set; }

        /// <summary>
        /// Gets or sets the client URL.
        /// </summary>
        /// <value>
        /// The client URL.
        /// </value>
        public string ClientUrl { get; set; }
    }

    /// <summary>
    /// Token Settings
    /// </summary>
    public class TokenSettings
    {
        /// <summary>
        /// Gets or sets the audience.
        /// </summary>
        /// <value>
        /// The audience.
        /// </value>
        public string Audience { get; set; }

        /// <summary>
        /// Gets or sets the issuer.
        /// </summary>
        /// <value>
        /// The issuer.
        /// </value>
        public string Issuer { get; set; }

        /// <summary>
        /// Gets or sets the key.
        /// </summary>
        /// <value>
        /// The key.
        /// </value>
        public string Key { get; set; }
    }
}