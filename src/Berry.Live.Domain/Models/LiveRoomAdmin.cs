using System;

namespace Berry.Live.Domain.Models;

public class LiveRoomAdmin
{
    public int Id { get; set; }
    public int LiveRoomId { get; set; }
    public int UserId { get; set; }
    public string Role { get; set; } = "admin"; // admin, moderator
    public DateTime AddedAt { get; set; } = DateTime.UtcNow;
    public int AddedByUserId { get; set; }
}
