import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { LiveRoom, liveRoomApi } from '../services/api'
import flvjs from 'flv.js'

const WatchLive = () => {
  const { id } = useParams<{ id: string }>()
  const [liveRoom, setLiveRoom] = useState<LiveRoom | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [chatMessages, setChatMessages] = useState<string[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [playerLoading, setPlayerLoading] = useState(false)
  const [playerError, setPlayerError] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const playerRef = useRef<flvjs.Player | null>(null)

  useEffect(() => {
    const fetchLiveRoom = async () => {
      if (!id) return

      try {
        const response = await liveRoomApi.getLiveRoom(parseInt(id))
        setLiveRoom(response.data)
      } catch (err) {
        setError('获取直播间信息失败')
        console.error('Failed to fetch live room:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchLiveRoom()
  }, [id])

  // 初始化FLV播放器
  useEffect(() => {
    if (liveRoom?.isLive && videoRef.current && !playerRef.current) {
      setPlayerLoading(true)
      setPlayerError(null)

      const flvUrl = `http://localhost:5221/live/${liveRoom.streamKey}.flv`
      console.log('Attempting to load FLV stream:', flvUrl)

      if (flvjs.isSupported()) {
        const flvPlayer = flvjs.createPlayer(
          { type: 'flv', url: flvUrl },
          { isLive: true }
        )
        flvPlayer.attachMediaElement(videoRef.current)
        flvPlayer.load()
        // 自动播放，兼容浏览器策略
        try {
          const vid = videoRef.current
          const p = vid.play()
          if (p && typeof p.then === 'function') {
            p.then(() => console.log('HTMLVideoElement.play() succeeded'))
             .catch(err => console.warn('HTMLVideoElement.play() rejected:', err))
          }
        } catch (e) {
          console.warn('调用 video.play() 失败：', e)
        }

        flvPlayer.on(flvjs.Events.ERROR, (errorType, errorDetail) => {
          console.error('FLV Player Error:', errorType, errorDetail)
          setPlayerError(`播放出错: ${errorType} - ${errorDetail}`)
          setPlayerLoading(false)
        })

        // 监听 video 标签 loadeddata 事件，隐藏 loading
        videoRef.current.addEventListener('loadeddata', () => {
          setPlayerLoading(false)
        })

        // 可选: 打印统计信息
        flvPlayer.on(flvjs.Events.STATISTICS_INFO, () => {})

        playerRef.current = flvPlayer
      } else {
        setPlayerError('您的浏览器不支持FLV播放')
        setPlayerLoading(false)
      }
    }
    return () => {
      if (playerRef.current) {
        playerRef.current.destroy()
        playerRef.current = null
      }
    }
  }, [liveRoom?.isLive, liveRoom?.streamKey])

  // 手动重试按钮
  const initializePlayer = () => {
    if (playerRef.current) {
      playerRef.current.destroy()
      playerRef.current = null
    }
    setPlayerLoading(true)
    setPlayerError(null)
    // 触发 useEffect 重新初始化
    setTimeout(() => {
      setPlayerLoading(false)
      setPlayerLoading(true)
    }, 10)
  }

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setChatMessages(prev => [...prev, `游客: ${newMessage.trim()}`])
      setNewMessage('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage()
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-lg text-gray-600">加载中...</div>
      </div>
    )
  }

  if (error || !liveRoom) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
        {error || '直播间不存在'}
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col overflow-hidden">
      {/* 面包屑导航 */}
      <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 backdrop-blur-sm border-b border-white/10 w-full flex-shrink-0 shadow-lg">
        <div className="px-6 py-4">
          <nav className="flex text-sm text-blue-100">
            <Link to="/" className="hover:text-white transition-colors duration-200">首页</Link>
            <span className="mx-2 text-blue-200">/</span>
            <Link to="/live-rooms" className="hover:text-white transition-colors duration-200">我的直播间</Link>
            <span className="mx-2 text-blue-200">/</span>
            <span className="text-white font-medium">观看直播</span>
          </nav>
        </div>
      </div>

      <div className="flex-1 w-full overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-0 h-full">
          {/* 主要视频区域 */}
          <div className="lg:col-span-3 flex flex-col h-full">
            {/* 直播标题和信息 */}
            <div className="bg-white/80 backdrop-blur-sm p-6 border-b border-gray-200 flex-shrink-0 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{liveRoom.title}</h1>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center ring-2 ring-white shadow-lg">
                        <span className="text-white font-semibold">
                          {(liveRoom.owner?.nickname || liveRoom.owner?.username || 'U')[0].toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <Link
                          to={`/users/${liveRoom.owner?.id}`}
                          className="text-gray-900 font-semibold hover:text-blue-600 transition-colors"
                        >
                          {liveRoom.owner?.nickname || liveRoom.owner?.username}
                        </Link>
                        <p className="text-gray-600 text-sm">主播</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 直播状态和观众数 */}
                <div className="flex items-center space-x-4">
                  {liveRoom.isLive ? (
                    <div className="flex items-center bg-red-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                      <div className="w-3 h-3 bg-white rounded-full mr-2 animate-pulse"></div>
                      正在直播
                    </div>
                  ) : (
                    <div className="flex items-center bg-gray-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                      直播已结束
                    </div>
                  )}
                  <div className="flex items-center bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm border border-gray-200">
                    <span className="mr-2">👁️</span>
                    {liveRoom.viewerCount} 观众
                  </div>
                </div>
              </div>
            </div>

            {/* 视频播放区域 */}
            <div className="bg-black overflow-hidden border-gray-200 flex-1 min-h-0 shadow-inner relative">
              {liveRoom.isLive ? (
                <div className="w-full h-full relative">
                  {/* FLV视频播放器 */}
                  <video
                    ref={videoRef}
                    className="w-full h-full object-contain"
                    controls
                    autoPlay
                    muted
                    playsInline
                  >
                    您的浏览器不支持视频播放。
                  </video>

                  {/* 加载状态覆盖层 */}
                  {playerLoading && (
                    <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center">
                      <div className="text-center text-white">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                        <p className="text-lg">正在连接直播流...</p>
                      </div>
                    </div>
                  )}

                  {/* 错误状态覆盖层 */}
                  {playerError && (
                    <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center">
                      <div className="text-center text-white">
                        <div className="w-16 h-16 mx-auto mb-4 bg-red-500 rounded-full flex items-center justify-center">
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                          </svg>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">播放失败</h3>
                        <p className="text-gray-300 mb-4">{playerError}</p>
                        <button
                          onClick={initializePlayer}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                        >
                          重试
                        </button>
                      </div>
                    </div>
                  )}

                  {/* 直播中指示器 */}
                  <div className="absolute top-4 left-4 z-10">
                    <div className="flex items-center bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                      <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                      LIVE
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center shadow-inner">
                  <div className="text-center text-gray-700">
                    <div className="w-20 h-20 mx-auto mb-6 bg-gray-300 rounded-full flex items-center justify-center">
                      <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-semibold mb-2">直播未开始</h3>
                    <p className="text-gray-600 text-lg">主播暂时不在直播，请稍后再来</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 侧边栏 */}
          <div className="lg:col-span-1 flex flex-col h-full">
            {/* 直播间信息 */}
            <div className="bg-white/80 backdrop-blur-sm p-6 border-b border-gray-200 flex-shrink-0 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                直播信息
              </h3>

              <div className="space-y-4">
                {liveRoom.description && (
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h4 className="text-gray-900 font-medium mb-2">直播间介绍</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">{liveRoom.description}</p>
                  </div>
                )}

                <div className="space-y-3">
                  {liveRoom.category && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-600 font-medium">分类</span>
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium border border-blue-200">
                        {liveRoom.category}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600 font-medium">创建时间</span>
                    <span className="text-gray-800 text-sm">
                      {new Date(liveRoom.createdAt).toLocaleString()}
                    </span>
                  </div>

                  {liveRoom.startedAt && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-600 font-medium">开始时间</span>
                      <span className="text-gray-800 text-sm">
                        {new Date(liveRoom.startedAt).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 聊天室 */}
            <div className="bg-white/80 backdrop-blur-sm border-gray-200 overflow-hidden flex-1 flex flex-col min-h-0 shadow-sm">
              <div className="p-6 border-b border-gray-200 flex-shrink-0">
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                  <svg className="w-6 h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  聊天室
                </h3>
              </div>

              {/* 聊天消息区域 */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50">
                {chatMessages.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <svg className="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <p>还没有消息，快来开启聊天吧！</p>
                  </div>
                ) : (
                  chatMessages.map((message, index) => (
                    <div key={index} className="flex space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-semibold">
                          {message.split(':')[0][0].toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="bg-white rounded-lg px-3 py-2 shadow-sm border border-gray-200">
                          <p className="text-gray-900 text-sm">
                            <span className="font-semibold text-blue-600">
                              {message.split(':')[0]}:
                            </span>
                            <span className="ml-1">{message.split(':').slice(1).join(':')}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* 发送消息区域 */}
              <div className="p-4 border-t border-gray-200 bg-white/60 flex-shrink-0">
                <div className="flex space-x-3">
                  <input
                    type="text"
                    placeholder="输入消息..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    maxLength={200}
                    className="flex-1 bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg"
                  >
                    发送
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  按 Enter 发送消息 • 文明聊天，共同维护良好环境
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WatchLive