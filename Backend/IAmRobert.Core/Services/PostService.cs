using IAmRobert.Data;
using IAmRobert.Data.Models;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;

namespace IAmRobert.Core.Services
{
    /// <summary>
    /// Interface for Post Service
    /// </summary>
    public interface IPostService
    {
        /// <summary>
        /// Creates a given post
        /// </summary>
        /// <param name="post">"Post": the post to create</param>
        /// <returns>Post</returns>
        Post Create(Post post);

        /// <summary>
        /// Deletes a post with a given id
        /// </summary>
        /// <param name="id">"int": the post id</param>
        void Delete(int id);

        /// <summary>
        /// Returns a post with a given id
        /// </summary>
        /// <param name="id">"int": the post id</param>
        /// <returns>Post</returns>
        Post GetById(int id);

        /// <summary>
        /// Returns a post with a given slug
        /// </summary>
        /// <param name="slug">"string": the slug</param>
        /// <returns>User</returns>
        Post GetBySlug(string slug);

        /// <summary>
        /// Searches the specified where.
        /// </summary>
        /// <param name="where">The where.</param>
        /// <param name="order">The order.</param>
        /// <param name="orderDir">The order dir.</param>
        /// <param name="page">The page.</param>
        /// <returns></returns>
        IList<Post> Search(Func<Post, bool> where = null, Func<Post, DateTime> order = null, string orderDir = "", int page = 1);

        /// <summary>
        /// Updates the specified post.
        /// </summary>
        /// <param name="post">The post.</param>
        /// <returns></returns>
        Post Update(Post post);
    }

    /// <summary>
    /// Core class that handles Post crud operations and other business logic
    /// </summary>
    public class PostService : IPostService
    {
        private readonly AppSettings _appSettings;
        private readonly IRepository<Post> _repo;

        /// <summary>
        /// Initializes a new instance of the <see cref="PostService"/> class.
        /// </summary>
        /// <param name="repo">The repo.</param>
        /// <param name="appSettings">The application settings.</param>
        public PostService(
            IRepository<Post> repo,
            IOptions<AppSettings> appSettings)
        {
            _repo = repo;
            _appSettings = appSettings.Value;
        }

        /// <summary>
        /// Creates a given post
        /// </summary>
        /// <param name="post">"Post": the post to create</param>
        /// <returns>Post</returns>
        public Post Create(Post post)
        {
            // Create new object to ensure properties aren't tampered with
            post = new Post()
            {
                Heading = post.Heading,
                Blurb = post.Blurb,
                Body = post.Body,
                Slug = post.Slug,
                User = post.User
            };

            // Validation
            var error = Validate(post, true);
            if (!string.IsNullOrWhiteSpace(error)) throw new AppException(error, true);

            // Create post
            return _repo.Create(post);
        }

        /// <summary>
        /// Deletes a post with a given id
        /// </summary>
        /// <param name="id">"int": the post id</param>
        public void Delete(int id)
        {
            _repo.Delete(GetById(id));
        }

        /// <summary>
        /// Returns a post with a given id
        /// </summary>
        /// <param name="id">"int": the post id</param>
        /// <returns>Post</returns>
        public Post GetById(int id)
        {
            return _repo.Find(x => x.Id == id);
        }

        /// <summary>
        /// Returns a post with a given slug
        /// </summary>
        /// <param name="slug">"string": the slug</param>
        /// <returns>Post</returns>
        public Post GetBySlug(string slug)
        {
            return _repo.FindOne(x => x.Slug.ToLower() == slug.ToLower());
        }

        /// <summary>
        /// Searches the specified where.
        /// </summary>
        /// <param name="where">The where.</param>
        /// <param name="order">The order.</param>
        /// <param name="orderDir">The order dir.</param>
        /// <param name="page">The page.</param>
        /// <returns></returns>
        public IList<Post> Search(Func<Post, bool> where = null, Func<Post, DateTime> order = null, string orderDir = "", int page = 1)
        {
            if (where == null) where = new Func<Post, bool>(x => x.Id > 0);
            if (order == null) order = new Func<Post, DateTime>(x => x.CreationDate);

            var items = _repo.Items().Where(where);

            if (orderDir.ToLower() == "asc") items = items.OrderBy(order);
            else if (orderDir.ToLower() == "desc") items = items.OrderByDescending(order);

            return items.Skip((page - 1) * 10)
                        .Take(10)
                        .ToList();
        }

        /// <summary>
        /// Updates the specified post.
        /// </summary>
        /// <param name="post">The post.</param>
        /// <returns></returns>
        /// <exception cref="AppException">
        /// Post not found
        /// or
        /// true
        /// </exception>
        public Post Update(Post post)
        {
            // Get post
            var _post = GetById(post.Id);
            if (_post == null)
            {
                _post = GetBySlug(post.Slug);
                if (_post == null) throw new AppException("Post not found");
            }

            // Validate
            var error = Validate(post, post.Slug != _post.Slug);
            if (!string.IsNullOrWhiteSpace(error)) throw new AppException(error, true);

            // Update post properties
            _post.Heading = post.Heading;
            _post.Blurb = post.Blurb;
            _post.Body = post.Body;
            _post.ModifiedDate = DateTime.Now;

            _repo.Update(_post);
            return _post;
        }

        /// <summary>
        /// Validates the specified post.
        /// </summary>
        /// <param name="post">The post.</param>
        /// <param name="checkUniqueSlug">if set to <c>true</c> [check unique slug].</param>
        /// <returns></returns>
        /// <exception cref="AppException">Slug is in use - true</exception>
        private string Validate(Post post, bool checkUniqueSlug)
        {
            if (string.IsNullOrWhiteSpace(post.Heading)) return "Heading is required";
            if (string.IsNullOrWhiteSpace(post.Blurb)) return "Blurb is required";
            if (string.IsNullOrWhiteSpace(post.Body)) return "Body is required";
            if (string.IsNullOrWhiteSpace(post.Slug)) return "Slug is required";

            // Ensure postname is unique?
            if (checkUniqueSlug && GetBySlug(post.Slug) != null)
            {
                throw new AppException("Slug is in use", true);
            }

            return "";
        }
    }
}