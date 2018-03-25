using IAmRobert.Core;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;
using SixLabors.ImageSharp.Processing.Transforms;

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
    public class FilesController : Controller
    {
        private readonly AppSettings _appSettings;
        private readonly ILogger _logger;

        /// <summary>
        /// Initializes a new instance of the <see cref="FilesController"/> class.
        /// </summary>
        /// <param name="appSettings">The application settings.</param>
        /// <param name="logger">The logger.</param>
        public FilesController(
            IOptions<AppSettings> appSettings,
            ILogger<FilesController> logger)
        {
            _appSettings = appSettings.Value;
            _logger = logger;
        }

        /// <summary>
        /// Deletes the specified name.
        /// </summary>
        /// <param name="name">The name.</param>
        /// <returns></returns>
        [HttpDelete]
        [Route("{name}")]
        public IActionResult Delete(string name)
        {
            try
            {
                var path = Path.Combine(_appSettings.FilePath, name);
                if (System.IO.File.Exists(path)) System.IO.File.Delete(path);
                return Ok();
            }
            catch (AppException ex)
            {
                _logger.LogError(ex, "Delete - AppException");
                return BadRequest(ex.Validation ? ex.Message : "");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Delete - Exception");
                return BadRequest();
            }
        }

        /// <summary>
        /// Returns all files
        /// </summary>
        /// <returns>IActionResult</returns>
        [HttpGet]
        [AllowAnonymous]
        public IActionResult Get()
        {
            try
            {
                var files = Directory.GetFiles(_appSettings.FilePath, "*", SearchOption.AllDirectories);
                return Ok(files.Select(x => x.Replace(_appSettings.FilePath, "")).ToList());
            }
            catch (AppException ex)
            {
                _logger.LogError(ex, "Get - AppException");
                return BadRequest(ex.Validation ? ex.Message : "");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Get - Exception");
                return BadRequest();
            }
        }

        /// <summary>
        /// Uploads the specified files.
        /// </summary>
        /// <param name="files">The files.</param>
        /// <returns></returns>
        /// <exception cref="AppException">Please upload a picture - true</exception>
        [HttpPost]
        public IActionResult Upload(IList<IFormFile> files)
        {
            try
            {
                if (files.Count == 0 || files[0].Length == 0)
                    throw new AppException("Please upload a picture", true);

                foreach (var file in files)
                {
                    var ext = Path.GetExtension(file.FileName).ToLower();
                    var validExts = new string[] { ".jpg", ".png" };
                    if (!validExts.Contains(ext)) continue;

                    byte[] bytes = null;
                    BinaryReader reader = new BinaryReader(file.OpenReadStream());
                    bytes = reader.ReadBytes((int)file.Length);

                    try
                    {
                        var path = Path.Combine(_appSettings.FilePath, Guid.NewGuid().ToString() + ext);
                        using (var image = Image.Load(bytes))
                        {
                            // Make sure file extension is valid
                            string[] exts = new string[] { ".jpg", ".jpeg,", ".png" };
                            if (!exts.Contains(ext)) continue;

                            // Fixed orientation
                            image.Mutate(x => x.AutoOrient());

                            // Save picture
                            image.Save(path);
                        }
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError("File Upload Failed", ex);
                    }
                }

                return Ok();
            }
            catch (AppException ex)
            {
                _logger.LogError(ex, "Upload - AppException");
                return BadRequest(ex.Validation ? ex.Message : "");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Upload - Exception");
                return BadRequest();
            }
        }
    }
}