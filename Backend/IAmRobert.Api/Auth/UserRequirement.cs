using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using IAmRobert.Core.Services;
using IAmRobert.Data;

namespace IAmRobert.Api.Auth
{
    /// <summary>
    /// User requirement.
    /// </summary>
    public class UserRequirement : IAuthorizationRequirement
    {
    }

    /// <summary>
    /// User authorize handler.
    /// </summary>
    public class UserAuthorizeHandler : AuthorizationHandler<UserRequirement>
    {
        private DataContext _db;
        private IUserTokenService _tokenService;
        private IUserService _userService;

        /// <summary>
        /// Initializes a new instance of the <see cref="T:IAmRobert.Api.UserAuthorizeHandler"/> class.
        /// </summary>
        /// <param name="db">Db.</param>
        /// <param name="tokenService">Token service.</param>
        public UserAuthorizeHandler(DataContext db, IUserTokenService tokenService, IUserService userService)
        {
            _db = db;
            _tokenService = tokenService;
            _userService = userService;
        }

        /// <summary>
        /// Handles the requirement async.
        /// </summary>
        /// <returns>The requirement async.</returns>
        /// <param name="context">Context.</param>
        /// <param name="requirement">Requirement.</param>
        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, UserRequirement requirement)
        {
            // Ensure token is valid
            try
            {
                var guid = context.User.FindFirst(c => c.Type == "jti").Value;
                if (string.IsNullOrEmpty(guid)) throw new Exception();

                // Make sure it's valid
                var token = _tokenService.GetByGuid(guid);
                if (token == null) throw new Exception();
                if (token.Deleted) throw new Exception();

                token.User.LastActiveDate = DateTime.Now;
                _userService.Update(token.User);

                context.Succeed(requirement);
            }
            catch
            {
                context.Fail();
            }

            return Task.CompletedTask;
        }
    }
}
