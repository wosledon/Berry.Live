using LiveStreamingServerNet;
using LiveStreamingServerNet.AdminPanelUI;
using LiveStreamingServerNet.Flv.Installer;
using LiveStreamingServerNet.Standalone;
using LiveStreamingServerNet.Standalone.Installer;
using Microsoft.Extensions.FileProviders;
using Scalar.AspNetCore;
using System.Net;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var rtmpPort = builder.Configuration.GetValue<int>("RtmpPort", 1935);

builder.Services.AddLiveStreamingServer(
    new IPEndPoint(IPAddress.Any, rtmpPort),
    options => options.AddStandaloneServices().AddFlv()
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
// 解析 Admin Panel UI 静态资源路径（输出目录优先，找不到则回退到 NuGet 包 contentFiles）
static string? ResolveAdminPanelUiPath()
{
    // 1) 发布/输出目录: <bin>/admin-panel-ui
    var appUi = Path.Combine(AppContext.BaseDirectory, "admin-panel-ui");
    if (Directory.Exists(appUi)) return appUi;

    // 2) 开发机回退: NuGet 包缓存中的 contentFiles/any/any/admin-panel-ui
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
    ?? throw new InvalidOperationException("未找到 Admin Panel UI 静态资源目录。请将 'admin-panel-ui' 目录复制到输出目录，或手动指定有效的 FileProvider。");

app.UseAdminPanelUI(new AdminPanelUIOptions
{
    BasePath = "/ui",
    HasHttpFlvPreview = true,
    FileProvider = new PhysicalFileProvider(adminUiRoot)
});

await app.RunAsync();
