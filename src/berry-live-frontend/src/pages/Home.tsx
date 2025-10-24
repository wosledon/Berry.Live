import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { LiveRoom, liveRoomApi } from '../services/api'

const Home = () => {
  const [liveRooms, setLiveRooms] = useState<LiveRoom[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLiveRooms = async () => {
      try {
        const response = await liveRoomApi.getLiveRooms(true)
        setLiveRooms(response.data)
      } catch (error) {
        console.error('Failed to fetch live rooms:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchLiveRooms()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-lg text-gray-600">加载中...</div>
      </div>
    )
  }

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white rounded-lg p-8 mb-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">欢迎来到 Berry.Live</h1>
          <p className="text-xl mb-6 opacity-90">
            专业的直播平台，为主播和观众提供优质的直播体验
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/live-rooms"
              className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold transition-colors shadow-lg"
            >
              浏览直播
            </Link>
            <Link
              to="/register"
              className="bg-blue-500 hover:bg-blue-400 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              加入我们
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">高清直播</h3>
          <p className="text-gray-600">支持高清画质，流畅的直播体验</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">互动聊天</h3>
          <p className="text-gray-600">实时聊天功能，与主播和观众互动</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">简单易用</h3>
          <p className="text-gray-600">快速创建直播间，即开即播</p>
        </div>
      </div>

      {/* Live Rooms Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">正在直播</h2>
          <Link
            to="/live-rooms"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            查看全部 →
          </Link>
        </div>

        {liveRooms.length === 0 ? (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-md text-center">
            <p className="mb-2">暂无正在直播的房间</p>
            <p className="text-sm">快来创建第一个直播间吧！</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {liveRooms.slice(0, 6).map((room) => (
              <div key={room.id} className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                {room.coverUrl ? (
                  <img
                    src={room.coverUrl}
                    alt={room.title}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white">
                    <div className="text-center">
                      <svg className="w-12 h-12 mx-auto mb-2 opacity-80" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <p className="text-sm">直播中</p>
                    </div>
                  </div>
                )}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{room.title}</h3>
                  <p className="text-gray-600 mb-3 text-sm line-clamp-2">{room.description}</p>
                  <div className="flex justify-between items-center text-sm text-gray-500 mb-3">
                    <span>主播: {room.owner?.nickname || room.owner?.username}</span>
                    <span>{room.viewerCount} 观众</span>
                  </div>
                  <div className="flex space-x-2">
                    <Link
                      to={`/live-rooms/${room.id}/watch`}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded-md text-sm font-medium transition-colors"
                    >
                      观看直播
                    </Link>
                    <Link
                      to={`/live-rooms/${room.id}`}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-center py-2 px-4 rounded-md text-sm font-medium transition-colors"
                    >
                      详情
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Home