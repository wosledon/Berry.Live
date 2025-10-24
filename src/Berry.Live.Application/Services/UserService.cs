using Berry.Live.Application.Interfaces;
using Berry.Live.Domain.Models;
using Berry.Live.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Berry.Live.Application.Services;

public class UserService : IUserService
{
    private readonly ApplicationDbContext _context;

    public UserService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<User?> GetUserByIdAsync(int id)
    {
        return await _context.Users.FindAsync(id);
    }

    public async Task<User?> GetUserByUsernameAsync(string username)
    {
        return await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
    }

    public async Task<User?> GetUserByEmailAsync(string email)
    {
        return await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
    }

    public async Task<IEnumerable<User>> GetAllUsersAsync()
    {
        return await _context.Users.ToListAsync();
    }

    public async Task<User> RegisterUserAsync(string username, string email, string password)
    {
        if (await GetUserByUsernameAsync(username) != null)
            throw new InvalidOperationException("用户名已存在");

        if (await GetUserByEmailAsync(email) != null)
            throw new InvalidOperationException("邮箱已存在");

        var passwordHash = BCrypt.Net.BCrypt.HashPassword(password);

        var user = new User
        {
            Username = username,
            Email = email,
            PasswordHash = passwordHash
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return user;
    }

    public async Task<bool> ValidatePasswordAsync(string username, string password)
    {
        var user = await GetUserByUsernameAsync(username);
        if (user == null) return false;

        return BCrypt.Net.BCrypt.Verify(password, user.PasswordHash);
    }

    public async Task UpdateUserProfileAsync(int userId, string? nickname, string? avatarUrl)
    {
        var user = await GetUserByIdAsync(userId);
        if (user == null) throw new KeyNotFoundException("用户不存在");

        if (!string.IsNullOrEmpty(nickname)) user.Nickname = nickname;
        if (!string.IsNullOrEmpty(avatarUrl)) user.AvatarUrl = avatarUrl;
        user.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
    }

    public async Task DeleteUserAsync(int userId)
    {
        var user = await GetUserByIdAsync(userId);
        if (user == null) throw new KeyNotFoundException("用户不存在");

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();
    }
}