# Berry.Live 前端

基于 React + TypeScript + Tailwind CSS 的直播平台前端应用。

## 功能特性

- 🏠 **首页**: 显示正在直播的房间列表
- 📺 **直播间管理**: 创建、编辑、删除直播间
- 👀 **观看直播**: 实时观看直播流和聊天
- 👤 **用户系统**: 注册、登录用户账户
- 🎨 **响应式设计**: 支持桌面和移动设备

## 技术栈

- **React 18** - 前端框架
- **TypeScript** - 类型安全
- **React Router** - 路由管理
- **Axios** - HTTP 客户端
- **Tailwind CSS** - 实用优先的 CSS 框架
- **Vite** - 构建工具

## 开发环境设置

1. 安装依赖：
   ```bash
   npm install
   ```

2. 启动开发服务器：
   ```bash
   npm run dev
   ```

3. 构建生产版本：
   ```bash
   npm run build
   ```

## 项目结构

```
src/
├── components/          # 可复用组件
│   └── Navigation.tsx   # 导航栏组件
├── pages/              # 页面组件
│   ├── Home.tsx        # 首页
│   ├── LiveRooms.tsx   # 直播间列表
│   ├── LiveRoomDetail.tsx # 直播间详情
│   ├── WatchLive.tsx   # 观看直播
│   ├── CreateLiveRoom.tsx # 创建直播间
│   ├── Register.tsx    # 用户注册
│   └── Login.tsx       # 用户登录
├── services/           # API 服务
│   └── api.ts          # API 客户端和类型定义
├── App.tsx             # 主应用组件
├── main.tsx            # 应用入口
├── index.css           # Tailwind CSS 样式
└── index.html          # HTML 模板
```

## API 集成

前端通过代理配置连接到后端 API：

- 开发环境: `http://localhost:5221/api`
- 生产环境: 根据部署配置

## 主要页面

### 首页 (`/`)
- 显示正在直播的房间卡片
- 快速导航到注册/登录
- 创建直播间的入口

### 直播间管理 (`/live-rooms`)
- 列出所有直播间
- 支持开始/结束直播
- 编辑和删除操作

### 观看直播 (`/live-rooms/:id/watch`)
- 视频播放器区域
- 直播信息显示
- 实时聊天功能

### 用户注册/登录
- 表单验证
- 错误处理
- 成功后重定向

## 样式说明

使用 Tailwind CSS 提供现代化的 UI 设计：

- 响应式网格布局和 Flexbox
- 卡片式设计和阴影效果
- 按钮和表单组件样式
- 颜色系统和间距规范
- 悬停和过渡效果

## 注意事项

- 聊天功能目前为前端模拟，后续可集成 WebSocket
- 视频播放器区域预留，后续可集成 HLS.js 或其他播放器
- 用户认证状态暂未持久化，可添加 localStorage 或 Context