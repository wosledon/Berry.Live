using LiveStreamingServerNet;
using LiveStreamingServerNet.AdminPanelUI;
using LiveStreamingServerNet.Flv.Installer;
using LiveStreamingServerNet.Standalone;
using LiveStreamingServerNet.Standalone.Installer;
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
app.UseAdminPanelUI(new AdminPanelUIOptions { BasePath = "/ui", HasHttpFlvPreview = true });


await app.RunAsync();
