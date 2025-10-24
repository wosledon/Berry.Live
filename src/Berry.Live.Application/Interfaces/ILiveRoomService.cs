using Berry.Live.Domain.Models;

namespace Berry.Live.Application.Interfaces;

public interface ILiveRoomService
{
    Task<LiveRoom?> GetLiveRoomByIdAsync(int id);
    Task<LiveRoom?> GetLiveRoomByStreamKeyAsync(string streamKey);
    Task<IEnumerable<LiveRoom>> GetLiveRoomsByOwnerAsync(int ownerId);
    Task<IEnumerable<LiveRoom>> GetAllLiveRoomsAsync();
    Task<IEnumerable<LiveRoom>> GetLiveRoomsAsync(bool? isLive = null, string? category = null);
    Task<LiveRoom> CreateLiveRoomAsync(int ownerId, string title, string? description, string? category, string? coverUrl);
    Task UpdateLiveRoomAsync(int roomId, string? title, string? description, string? category, string? coverUrl);
    Task StartLiveAsync(int roomId);
    Task EndLiveAsync(int roomId);
    Task DeleteLiveRoomAsync(int roomId);

    // 管理员管理
    Task<IEnumerable<LiveRoomAdmin>> GetLiveRoomAdminsAsync(int roomId);
    Task<LiveRoomAdmin> AddLiveRoomAdminAsync(int roomId, int userId, int addedByUserId, string role = "admin");
    Task RemoveLiveRoomAdminAsync(int roomId, int userId);
    Task UpdateLiveRoomAdminRoleAsync(int roomId, int userId, string role);

    // 粉丝管理
    Task<IEnumerable<LiveRoomFan>> GetLiveRoomFansAsync(int roomId);
    Task<LiveRoomFan?> AddLiveRoomFanAsync(int roomId, int userId);
    Task RemoveLiveRoomFanAsync(int roomId, int userId);
    Task<int> GetLiveRoomFanCountAsync(int roomId);
}