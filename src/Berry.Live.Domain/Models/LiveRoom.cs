namespace Berry.Live.Domain.Models;

public class LiveRoom
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int OwnerId { get; set; }
    public User? Owner { get; set; }
    public string? CoverUrl { get; set; }
    public string? Category { get; set; }
    public bool IsLive { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? StartedAt { get; set; }
    public DateTime? EndedAt { get; set; }
    public int ViewerCount { get; set; } = 0;

    // 流密钥（用于 RTMP 认证）
    public string StreamKey { get; set; } = string.Empty;

    // 管理员和粉丝关系 - 通过服务查询获取
    // public ICollection<LiveRoomAdmin> Admins { get; set; } = new List<LiveRoomAdmin>();
    // public ICollection<LiveRoomFan> Fans { get; set; } = new List<LiveRoomFan>();
}