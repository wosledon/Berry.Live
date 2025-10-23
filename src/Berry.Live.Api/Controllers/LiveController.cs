using Microsoft.AspNetCore.Mvc;
using Berry.Live.Api.Auth;

namespace Berry.Live.Api.Controllers;

public class LiveController: ApiControllerBase
{
    private readonly IConfiguration _configuration;
    private readonly IStreamKeyCache _streamKeyCache;

    public LiveController(IConfiguration configuration, IStreamKeyCache streamKeyCache)
    {
        _configuration = configuration;
        _streamKeyCache = streamKeyCache;
    }

    [HttpGet]
    public IActionResult Get(string userId)
    {
        var rtmpPort = _configuration.GetValue<int>("RtmpPort", 1935);

        // 生成并存储流密钥
        var streamKey = _streamKeyCache.GenerateAndStoreKey(userId);

        return Ok(new
        {
            StreamId = userId,
            StreamKey = streamKey,
            RtmpUrl = $"rtmp://{Request.Host.Host}:{rtmpPort}/live/{userId}?key={streamKey}",
            FlvUrl = $"http://{Request.Host.Host}/flv/live/{userId}.flv",
            WsFlvUrl = $"ws://{Request.Host.Host}/wsflv/live/{userId}.flv"
        });
    }
}