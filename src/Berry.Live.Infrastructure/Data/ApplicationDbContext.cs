using Microsoft.EntityFrameworkCore;
using Berry.Live.Domain.Models;

namespace Berry.Live.Infrastructure.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    public DbSet<Berry.Live.Domain.Models.User> Users { get; set; }
    public DbSet<Berry.Live.Domain.Models.LiveRoom> LiveRooms { get; set; }
    public DbSet<Berry.Live.Domain.Models.LiveRoomAdmin> LiveRoomAdmins { get; set; }
    public DbSet<Berry.Live.Domain.Models.LiveRoomFan> LiveRoomFans { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // 配置 User 实体
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(u => u.Id);
            entity.Property(u => u.Username).IsRequired().HasMaxLength(50);
            entity.Property(u => u.Email).IsRequired().HasMaxLength(100);
            entity.Property(u => u.PasswordHash).IsRequired();
            entity.Property(u => u.Nickname).HasMaxLength(50);
            entity.Property(u => u.AvatarUrl).HasMaxLength(200);
            entity.Property(u => u.Level).HasDefaultValue(1);
            entity.Property(u => u.Points).HasDefaultValue(0);
            entity.HasIndex(u => u.Username).IsUnique();
            entity.HasIndex(u => u.Email).IsUnique();
        });

        // 配置 LiveRoom 实体
        modelBuilder.Entity<LiveRoom>(entity =>
        {
            entity.HasKey(r => r.Id);
            entity.Property(r => r.Title).IsRequired().HasMaxLength(200);
            entity.Property(r => r.Description).HasMaxLength(1000);
            entity.Property(r => r.CoverUrl).HasMaxLength(500);
            entity.Property(r => r.Category).HasMaxLength(50);
            entity.Property(r => r.StreamKey).IsRequired().HasMaxLength(100);
            entity.HasOne(r => r.Owner).WithMany().HasForeignKey(r => r.OwnerId);
            entity.HasIndex(r => r.StreamKey).IsUnique();
        });

        // 配置 LiveRoomAdmin 实体
        modelBuilder.Entity<LiveRoomAdmin>(entity =>
        {
            entity.HasKey(a => a.Id);
            entity.Property(a => a.Role).IsRequired().HasMaxLength(20);
            entity.HasOne<LiveRoom>().WithMany().HasForeignKey(a => a.LiveRoomId).OnDelete(DeleteBehavior.Cascade);
            entity.HasOne<User>().WithMany().HasForeignKey(a => a.UserId).OnDelete(DeleteBehavior.Cascade);
            entity.HasOne<User>().WithMany().HasForeignKey(a => a.AddedByUserId).OnDelete(DeleteBehavior.Restrict);
            entity.HasIndex(a => new { a.LiveRoomId, a.UserId }).IsUnique();
        });

        // 配置 LiveRoomFan 实体
        modelBuilder.Entity<LiveRoomFan>(entity =>
        {
            entity.HasKey(f => f.Id);
            entity.Property(f => f.IsActive).HasDefaultValue(true);
            entity.HasOne<LiveRoom>().WithMany().HasForeignKey(f => f.LiveRoomId).OnDelete(DeleteBehavior.Cascade);
            entity.HasOne<User>().WithMany().HasForeignKey(f => f.UserId).OnDelete(DeleteBehavior.Cascade);
            entity.HasIndex(f => new { f.LiveRoomId, f.UserId }).IsUnique();
        });
    }
}