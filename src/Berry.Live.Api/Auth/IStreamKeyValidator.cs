using System.Threading.Tasks;

namespace Berry.Live.Api.Auth;

/// <summary>
/// 流密钥验证器接口
/// </summary>
public interface IStreamKeyValidator
{
    /// <summary>
    /// 验证流ID和密钥的匹配关系
    /// </summary>
    /// <param name="streamId">流ID</param>
    /// <param name="streamKey">流密钥</param>
    /// <returns>验证结果</returns>
    ValueTask<bool> ValidateStreamKey(string streamId, string streamKey);
}