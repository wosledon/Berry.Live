using System.Collections.Generic;
using System.Threading.Tasks;
using Berry.Live.Application.Interfaces;
using LiveStreamingServerNet.Networking.Contracts;
using LiveStreamingServerNet.Rtmp.Server.Auth;
using LiveStreamingServerNet.Rtmp.Server.Auth.Contracts;
using Microsoft.Extensions.DependencyInjection;

namespace Berry.Live.Api.Auth;

/// <summary>
/// RTMP流认证处理器
/// </summary>
public class RtmpAuthorizationHandler : IAuthorizationHandler
{
    private readonly IServiceProvider _serviceProvider;

    /// <summary>
    /// 构造函数
    /// </summary>
    /// <param name="serviceProvider">服务提供商</param>
    public RtmpAuthorizationHandler(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }

    /// <summary>
    /// 授权发布流
    /// </summary>
    /// <param name="client">客户端会话信息</param>
    /// <param name="streamPath">流路径</param>
    /// <param name="streamArguments">流参数</param>
    /// <param name="publishingType">发布类型</param>
    /// <returns>认证结果</returns>
    public async Task<AuthorizationResult> AuthorizePublishingAsync(
        ISessionInfo client,
        string streamPath,
        IReadOnlyDictionary<string, string> streamArguments,
        string publishingType)
    {
        // 从流路径中提取流密钥 (格式: /live/{streamKey})
        var streamKey = ExtractStreamIdFromPath(streamPath);
        if (string.IsNullOrEmpty(streamKey))
        {
            return AuthorizationResult.Unauthorized("Invalid stream path");
        }

        // 创建作用域来解析 Scoped 服务
        using (var scope = _serviceProvider.CreateScope())
        {
            var liveRoomService = scope.ServiceProvider.GetRequiredService<ILiveRoomService>();

            // 直接使用流密钥进行验证
            var liveRoom = await liveRoomService.GetLiveRoomByStreamKeyAsync(streamKey);
            if (liveRoom != null && liveRoom.StreamKey == streamKey)
            {
                return AuthorizationResult.Authorized();
            }
        }

        return AuthorizationResult.Unauthorized("Invalid stream key");
    }

    /// <summary>
    /// 授权订阅流
    /// </summary>
    /// <param name="client">客户端会话信息</param>
    /// <param name="streamPath">流路径</param>
    /// <param name="streamArguments">流参数</param>
    /// <returns>认证结果</returns>
    public Task<AuthorizationResult> AuthorizeSubscribingAsync(
        ISessionInfo client,
        string streamPath,
        IReadOnlyDictionary<string, string> streamArguments)
    {
        // 订阅流时允许所有人访问（可以根据需要添加订阅认证）
        return Task.FromResult(AuthorizationResult.Authorized());
    }

    /// <summary>
    /// 从流路径中提取流密钥
    /// </summary>
    /// <param name="streamPath">流路径 (格式: /live/{streamKey})</param>
    /// <returns>流密钥，如果无法提取则返回null</returns>
    private string? ExtractStreamIdFromPath(string streamPath)
    {
        // 路径格式: /live/{streamId}
        if (string.IsNullOrEmpty(streamPath))
            return null;

        var parts = streamPath.Trim('/').Split('/');
        if (parts.Length >= 2 && parts[0] == "live")
        {
            return parts[1];
        }

        return null;
    }
}