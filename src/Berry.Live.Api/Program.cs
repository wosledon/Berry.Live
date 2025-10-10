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
// ���� Admin Panel UI ��̬��Դ·�������Ŀ¼���ȣ��Ҳ�������˵� NuGet �� contentFiles��
static string? ResolveAdminPanelUiPath()
{
    // 1) ����/���Ŀ¼: <bin>/admin-panel-ui
    var appUi = Path.Combine(AppContext.BaseDirectory, "admin-panel-ui");
    if (Directory.Exists(appUi)) return appUi;

    // 2) ����������: NuGet �������е� contentFiles/any/any/admin-panel-ui
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
    ?? throw new InvalidOperationException("δ�ҵ� Admin Panel UI ��̬��ԴĿ¼���뽫 'admin-panel-ui' Ŀ¼���Ƶ����Ŀ¼�����ֶ�ָ����Ч�� FileProvider��");

app.UseAdminPanelUI(new AdminPanelUIOptions
{
    BasePath = "/ui",
    HasHttpFlvPreview = true,
    FileProvider = new PhysicalFileProvider(adminUiRoot)
});

await app.RunAsync();
