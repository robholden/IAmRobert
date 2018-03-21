using IAmRobert.Data.Enums;
using System;
using System.ComponentModel.DataAnnotations;

namespace IAmRobert.Data.Models
{
    /// <summary>
    /// Access Log class
    /// </summary>
    public class AccessLog
    {
        /// <summary>
        /// Gets or sets the access token.
        /// </summary>
        /// <value>
        /// The access token.
        /// </value>
        [Required, MaxLength(500)]
        public string AccessToken { get; set; } = "";

        /// <summary>
        /// Gets or sets the attempt date.
        /// </summary>
        /// <value>
        /// The attempt date.
        /// </value>
        public DateTime AttemptDate { get; set; } = DateTime.Now;

        /// <summary>
        /// Gets or sets a value indicating whether this <see cref="AccessLog"/> is authorised.
        /// </summary>
        /// <value>
        ///   <c>true</c> if authorised; otherwise, <c>false</c>.
        /// </value>
        public bool Authorised { get; set; }

        /// <summary>
        /// Gets or sets the identifier.
        /// </summary>
        /// <value>
        /// The identifier.
        /// </value>
        [Key]
        public int Id { get; set; }

        /// <summary>
        /// Gets or sets the ip address.
        /// </summary>
        /// <value>
        /// The ip address.
        /// </value>
        [MaxLength(100)]
        public string IpAddress { get; set; }

        /// <summary>
        /// Gets or sets the key.
        /// </summary>
        /// <value>
        /// The key.
        /// </value>
        [MaxLength(255)]
        public string Key { get; set; }

        /// <summary>
        /// Gets or sets the method.
        /// </summary>
        /// <value>
        /// The method.
        /// </value>
        [MaxLength(20)]
        public string Method { get; set; }

        /// <summary>
        /// Gets or sets the type.
        /// </summary>
        /// <value>
        /// The type.
        /// </value>
        [Required]
        public AccessType Type { get; set; }

        /// <summary>
        /// Gets or sets the URL.
        /// </summary>
        /// <value>
        /// The URL.
        /// </value>
        [MaxLength(255)]
        public string Url { get; set; }

        /// <summary>
        /// Gets or sets the username.
        /// </summary>
        /// <value>
        /// The username.
        /// </value>
        [MaxLength(255)]
        public string Username { get; set; }
    }
}