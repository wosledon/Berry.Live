namespace Berry.Live.Domain.Models;

public class User
{
    public int Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string? Nickname { get; set; }
    public string? AvatarUrl { get; set; }
    public int Level { get; set; } = 1;
    public int Points { get; set; } = 0;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }

    // 直播间关系
    public ICollection<LiveRoom> OwnedLiveRooms { get; set; } = new List<LiveRoom>();
    // 管理员和粉丝关系 - 通过服务查询获取
    // public ICollection<LiveRoomAdmin> AdminLiveRooms { get; set; } = new List<LiveRoomAdmin>();
    // public ICollection<LiveRoomFan> FollowedLiveRooms { get; set; } = new List<LiveRoomFan>();

    // 关注/粉丝关系（稍后实现）
    // public ICollection<User> Followers { get; set; } = new List<User>();
    // public ICollection<User> Following { get; set; } = new List<User>();
}