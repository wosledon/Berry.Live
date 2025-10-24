using System;

namespace Berry.Live.Domain.Models;

public class LiveRoomFan
{
    public int Id { get; set; }
    public int LiveRoomId { get; set; }
    public int UserId { get; set; }
    public DateTime FollowedAt { get; set; } = DateTime.UtcNow;
    public bool IsActive { get; set; } = true;
}
