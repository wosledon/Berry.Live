using Berry.Live.Domain.Models;

namespace Berry.Live.Application.Interfaces;

public interface IUserService
{
    Task<User?> GetUserByIdAsync(int id);
    Task<User?> GetUserByUsernameAsync(string username);
    Task<User?> GetUserByEmailAsync(string email);
    Task<IEnumerable<User>> GetAllUsersAsync();
    Task<User> RegisterUserAsync(string username, string email, string password);
    Task<bool> ValidatePasswordAsync(string username, string password);
    Task UpdateUserProfileAsync(int userId, string? nickname, string? avatarUrl);
    Task DeleteUserAsync(int userId);
}