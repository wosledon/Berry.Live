using System.Net;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Http;
using Berry.Live.Api.Auth;

namespace Berry.Live.Api.Auth;

/// <summary>
/// FLV流鉴权中间件
/// </summary>
public class FlvAuthorizationMiddleware
{
    private readonly RequestDelegate _next;
    private readonly IStreamKeyValidator _streamKeyValidator;

    /// <summary>
    /// 构造函数
    /// </summary>
    /// <param name="next">下一个中间件</param>
    /// <param name="streamKeyValidator">流密钥验证器</param>
    public FlvAuthorizationMiddleware(RequestDelegate next, IStreamKeyValidator streamKeyValidator)
    {
        _next = next;
        _streamKeyValidator = streamKeyValidator;
    }

    /// <summary>
    /// 中间件处理逻辑
    /// </summary>
    /// <param name="context">HTTP上下文</param>
    public async Task InvokeAsync(HttpContext context)
    {
        var path = context.Request.Path.Value;

        // 检查路径是否为空
        if (string.IsNullOrEmpty(path))
        {
            await _next(context);
            return;
        }

        // 检查是否是FLV请求路径 (HTTP-FLV 或 WS-FLV)
        if (IsFlvRequest(path))
        {
            var streamId = ExtractStreamIdFromPath(path);
            if (string.IsNullOrEmpty(streamId))
            {
                context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                await context.Response.WriteAsync("Invalid stream path");
                return;
            }

            // 检查查询参数中是否包含key
            if (!context.Request.Query.TryGetValue("key", out var streamKey) || string.IsNullOrEmpty(streamKey))
            {
                context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                await context.Response.WriteAsync("Stream key is required");
                return;
            }

            // 验证流密钥
            if (!await _streamKeyValidator.ValidateStreamKey(streamId, streamKey!))
            {
                context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                await context.Response.WriteAsync("Invalid stream key");
                return;
            }
        }

        // 继续处理下一个中间件
        await _next(context);
    }

    /// <summary>
    /// 检查是否是FLV请求路径
    /// </summary>
    /// <param name="path">请求路径</param>
    /// <returns>是否是FLV请求</returns>
    private bool IsFlvRequest(string path)
    {
        // 匹配 /live/{streamId}.flv 格式
        return Regex.IsMatch(path, @"^/live/[^/]+\.flv$", RegexOptions.IgnoreCase);
    }

    /// <summary>
    /// 从路径中提取流ID
    /// </summary>
    /// <param name="path">请求路径</param>
    /// <returns>流ID</returns>
    private string? ExtractStreamIdFromPath(string path)
    {
        // 从 /live/{streamId}.flv 中提取 {streamId}
        var match = Regex.Match(path, @"^/live/([^/]+)\.flv$", RegexOptions.IgnoreCase);
        return match.Success ? match.Groups[1].Value : null;
    }
}