using Microsoft.AspNetCore.Mvc;

namespace Berry.Live.Api.Controllers;

[ApiController]
[Route("api/v1/controller/[action]")]
public class ApiControllerBase :  ControllerBase
{
}


public class LiveController: ApiControllerBase
{
    private readonly IConfiguration _configuration;

    public LiveController(IConfiguration configuration)
    {
        _configuration = configuration;
    }
    [HttpGet]
    public IActionResult Get(string userId)
    {
        var rtmpPort = _configuration.GetValue<int>("RtmpPort", 1935);

        return Ok(new
        {
            RtmpUrl = $"rtmp://{Request.Host.Host}:{rtmpPort}/live/{userId}",
            FlvUrl = $"http://{Request.Host.Host}/flv/live/{userId}.flv",
            WsFlvUrl = $"ws://{Request.Host.Host}/wsflv/live/{userId}.flv"
        });
    }
}