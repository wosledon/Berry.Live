using Microsoft.AspNetCore.Mvc;
using Berry.Live.Application.Interfaces;
using Berry.Live.Domain.Models;

namespace Berry.Live.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LiveRoomAdminsController : ControllerBase
{
    private readonly ILiveRoomService _liveRoomService;

    public LiveRoomAdminsController(ILiveRoomService liveRoomService)
    {
        _liveRoomService = liveRoomService;
    }

    // GET: api/LiveRoomAdmins/{roomId}
    [HttpGet("{roomId}")]
    public async Task<IActionResult> GetAdmins(int roomId)
    {
        try
        {
            var admins = await _liveRoomService.GetLiveRoomAdminsAsync(roomId);
            return Ok(admins);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    // POST: api/LiveRoomAdmins
    [HttpPost]
    public async Task<IActionResult> AddAdmin([FromBody] AddAdminRequest request)
    {
        try
        {
            var admin = await _liveRoomService.AddLiveRoomAdminAsync(
                request.RoomId,
                request.UserId,
                request.AddedByUserId,
                request.Role);

            return CreatedAtAction(nameof(GetAdmins), new { roomId = request.RoomId }, admin);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    // DELETE: api/LiveRoomAdmins/{roomId}/{userId}
    [HttpDelete("{roomId}/{userId}")]
    public async Task<IActionResult> RemoveAdmin(int roomId, int userId)
    {
        try
        {
            await _liveRoomService.RemoveLiveRoomAdminAsync(roomId, userId);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    // PUT: api/LiveRoomAdmins/{roomId}/{userId}/role
    [HttpPut("{roomId}/{userId}/role")]
    public async Task<IActionResult> UpdateAdminRole(int roomId, int userId, [FromBody] UpdateRoleRequest request)
    {
        try
        {
            await _liveRoomService.UpdateLiveRoomAdminRoleAsync(roomId, userId, request.Role);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }
}

public class AddAdminRequest
{
    public int RoomId { get; set; }
    public int UserId { get; set; }
    public int AddedByUserId { get; set; }
    public string Role { get; set; } = "admin";
}

public class UpdateRoleRequest
{
    public string Role { get; set; } = "admin";
}