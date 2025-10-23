using System.Threading.Tasks;

namespace Berry.Live.Api.Auth;

/// <summary>
/// 流密钥验证器实现类
/// </summary>
public class StreamKeyValidator : IStreamKeyValidator
{
    private readonly IStreamKeyCache _streamKeyCache;

    /// <summary>
    /// 构造函数，注入流密钥缓存服务
    /// </summary>
    /// <param name="streamKeyCache">流密钥缓存服务</param>
    public StreamKeyValidator(IStreamKeyCache streamKeyCache)
    {
        _streamKeyCache = streamKeyCache;
    }

    /// <summary>
    /// 验证流ID和密钥的匹配关系
    /// </summary>
    /// <param name="streamId">流ID</param>
    /// <param name="streamKey">流密钥</param>
    /// <returns>验证结果</returns>
    public ValueTask<bool> ValidateStreamKey(string streamId, string streamKey)
    {
        return _streamKeyCache.ValidateStreamKey(streamId, streamKey);
    }
}