using IAmRobert.Core.Services;
using IAmRobert.Data;
using IAmRobert.Data.Models;
using Xunit;

namespace IAmRobert.Tests
{
    public class UserTests
    {
        private readonly IUserService _userService;

        public UserTests()
        {
            var context = Helper.GetContext();

            var _ts = new UserTokenService(new Repository<UserToken>(context));
            _userService = new UserService(new Repository<User>(context), _ts, Helper.AppSettings());
        }

        [Fact]
        public User CanCreateUser()
        {
            var user = _userService.Create(new User() { Name = "Robert Holden", Username = "robert", Email = "rob.holden@live.co.uk" }, "password");

            Assert.NotNull(user);
            Assert.True(user.Id > 0);

            return user;
        }

        [Fact]
        public void CanLoginUser()
        {
            var user = _userService.GetByUsername("robert");
            if (user == null) user = CanCreateUser();

            user = _userService.Login(user.Username, "password");

            Assert.NotNull(user);
        }

        [Fact]
        public void CanUpdateUser()
        {
            var user = _userService.GetByUsername("robert");
            if (user == null) user = CanCreateUser();

            user.Name = "Updated";
            _userService.Update(user);

            user = _userService.GetByUsername(user.Username);

            Assert.NotNull(user);
            Assert.True(user.Name == "Updated");
        }
    }
}