using AutoMapper;
using IAmRobert.Api.v1.Dtos;
using IAmRobert.Data.Models;

namespace IAmRobert.Api.Helpers
{
    /// <summary>
    /// AutoMapper Profile
    /// </summary>
    /// <seealso cref="AutoMapper.Profile" />
    public class AutoMapperProfile : Profile
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="AutoMapperProfile"/> class.
        /// </summary>
        public AutoMapperProfile()
        {
            CreateMap<User, UserDto>();
            CreateMap<UserDto, User>();

            CreateMap<User, UserBasicDto>();
            CreateMap<UserBasicDto, User>();

            CreateMap<Post, PostDto>();
            CreateMap<PostDto, Post>();
        }
    }
}