using LiveStreamingServerNet;
using LiveStreamingServerNet.AdminPanelUI;
using LiveStreamingServerNet.Flv.Installer;
using LiveStreamingServerNet.Standalone;
using LiveStreamingServerNet.Standalone.Installer;
using Microsoft.Extensions.FileProviders;
using Scalar.AspNetCore;
using System.Net;
using Berry.Live.Api.Auth;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

// 注册流密钥缓存服务
builder.Services.AddSingleton<IStreamKeyCache, StreamKeyCache>();

var rtmpPort = builder.Configuration.GetValue<int>("RtmpPort", 1935);

builder.Services.AddLiveStreamingServer(
    new IPEndPoint(IPAddress.Any, rtmpPort),
    options => {
        options
        .AddStandaloneServices()
        .AddFlv();

        // 注册流密钥缓存服务
        options.Services.AddSingleton<IStreamKeyCache, StreamKeyCache>();
        options.Services.AddSingleton<IStreamKeyValidator, StreamKeyValidator>();
        options.AddAuthorizationHandler<RtmpAuthorizationHandler>();
    }
);

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    
}

app.MapOpenApi();
app.MapScalarApiReference("/api");

app.MapControllers();

app.UseWebSockets();
app.UseWebSocketFlv();
app.UseHttpFlv();

app.MapStandaloneServerApiEndPoints();

static string? ResolveAdminPanelUiPath()
{
    var appUi = Path.Combine(AppContext.BaseDirectory, "admin-panel-ui");
    if (Directory.Exists(appUi)) return appUi;

    var asmDir = Path.GetDirectoryName(typeof(AdminPanelUIOptions).Assembly.Location);
    var versionDir = asmDir is null ? null : Directory.GetParent(asmDir)?.Parent?.FullName; // ...\0.31.1
    if (!string.IsNullOrEmpty(versionDir))
    {
        var pkgUi = Path.Combine(versionDir, "contentFiles", "any", "any", "admin-panel-ui");
        if (Directory.Exists(pkgUi)) return pkgUi;
    }

    return null;
}

var adminUiRoot = ResolveAdminPanelUiPath()
    ?? throw new InvalidOperationException("未找到 Admin Panel UI 静态资源目录，请将 'admin-panel-ui' 目录拷贝到程序目录，或手动指定有效的 FileProvider。");

app.UseAdminPanelUI(new AdminPanelUIOptions
{
    BasePath = "/ui",
    HasHttpFlvPreview = true,
    FileProvider = new PhysicalFileProvider(adminUiRoot)
});

await app.RunAsync();
