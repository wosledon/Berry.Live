using LiveStreamingServerNet;
using LiveStreamingServerNet.AdminPanelUI;
using LiveStreamingServerNet.Flv.Installer;
using LiveStreamingServerNet.Standalone;
using LiveStreamingServerNet.Standalone.Installer;
using Microsoft.Extensions.FileProviders;
using Scalar.AspNetCore;
using System.Net;
using Berry.Live.Api.Auth;
using Microsoft.EntityFrameworkCore;
using Berry.Live.Infrastructure.Data;
using Berry.Live.Application.Interfaces;
using Berry.Live.Application.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

// 配置CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// 配置 SQLite 数据库
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// 注册应用服务
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<ILiveRoomService, LiveRoomService>();

// 注册RTMP认证处理器
builder.Services.AddScoped<RtmpAuthorizationHandler>();

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

app.UseCors("AllowAll");

app.MapControllers();

// 应用数据库迁移
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    db.Database.Migrate();
}

app.UseWebSockets();
app.UseWebSocketFlv();
app.UseHttpFlv();

app.MapStandaloneServerApiEndPoints();

app.Run();

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
