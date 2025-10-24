using Berry.Live.Application.Interfaces;
using Berry.Live.Domain.Models;
using Berry.Live.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Berry.Live.Application.Services;

public class LiveRoomService : ILiveRoomService
{
    private readonly ApplicationDbContext _context;

    public LiveRoomService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<LiveRoom?> GetLiveRoomByIdAsync(int id)
    {
        return await _context.LiveRooms.Include(r => r.Owner).FirstOrDefaultAsync(r => r.Id == id);
    }

    public async Task<LiveRoom?> GetLiveRoomByStreamKeyAsync(string streamKey)
    {
        return await _context.LiveRooms.Include(r => r.Owner).FirstOrDefaultAsync(r => r.StreamKey == streamKey);
    }

    public async Task<IEnumerable<LiveRoom>> GetLiveRoomsByOwnerAsync(int ownerId)
    {
        return await _context.LiveRooms.Where(r => r.OwnerId == ownerId).Include(r => r.Owner).ToListAsync();
    }

    public async Task<IEnumerable<LiveRoom>> GetAllLiveRoomsAsync()
    {
        return await _context.LiveRooms.Include(r => r.Owner).ToListAsync();
    }

    public async Task<IEnumerable<LiveRoom>> GetLiveRoomsAsync(bool? isLive = null, string? category = null)
    {
        var query = _context.LiveRooms.Include(r => r.Owner).AsQueryable();

        if (isLive.HasValue)
        {
            query = query.Where(r => r.IsLive == isLive.Value);
        }

        if (!string.IsNullOrEmpty(category))
        {
            query = query.Where(r => r.Category == category);
        }

        return await query.ToListAsync();
    }

    public async Task<LiveRoom> CreateLiveRoomAsync(int ownerId, string title, string? description, string? category, string? coverUrl)
    {
        var owner = await _context.Users.FindAsync(ownerId);
        if (owner == null) throw new KeyNotFoundException("用户不存在");

        var streamKey = GenerateStreamKey();

        var liveRoom = new LiveRoom
        {
            Title = title,
            Description = description,
            OwnerId = ownerId,
            Category = category,
            CoverUrl = coverUrl,
            StreamKey = streamKey
        };

        _context.LiveRooms.Add(liveRoom);
        await _context.SaveChangesAsync();

        return liveRoom;
    }

    public async Task UpdateLiveRoomAsync(int roomId, string? title, string? description, string? category, string? coverUrl)
    {
        var room = await GetLiveRoomByIdAsync(roomId);
        if (room == null) throw new KeyNotFoundException("直播间不存在");

        if (!string.IsNullOrEmpty(title)) room.Title = title;
        if (description != null) room.Description = description;
        if (category != null) room.Category = category;
        if (coverUrl != null) room.CoverUrl = coverUrl;

        await _context.SaveChangesAsync();
    }

    public async Task StartLiveAsync(int roomId)
    {
        var room = await GetLiveRoomByIdAsync(roomId);
        if (room == null) throw new KeyNotFoundException("直播间不存在");

        room.IsLive = true;
        room.StartedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
    }

    public async Task EndLiveAsync(int roomId)
    {
        var room = await GetLiveRoomByIdAsync(roomId);
        if (room == null) throw new KeyNotFoundException("直播间不存在");

        room.IsLive = false;
        room.EndedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
    }

    public async Task DeleteLiveRoomAsync(int roomId)
    {
        var room = await GetLiveRoomByIdAsync(roomId);
        if (room == null) throw new KeyNotFoundException("直播间不存在");

        _context.LiveRooms.Remove(room);
        await _context.SaveChangesAsync();
    }

    private string GenerateStreamKey()
    {
        return Guid.NewGuid().ToString("N");
    }

    // 管理员管理
    public async Task<IEnumerable<LiveRoomAdmin>> GetLiveRoomAdminsAsync(int roomId)
    {
        var admins = await _context.LiveRoomAdmins
            .Where(a => a.LiveRoomId == roomId)
            .OrderBy(a => a.AddedAt)
            .ToListAsync();

        // 手动加载用户数据
        var userIds = admins.Select(a => a.UserId).Concat(admins.Select(a => a.AddedByUserId)).Distinct().ToList();
        var users = await _context.Users.Where(u => userIds.Contains(u.Id)).ToDictionaryAsync(u => u.Id);

        foreach (var admin in admins)
        {
            // 手动设置导航属性（如果需要的话）
            // admin.User = users.GetValueOrDefault(admin.UserId);
            // admin.AddedByUser = users.GetValueOrDefault(admin.AddedByUserId);
        }

        return admins;
    }

    public async Task<LiveRoomAdmin> AddLiveRoomAdminAsync(int roomId, int userId, int addedByUserId, string role = "admin")
    {
        var room = await GetLiveRoomByIdAsync(roomId);
        if (room == null) throw new KeyNotFoundException("直播间不存在");

        var user = await _context.Users.FindAsync(userId);
        if (user == null) throw new KeyNotFoundException("用户不存在");

        var addedByUser = await _context.Users.FindAsync(addedByUserId);
        if (addedByUser == null) throw new KeyNotFoundException("添加者不存在");

        // 检查是否已经是管理员
        var existingAdmin = await _context.LiveRoomAdmins
            .FirstOrDefaultAsync(a => a.LiveRoomId == roomId && a.UserId == userId);

        if (existingAdmin != null)
        {
            throw new InvalidOperationException("该用户已经是管理员");
        }

        var admin = new LiveRoomAdmin
        {
            LiveRoomId = roomId,
            UserId = userId,
            Role = role,
            AddedByUserId = addedByUserId
        };

        _context.LiveRoomAdmins.Add(admin);
        await _context.SaveChangesAsync();

        return admin;
    }

    public async Task RemoveLiveRoomAdminAsync(int roomId, int userId)
    {
        var admin = await _context.LiveRoomAdmins
            .FirstOrDefaultAsync(a => a.LiveRoomId == roomId && a.UserId == userId);

        if (admin == null) throw new KeyNotFoundException("管理员不存在");

        _context.LiveRoomAdmins.Remove(admin);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateLiveRoomAdminRoleAsync(int roomId, int userId, string role)
    {
        var admin = await _context.LiveRoomAdmins
            .FirstOrDefaultAsync(a => a.LiveRoomId == roomId && a.UserId == userId);

        if (admin == null) throw new KeyNotFoundException("管理员不存在");

        admin.Role = role;
        await _context.SaveChangesAsync();
    }

    // 粉丝管理
    public async Task<IEnumerable<LiveRoomFan>> GetLiveRoomFansAsync(int roomId)
    {
        var fans = await _context.LiveRoomFans
            .Where(f => f.LiveRoomId == roomId && f.IsActive)
            .OrderByDescending(f => f.FollowedAt)
            .ToListAsync();

        // 手动加载用户数据
        var userIds = fans.Select(f => f.UserId).Distinct().ToList();
        var users = await _context.Users.Where(u => userIds.Contains(u.Id)).ToDictionaryAsync(u => u.Id);

        foreach (var fan in fans)
        {
            // 手动设置导航属性（如果需要的话）
            // fan.User = users.GetValueOrDefault(fan.UserId);
        }

        return fans;
    }

    public async Task<LiveRoomFan?> AddLiveRoomFanAsync(int roomId, int userId)
    {
        var room = await GetLiveRoomByIdAsync(roomId);
        if (room == null) throw new KeyNotFoundException("直播间不存在");

        var user = await _context.Users.FindAsync(userId);
        if (user == null) throw new KeyNotFoundException("用户不存在");

        // 检查是否已经是粉丝
        var existingFan = await _context.LiveRoomFans
            .FirstOrDefaultAsync(f => f.LiveRoomId == roomId && f.UserId == userId);

        if (existingFan != null)
        {
            if (!existingFan.IsActive)
            {
                existingFan.IsActive = true;
                existingFan.FollowedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();
            }
            return existingFan;
        }

        var fan = new LiveRoomFan
        {
            LiveRoomId = roomId,
            UserId = userId
        };

        _context.LiveRoomFans.Add(fan);
        await _context.SaveChangesAsync();

        return fan;
    }

    public async Task RemoveLiveRoomFanAsync(int roomId, int userId)
    {
        var fan = await _context.LiveRoomFans
            .FirstOrDefaultAsync(f => f.LiveRoomId == roomId && f.UserId == userId && f.IsActive);

        if (fan == null) throw new KeyNotFoundException("粉丝关系不存在");

        fan.IsActive = false;
        await _context.SaveChangesAsync();
    }

    public async Task<int> GetLiveRoomFanCountAsync(int roomId)
    {
        return await _context.LiveRoomFans
            .CountAsync(f => f.LiveRoomId == roomId && f.IsActive);
    }
}