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
    /// This controller handles all requests to do with a post
    ///
    /// </summary>
    [Authorize(Policy = "User")]
    [ApiVersion("1.0")]
    [Route("v{version:apiVersion}/[controller]")]
    public class PostsController : Controller
    {
        private readonly AppSettings _appSettings;
        private readonly ILogger _logger;
        private IMapper _mapper;
        private IPostService _postService;
        private IUserService _userService;

        /// <summary>
        /// Initializes a new instance of the <see cref="PostsController"/> class.
        /// </summary>
        /// <param name="accessLogService">The access log service.</param>
        /// <param name="postService">The post service.</param>
        /// <param name="userService">The user service.</param>
        /// <param name="mapper">The mapper.</param>
        /// <param name="appSettings">The application settings.</param>
        /// <param name="logger">The logger.</param>
        public PostsController(
            IAccessLogService accessLogService,
            IPostService postService,
            IUserService userService,
            IMapper mapper,
            IOptions<AppSettings> appSettings,
            ILogger<PostsController> logger)
        {
            _postService = postService;
            _userService = userService;
            _mapper = mapper;
            _appSettings = appSettings.Value;
            _logger = logger;
        }

        /// <summary>
        /// Deletes a post
        /// </summary>
        /// <returns>IActionResult</returns>
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            try
            {
                _postService.Delete(id);
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
        /// Returns a post by their slug
        /// </summary>
        /// <param name="slug">"string": the slug</param>
        /// <returns>IActionResult</returns>
        [AllowAnonymous]
        [HttpGet("{slug}")]
        public IActionResult Get(string slug)
        {
            try
            {
                var post = _postService.GetBySlug(slug);
                var postDto = _mapper.Map<PostDto>(post);
                return Ok(postDto);
            }
            catch (AppException ex)
            {
                _logger.LogError(ex, "Get/{postname} - AppException");
                return BadRequest(ex.Validation ? ex.Message : "");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Get/{postname} - Exception");
                return BadRequest();
            }
        }

        /// <summary>
        /// Creates a given post
        /// </summary>
        /// <param name="post">"PostDto": the post to create</param>
        /// <returns>IActionResult</returns>
        [HttpPost]
        public IActionResult Create([FromBody]PostDto post)
        {
            try
            {
                // Create
                var _post = _postService.Create(_mapper.Map<Post>(post));
                return Ok(Mapper.Map<PostDto>(_post));
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
        /// Updates a post
        /// </summary>
        /// <param name="post">"Setting": the data to update</param>
        /// <returns>IActionResult</returns>
        [HttpPut]
        public IActionResult Update([FromBody]PostDto post)
        {
            try
            {
                _postService.Update(_mapper.Map<Post>(post));
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
    }
}