using IAmRobert.Core.Services;
using IAmRobert.Data;
using IAmRobert.Data.Models;
using Xunit;

namespace IAmRobert.Tests
{
    public class PostTests
    {
        private readonly IPostService _postService;

        public PostTests()
        {
            var context = Helper.GetContext();
            _postService = new PostService(new Repository<Post>(context), Helper.AppSettings());
        }

        [Fact]
        public Post CanCreatePost()
        {
            var post = _postService.Create(new Post()
            {
                Heading = "Test Heading",
                Blurb = "Test Blurb",
                Body = "Test Body",
                Slug = "Test",
                UserId = 1
            });

            Assert.NotNull(post);
            Assert.True(post.Id > 0);

            return post;
        }

        [Fact]
        public void CanDeletePost()
        {
            var post = UpdateOrCreatePost();

            _postService.Delete(post.Id);
            post = _postService.GetBySlug("Test");

            Assert.Null(post);
        }

        [Fact]
        public void CanSearchPosts()
        {
            var post = UpdateOrCreatePost();
            var posts = _postService.Search(
                new System.Func<Post, bool>(x => x.Id > 0),
                new System.Func<Post, System.DateTime>(x => x.CreationDate),
                "desc",
                0
            );

            Assert.True(posts.Count > 0);
        }

        [Fact]
        public void CanUpdatePost()
        {
            var post = _postService.GetBySlug("Test");
            if (post == null) post = CanCreatePost();

            post.Heading = "Updated";
            _postService.Update(post.Id, post);

            post = _postService.GetBySlug(post.Slug);

            Assert.NotNull(post);
            Assert.True(post.Heading == "Updated");
        }

        /// <summary>
        /// Updates the or create post.
        /// </summary>
        /// <returns></returns>
        private Post UpdateOrCreatePost()
        {
            var post = _postService.GetBySlug("Test");
            if (post == null) post = CanCreatePost();

            return post;
        }
    }
}