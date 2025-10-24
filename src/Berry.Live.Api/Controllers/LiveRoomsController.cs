using Berry.Live.Application.Interfaces;
using Berry.Live.Domain.Models;
using Microsoft.AspNetCore.Mvc;

namespace Berry.Live.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LiveRoomsController : ControllerBase
{
    private readonly ILiveRoomService _liveRoomService;

    public LiveRoomsController(ILiveRoomService liveRoomService)
    {
        _liveRoomService = liveRoomService;
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<LiveRoom>> GetLiveRoom(int id)
    {
        var room = await _liveRoomService.GetLiveRoomByIdAsync(id);
        if (room == null) return NotFound();
        return Ok(room);
    }

    [HttpGet("stream/{streamKey}")]
    public async Task<ActionResult<LiveRoom>> GetLiveRoomByStreamKey(string streamKey)
    {
        var room = await _liveRoomService.GetLiveRoomByStreamKeyAsync(streamKey);
        if (room == null) return NotFound();
        return Ok(room);
    }

    [HttpGet("owner/{ownerId}")]
    public async Task<ActionResult<IEnumerable<LiveRoom>>> GetLiveRoomsByOwner(int ownerId)
    {
        var rooms = await _liveRoomService.GetLiveRoomsByOwnerAsync(ownerId);
        return Ok(rooms);
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<LiveRoom>>> GetLiveRooms([FromQuery] bool? isLive, [FromQuery] string? category)
    {
        var rooms = await _liveRoomService.GetLiveRoomsAsync(isLive, category);
        return Ok(rooms);
    }

    [HttpPost]
    public async Task<ActionResult<LiveRoom>> CreateLiveRoom([FromBody] CreateLiveRoomRequest request)
    {
        try
        {
            var room = await _liveRoomService.CreateLiveRoomAsync(request.OwnerId, request.Title, request.Description, request.Category, request.CoverUrl);
            return CreatedAtAction(nameof(GetLiveRoom), new { id = room.Id }, room);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateLiveRoom(int id, [FromBody] UpdateLiveRoomRequest request)
    {
        try
        {
            await _liveRoomService.UpdateLiveRoomAsync(id, request.Title, request.Description, request.Category, request.CoverUrl);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }

    [HttpPost("{id}/start")]
    public async Task<IActionResult> StartLive(int id)
    {
        try
        {
            await _liveRoomService.StartLiveAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }

    [HttpPost("{id}/end")]
    public async Task<IActionResult> EndLive(int id)
    {
        try
        {
            await _liveRoomService.EndLiveAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteLiveRoom(int id)
    {
        try
        {
            await _liveRoomService.DeleteLiveRoomAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }
}

public record CreateLiveRoomRequest(int OwnerId, string Title, string? Description, string? Category, string? CoverUrl);
public record UpdateLiveRoomRequest(string? Title, string? Description, string? Category, string? CoverUrl);