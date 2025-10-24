using Berry.Live.Application.Interfaces;
using Berry.Live.Domain.Models;
using Microsoft.AspNetCore.Mvc;

namespace Berry.Live.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;

    public UsersController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<User>> GetUser(int id)
    {
        var user = await _userService.GetUserByIdAsync(id);
        if (user == null) return NotFound();
        return Ok(user);
    }

    [HttpGet("by-username/{username}")]
    public async Task<ActionResult<User>> GetUserByUsername(string username)
    {
        var user = await _userService.GetUserByUsernameAsync(username);
        if (user == null) return NotFound();
        return Ok(user);
    }

    [HttpPost("register")]
    public async Task<ActionResult<User>> Register([FromBody] RegisterRequest request)
    {
        try
        {
            var user = await _userService.RegisterUserAsync(request.Username, request.Email, request.Password);
            return CreatedAtAction(nameof(GetUser), new { id = user.Id }, user);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost("login")]
    public async Task<ActionResult> Login([FromBody] LoginRequest request)
    {
        var isValid = await _userService.ValidatePasswordAsync(request.Username, request.Password);
        if (!isValid) return Unauthorized("用户名或密码错误");

        // 简单返回成功，实际应用中应返回 JWT token
        return Ok(new { Message = "登录成功" });
    }

    [HttpPut("{id}/profile")]
    public async Task<IActionResult> UpdateProfile(int id, [FromBody] UpdateProfileRequest request)
    {
        try
        {
            await _userService.UpdateUserProfileAsync(id, request.Nickname, request.AvatarUrl);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        try
        {
            await _userService.DeleteUserAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }
}

public record RegisterRequest(string Username, string Email, string Password);
public record LoginRequest(string Username, string Password);
public record UpdateProfileRequest(string? Nickname, string? AvatarUrl);