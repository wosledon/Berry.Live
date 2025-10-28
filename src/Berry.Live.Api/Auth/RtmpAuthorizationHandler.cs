using System.Collections.Generic;
using System.Threading.Tasks;
using LiveStreamingServerNet.Networking.Contracts;
using LiveStreamingServerNet.Rtmp.Server.Auth;
using LiveStreamingServerNet.Rtmp.Server.Auth.Contracts;

namespace Berry.Live.Api.Auth;

/// <summary>
/// RTMP流认证处理器
/// </summary>
public class RtmpAuthorizationHandler : IAuthorizationHandler
{
    private readonly IStreamKeyValidator _streamKeyValidator;

    /// <summary>
    /// 构造函数
    /// </summary>
    /// <param name="streamKeyValidator">流密钥验证器</param>
    public RtmpAuthorizationHandler(IStreamKeyValidator streamKeyValidator)
    {
        _streamKeyValidator = streamKeyValidator;
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
        // 从流路径中提取流ID (格式: /live/{streamId})
        var streamId = ExtractStreamIdFromPath(streamPath);
        if (string.IsNullOrEmpty(streamId))
        {
            return AuthorizationResult.Unauthorized("Invalid stream path");
        }

        // // 检查流参数中是否包含streamKey
        // if (streamArguments.TryGetValue("streamKey", out var streamKey))
        // {
        //     // 验证流ID和密钥的匹配关系
        //     if (await _streamKeyValidator.ValidateStreamKey(streamId, streamKey))
        //     {
        //         return AuthorizationResult.Authorized();
        //     }
        // }

        // return AuthorizationResult.Unauthorized("Invalid stream key");

        return AuthorizationResult.Authorized();
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
    /// 从流路径中提取流ID
    /// </summary>
    /// <param name="streamPath">流路径 (格式: /live/{streamId})</param>
    /// <returns>流ID，如果无法提取则返回null</returns>
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