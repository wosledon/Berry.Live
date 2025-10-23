using System;
using System.Collections.Concurrent;
using System.Threading.Tasks;

namespace Berry.Live.Api.Auth;

/// <summary>
/// 流密钥缓存服务接口
/// </summary>
public interface IStreamKeyCache
{
    /// <summary>
    /// 生成新的流密钥并与流ID关联
    /// </summary>
    /// <param name="streamId">流ID</param>
    /// <returns>生成的流密钥</returns>
    string GenerateAndStoreKey(string streamId);

    /// <summary>
    /// 验证流ID和密钥的匹配关系
    /// </summary>
    /// <param name="streamId">流ID</param>
    /// <param name="streamKey">流密钥</param>
    /// <returns>验证结果</returns>
    ValueTask<bool> ValidateStreamKey(string streamId, string streamKey);

    /// <summary>
    /// 移除流密钥（流结束时调用）
    /// </summary>
    /// <param name="streamId">流ID</param>
    void RemoveKey(string streamId);
}

/// <summary>
/// 流密钥缓存服务实现类
/// </summary>
public class StreamKeyCache : IStreamKeyCache
{
    private readonly ConcurrentDictionary<string, string> _streamKeyMap = new();

    /// <summary>
    /// 生成新的流密钥并与流ID关联
    /// </summary>
    /// <param name="streamId">流ID</param>
    /// <returns>生成的流密钥</returns>
    public string GenerateAndStoreKey(string streamId)
    {
        // 生成唯一的流密钥
        var streamKey = Guid.NewGuid().ToString("N");

        // 存储映射关系，如果已存在则更新
        _streamKeyMap[streamId] = streamKey;

        return streamKey;
    }

    /// <summary>
    /// 验证流ID和密钥的匹配关系
    /// </summary>
    /// <param name="streamId">流ID</param>
    /// <param name="streamKey">流密钥</param>
    /// <returns>验证结果</returns>
    public ValueTask<bool> ValidateStreamKey(string streamId, string streamKey)
    {
        // 检查映射是否存在且匹配
        return ValueTask.FromResult(
            _streamKeyMap.TryGetValue(streamId, out var storedKey) &&
            storedKey == streamKey
        );
    }

    /// <summary>
    /// 移除流密钥（流结束时调用）
    /// </summary>
    /// <param name="streamId">流ID</param>
    public void RemoveKey(string streamId)
    {
        _streamKeyMap.TryRemove(streamId, out _);
    }
}