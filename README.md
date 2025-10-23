# Berry.Live

简体中文 README — Berry.Live

项目简介
----------------
Berry.Live 是一个基于 .NET 9 和 LiveStreamingServerNet 库构建的**实时直播流媒体服务器**。该项目提供完整的 RTMP 推流和多种格式拉流功能，支持直播内容的实时转发和分发。

## 核心功能

### 🎥 直播流媒体服务
- **RTMP 推流服务器**：支持 OBS、FFmpeg 等推流工具通过 RTMP 协议推送直播内容
- **多格式拉流支持**：
  - HTTP-FLV：通过 HTTP 协议传输 FLV 格式直播流
  - WebSocket-FLV：基于 WebSocket 的实时 FLV 流传输
- **实时转码与分发**：自动将 RTMP 推流转换为多种拉流格式

### 🎛️ 管理与监控
- **Web 管理面板**：内置管理界面（`/ui` 路径），支持：
  - 直播流状态监控
  - HTTP-FLV 预览功能
  - 实时连接数据统计
- **RESTful API**：提供编程接口获取直播流 URL 和配置信息

## 流认证

Berry.Live 现已支持流认证功能。通过 `src/Berry.Live.Api/Auth/` 目录下的相关组件（如 `RtmpAuthorizationHandler.cs`、`StreamKeyValidator.cs` 等），可对推流请求进行鉴权，确保只有合法用户才能推送直播流。

### 流认证简介

- 支持自定义流密钥校验逻辑
- 可缓存流密钥，提升鉴权性能
- 集成于 API 服务启动流程

### 相关文件

- `src/Berry.Live.Api/Auth/IStreamKeyValidator.cs`：流密钥校验接口
- `src/Berry.Live.Api/Auth/StreamKeyValidator.cs`：默认实现
- `src/Berry.Live.Api/Auth/RtmpAuthorizationHandler.cs`：RTMP 推流鉴权处理器
- `src/Berry.Live.Api/Auth/StreamKeyCache.cs`：流密钥缓存

如需自定义流认证逻辑，可扩展上述接口或实现。

### 📡 API 接口
- **直播流 URL 获取**：`GET /api/v1/controller/Get?userId={用户ID}`
  - 返回指定用户的 RTMP 推流地址
  - 返回对应的 HTTP-FLV 和 WebSocket-FLV 拉流地址

## 技术栈
- **.NET 9**：最新 .NET 平台
- **ASP.NET Core**：Web API 框架
- **LiveStreamingServerNet**：专业直播流媒体处理库
- **Scalar OpenAPI**：API 文档界面（`/api` 路径）
- **WebSocket**：实时双向通信支持

先决条件
----------------
- **.NET SDK 9.0** 或更高版本
- **推荐开发环境**：
  - Visual Studio 2022/2023 或 VS Code + C# 扩展
  - Git（用于源码管理）
- **测试工具**（可选）：
  - OBS Studio（用于推流测试）
  - FFmpeg（用于命令行推流）
  - VLC 或其他支持 FLV 的播放器（用于拉流测试）

快速开始（本地运行）
----------------
1. 克隆仓库：

	git clone https://github.com/wosledon/Berry.Live.git

2. 切换到仓库目录并进入 API 项目目录：

	cd Berry.Live/src/Berry.Live.Api

3. 还原并构建项目：

	dotnet restore
	dotnet build -c Debug

4. 运行 API（开发环境）：

	dotnet run --project Berry.Live.Api.csproj

	或者在 Visual Studio 中按 F5 启动调试。

应用程序将按 `Properties/launchSettings.json` 中的配置暴露本地地址（通常为 http://localhost:5xxx 或 https://localhost:7xxx）。

## 使用示例

### 1. 获取直播流 URL
发送 GET 请求到 API 端点：
```
GET /api/v1/controller/Get?userId=your_user_id
```

响应示例：
```json
{
  "rtmpUrl": "rtmp://localhost:1935/live/your_user_id",
  "flvUrl": "http://localhost:5000/flv/live/your_user_id.flv",
  "wsFlvUrl": "ws://localhost:5000/wsflv/live/your_user_id.flv"
}
```

### 2. 推流到服务器
使用 OBS Studio：
1. 设置推流服务器：`rtmp://localhost:1935/live`
2. 设置推流密钥：`your_user_id`

使用 FFmpeg 命令行：
```bash
ffmpeg -i input.mp4 -c copy -f flv rtmp://localhost:1935/live/your_user_id
```

### 3. 拉流观看
- **HTTP-FLV**：在支持 FLV 的播放器中打开 `http://localhost:5000/flv/live/your_user_id.flv`
- **WebSocket-FLV**：在 Web 页面中使用 WebSocket 连接 `ws://localhost:5000/wsflv/live/your_user_id.flv`

### 4. 管理界面
访问 `http://localhost:5000/ui` 查看：
- 当前活跃的直播流
- 实时预览功能
- 连接统计信息

配置
----------------
### 主要配置项
- **RTMP 端口**：在 `appsettings.json` 中配置 `RtmpPort`（默认 1935）
- **日志级别**：通过 `Logging` 配置节调整日志输出
- **允许的主机**：`AllowedHosts` 配置外部访问权限

### 配置文件说明
- `appsettings.json`：生产环境配置
- `appsettings.Development.json`：开发环境配置（会覆盖生产配置）

### 环境变量支持
生产部署时可通过环境变量覆盖配置：
```bash
# 设置 RTMP 端口
export RtmpPort=1935

# 设置运行环境
export ASPNETCORE_ENVIRONMENT=Production
```

构建与发布
----------------
- 使用 `dotnet publish` 为不同运行时或自包含发布打包：

	dotnet publish -c Release -r win-x64 --self-contained false -p:PublishSingleFile=false

- 发布产物在 `src/Berry.Live.Api/bin/Release/net9.0/publish`（示例）中。项目仓库中也包含 `bin/` 示例输出，供参考。

目录结构
----------------
```
Berry.Live/
├── src/Berry.Live.Api/          # 主要 Web API 项目
│   ├── Controllers/             # API 控制器
│   │   └── ApiControllerBase.cs # 直播流 API 控制器
│   ├── Properties/              # 项目配置
│   │   └── launchSettings.json  # 启动配置
│   ├── appsettings*.json        # 应用配置文件
│   ├── Program.cs              # 应用程序入口点
│   └── bin/Debug/net9.0/       # 构建输出
│       └── admin-panel-ui/     # 管理界面静态资源
├── tests/                      # 测试项目目录
├── Berry.Live.slnx            # 解决方案文件
└── README.md                  # 项目说明文档
```

### 重要文件说明
- **Program.cs**：配置 RTMP 服务器、HTTP-FLV、WebSocket-FLV 和管理界面
- **LiveController.cs**：提供获取直播流 URL 的 API 接口
- **admin-panel-ui/**：管理界面的静态资源文件（由 NuGet 包提供）

本地开发提示
----------------

### 开发模式运行
使用 `dotnet watch` 在开发时自动重建并重启：
```bash
cd src/Berry.Live.Api
dotnet watch run
```

### 调试与测试
1. **API 文档**：运行项目后访问 `/api` 查看 Scalar API 文档
2. **管理界面**：访问 `/ui` 查看直播流管理面板
3. **端口配置**：
   - HTTP API：通常在 5000 端口（HTTP）或 7000 端口（HTTPS）
   - RTMP 服务：默认 1935 端口

### 防火墙配置
确保以下端口在防火墙中开放：
- **1935**：RTMP 推流端口
- **5000/7000**：HTTP API 和管理界面端口

### 开发调试流程
1. 启动 Berry.Live 服务
2. 使用 OBS 或 FFmpeg 推流到 `rtmp://localhost:1935/live/test`
3. 通过 API 获取拉流地址：`/api/v1/controller/Get?userId=test`
4. 在管理界面或播放器中查看直播流

测试
----------------
- 本仓库根目录下有 `tests/` 目录（如存在测试项目，请在运行前进入对应测试目录并运行 `dotnet test`）。

贡献
----------------
- 欢迎 Issues 和 Pull Requests。请保持提交信息清晰，遵循仓库的代码风格和分支策略。

许可证
----------------
本项目遵循仓库根目录中的 LICENSE 文件。请查阅 LICENSE 了解详情。

联系方式
----------------
如需帮助，请在仓库中创建 Issue 或联系项目维护者。

小结
----------------
Berry.Live 是一个功能完整的直播流媒体服务器，支持 RTMP 推流和多种格式的拉流服务。项目基于 .NET 9 和专业的 LiveStreamingServerNet 库构建，提供了 Web 管理界面、RESTful API 和实时流媒体处理能力。

### 适用场景
- 个人直播平台搭建
- 企业内部直播系统
- 直播技术学习和研究
- 流媒体服务集成开发

### 后续扩展
如需进一步定制，可以考虑：
- 添加用户认证和权限管理
- 集成数据库存储直播记录
- 支持直播录制和回放
- 添加 CDN 分发支持
- 实现直播间聊天功能