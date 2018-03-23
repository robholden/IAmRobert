using AutoMapper;
using IAmRobert.Api.v1.Dtos;
using IAmRobert.Core;
using IAmRobert.Core.Services;
using IAmRobert.Data.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;

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
        private IPostService _userService;

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
            IPostService userService,
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
        /// Deletes the specified slug.
        /// </summary>
        /// <param name="slug">The slug.</param>
        /// <returns></returns>
        [HttpDelete("{slug}")]
        public IActionResult Delete(string slug)
        {
            try
            {
                _postService.Delete(slug);
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
                if (post == null) throw new AppException("Cannot find post");

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
        /// Returns posts from provided search criteria
        /// </summary>
        /// <param name="value">"string": a value to search</param>
        /// <param name="orderBy">"string": the order to order by</param>
        /// <param name="orderDir">"string": the order direction to order by</param>
        /// <param name="page">"int": the page number</param>
        /// <returns>IActionResult</returns>
        [AllowAnonymous]
        [HttpGet]
        public IActionResult Search(string value = "", string orderBy = "", string orderDir = "", int page = 1)
        {
            try
            {
                // Create where clause
                Func<Post, bool> where = new Func<Post, bool>(x => x.Heading.ToLower().Contains((value ?? "").ToLower()));

                // Return in given order
                Func<Post, DateTime> order = null;
                switch ((orderBy ?? "").ToLower())
                {
                    case "creationdate":
                        order = new Func<Post, DateTime>(x => x.CreationDate);
                        break;

                    case "modifieddate":
                        order = new Func<Post, DateTime>(x => x.ModifiedDate);
                        break;
                }

                var posts = _postService.Search(where, order, orderDir ?? "", page);
                return Ok(_mapper.Map<IList<PostDto>>(posts));
            }
            catch (AppException ex)
            {
                _logger.LogError(ex, "Search - AppException");
                return BadRequest(ex.Validation ? ex.Message : "");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Search - Exception");
                return BadRequest();
            }
        }

        /// <summary>
        /// Updates the specified post with a given slug.
        /// </summary>
        /// <param name="slug">The slug.</param>
        /// <param name="post">The post.</param>
        /// <returns></returns>
        [HttpPut]
        public IActionResult Update(string slug, [FromBody]PostDto post)
        {
            try
            {
                var _post = _postService.GetBySlug(slug);
                _post = _postService.Update(_post.Id, _mapper.Map<Post>(post));

                return Ok(Mapper.Map<PostDto>(_post));
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