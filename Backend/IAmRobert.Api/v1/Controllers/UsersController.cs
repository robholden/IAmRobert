using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using IAmRobert.Api.v1.Dtos;
using IAmRobert.Core;
using IAmRobert.Core.Services;
using IAmRobert.Data.Enums;
using IAmRobert.Data.Models;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;

namespace IAmRobert.Api.v1.Controllers
{
    /// <summary>
    ///
    /// This controller handles all requests to do with a user
    ///
    /// </summary>
    [Authorize(Policy = "User")]
    [ApiVersion("1.0")]
    [Route("v{version:apiVersion}/[controller]")]
    public class UsersController : Controller
    {
        private readonly AppSettings _appSettings;
        private readonly ILogger _logger;
        private readonly TokenSettings _tokenSettings;
        private IAccessLogService _accessLogService;
        private IMapper _mapper;
        private IUserTokenService _tokenService;
        private IUserService _userService;

        /// <summary>
        /// Initializes a new instance of the <see cref="UsersController"/> class.
        /// </summary>
        /// <param name="accessLogService">The access log service.</param>
        /// <param name="userService">The user service.</param>
        /// <param name="tokenService">The token service.</param>
        /// <param name="mapper">The mapper.</param>
        /// <param name="appSettings">The application settings.</param>
        /// <param name="tokenSettings">The token settings.</param>
        /// <param name="logger">The logger.</param>
        public UsersController(
            IAccessLogService accessLogService,
            IUserService userService,
            IUserTokenService tokenService,
            IMapper mapper,
            IOptions<AppSettings> appSettings,
            IOptions<TokenSettings> tokenSettings,
            ILogger<UsersController> logger)
        {
            _accessLogService = accessLogService;
            _userService = userService;
            _tokenService = tokenService;
            _mapper = mapper;
            _appSettings = appSettings.Value;
            _tokenSettings = tokenSettings.Value;
            _logger = logger;
        }

        /// <summary>
        /// Check for authentication
        /// </summary>
        /// <returns>IActionResult</returns>
        [HttpGet("Authenticated")]
        public IActionResult Authenticated()
        {
            try
            {
                var user = _userService.GetByUsername(User.Identity.Name);
                return Ok(Mapper.Map<UserDto>(user));
            }
            catch (AppException ex)
            {
                _logger.LogError(ex, "Authenticated - AppException");
                return BadRequest(ex.Validation ? ex.Message : "");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Authenticated - Exception");
                return BadRequest();
            }
        }

        /// <summary>
        /// Deletes a user
        /// </summary>
        /// <returns>IActionResult</returns>
        [HttpDelete("{id}")]
        public IActionResult Delete()
        {
            try
            {
                var user = _userService.GetByUsername(User.Identity.Name);
                _userService.Delete(user.Id);
                return Ok();
            }
            catch (AppException ex)
            {
                _logger.LogError(ex, "Delete/{id} - AppException");
                return BadRequest(ex.Validation ? ex.Message : "");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Delete/{id} - Exception");
                return BadRequest();
            }
        }

        /// <summary>
        /// Returns a user by their username
        /// </summary>
        /// <param name="username">"string": the username</param>
        /// <returns>IActionResult</returns>
        [AllowAnonymous]
        [HttpGet("{username}")]
        public IActionResult Get(string username)
        {
            try
            {
                var user = _userService.GetByUsername(username);
                var userDto = _mapper.Map<UserBasicDto>(user);
                return Ok(userDto);
            }
            catch (AppException ex)
            {
                _logger.LogError(ex, "Get/{username} - AppException");
                return BadRequest(ex.Validation ? ex.Message : "");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Get/{username} - Exception");
                return BadRequest();
            }
        }

        /// <summary>
        /// Logins a given user
        /// </summary>
        /// <param name="credentials">"Credential": the credentials of a user</param>
        /// <returns>IActionResult</returns>
        [AllowAnonymous]
        [HttpPost("login")]
        public IActionResult Login([FromBody]UserCredentialsDto credentials)
        {
            var authorised = false;
            try
            {
                // Stop brute force
                var func = new Func<AccessLog, bool>(a => a.IpAddress == "" && a.Type == AccessType.Login && !a.Authorised && a.Username == credentials.Username);
                var attempts = _accessLogService.Get(func).ToList();
                if (attempts.Count > _appSettings.BruteForceAttempts) throw new AppException("Your account has been locked.");

                // Attempt login
                var user = _userService.Login(credentials.Username, credentials.Password);
                if (user == null) throw new AppException("Either your username or password is incorrect.");

                // Access granted
                authorised = true;
                _accessLogService.Remove(func);

                // Return basic user info (without password) and token to store client side
                return Ok(new
                {
                    State = true,
                    User = _mapper.Map<UserDto>(user),
                    Token = CreateToken(user, credentials.Key),
                    ExpiresIn = TimeSpan.FromDays(7).Seconds
                });
            }
            catch (AppException ex)
            {
                return Ok(new
                {
                    State = false,
                    ex.Message
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Login - Exception");
                return BadRequest();
            }
            finally
            {
                // Log request
                _accessLogService.Create(new AccessLog()
                {
                    IpAddress = "n/a",
                    Url = "/users/login",
                    Method = "POST",
                    Type = AccessType.Login,
                    Authorised = authorised,
                    Key = credentials.Key,
                    Username = credentials.Username
                });
            }
        }

        /// <summary>
        /// Logouts the authenticated user
        /// </summary>
        /// <param name="token">"string": the user's token</param>
        /// <returns>IActionResult</returns>
        [HttpGet("logout")]
        public IActionResult Logout(string token)
        {
            try
            {
                // Get token
                var _token = _tokenService.GetByToken(token, TokenType.Authentication);
                if (_token == null) return Ok();

                // Ensure token is user's
                if (_token.User.Username != User.Identity.Name) return Ok();

                _tokenService.Delete(_token.Id);
                return Ok();
            }
            catch (AppException ex)
            {
                _logger.LogError(ex, "Logout - AppException");
                return BadRequest(ex.Validation ? ex.Message : "");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Logout - Exception");
                return BadRequest();
            }
        }

        /// <summary>
        /// Registers a given user
        /// </summary>
        /// <param name="user">"UserDto": the user to register</param>
        /// <returns>IActionResult</returns>
        [AllowAnonymous]
        [HttpPost]
        public IActionResult Register([FromBody]UserRegisterDto user)
        {
            try
            {
                // Map dto to entity
                var _user = _mapper.Map<User>(user);

                _userService.Create(_user, user.Password);
                return Ok();
            }
            catch (AppException ex)
            {
                _logger.LogError(ex, "Register - AppException");
                return BadRequest(ex.Validation ? ex.Message : "");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Register - Exception");
                return BadRequest();
            }
        }

        /// <summary>
        /// Updates a user
        /// </summary>
        /// <param name="setting">"Setting": the data to update</param>
        /// <returns>IActionResult</returns>
        [HttpPut]
        public IActionResult Update([FromBody]UserSettingDto setting)
        {
            try
            {
                // Auth
                var _authUser = _userService.Login(setting.User.Username, setting.Password);
                if (_authUser == null || _authUser.Username.ToLower() != User.Identity.Name)
                    throw new AppException("Password was entered incorrectly", true);
                
                // Map dto to entity and set id
                var _user = _mapper.Map<User>(setting.User);

                // Remove permissions
                _user.Id = _authUser.Id;

                // Validate email
                if (_user.Email != _authUser.Email)
                {
                    if (_userService.GetByEmail(_user.Email) != null)
                        throw new AppException("Email address has already been registered", true);
                }

                _userService.Update(_user, setting.User.Password);
                return Ok();
            }
            catch (AppException ex)
            {
                _logger.LogError(ex, "Update - AppException");
                return BadRequest(ex.Validation ? ex.Message : "");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Update - Exception");
                return BadRequest();
            }
        }

        /// <summary>
        /// Creates a token for the given user.
        /// </summary>
        /// <param name="user"></param>
        /// <param name="identifier"></param>
        /// <returns>string</returns>
        private string CreateToken(User user, string identifier)
        {
            var guid = Guid.NewGuid().ToString();
            var claims = new List<Claim>()
                {
                    //new Claim("UserId", user.Id.ToString()), // Don't leak user id
                    new Claim(JwtRegisteredClaimNames.UniqueName, user.Username),
                    new Claim(JwtRegisteredClaimNames.Jti, guid)
                };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_tokenSettings.Key));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(_tokenSettings.Issuer, _tokenSettings.Audience, claims, expires: DateTime.UtcNow.AddDays(7), signingCredentials: creds);
            var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

            // "Delete" all tokens against this key
            _tokenService.DeleteByKey(identifier, TokenType.Authentication);

            // Create and store token
            var t = new UserToken()
            {
                UserId = user.Id,
                Guid = guid,
                Key = identifier,
                Token = tokenString,
                Type = TokenType.Authentication,
                Expires = DateTime.UtcNow.AddDays(7)
            };
            _tokenService.Create(t);

            return tokenString;
        }
    }
}