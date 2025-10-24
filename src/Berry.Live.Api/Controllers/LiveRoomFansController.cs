using Microsoft.AspNetCore.Mvc;
using Berry.Live.Application.Interfaces;
using Berry.Live.Domain.Models;

namespace Berry.Live.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LiveRoomFansController : ControllerBase
{
    private readonly ILiveRoomService _liveRoomService;

    public LiveRoomFansController(ILiveRoomService liveRoomService)
    {
        _liveRoomService = liveRoomService;
    }

    // GET: api/LiveRoomFans/{roomId}
    [HttpGet("{roomId}")]
    public async Task<IActionResult> GetFans(int roomId)
    {
        try
        {
            var fans = await _liveRoomService.GetLiveRoomFansAsync(roomId);
            return Ok(fans);
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

    // POST: api/LiveRoomFans
    [HttpPost]
    public async Task<IActionResult> AddFan([FromBody] AddFanRequest request)
    {
        try
        {
            var fan = await _liveRoomService.AddLiveRoomFanAsync(request.RoomId, request.UserId);
            return CreatedAtAction(nameof(GetFans), new { roomId = request.RoomId }, fan);
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

    // DELETE: api/LiveRoomFans/{roomId}/{userId}
    [HttpDelete("{roomId}/{userId}")]
    public async Task<IActionResult> RemoveFan(int roomId, int userId)
    {
        try
        {
            await _liveRoomService.RemoveLiveRoomFanAsync(roomId, userId);
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

    // GET: api/LiveRoomFans/{roomId}/count
    [HttpGet("{roomId}/count")]
    public async Task<IActionResult> GetFanCount(int roomId)
    {
        try
        {
            var count = await _liveRoomService.GetLiveRoomFanCountAsync(roomId);
            return Ok(new { roomId, fanCount = count });
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

public class AddFanRequest
{
    public int RoomId { get; set; }
    public int UserId { get; set; }
}