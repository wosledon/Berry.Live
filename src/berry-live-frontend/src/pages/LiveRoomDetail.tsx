import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { LiveRoom, liveRoomApi } from '../services/api'

const LiveRoomDetail = () => {
  const { id } = useParams<{ id: string }>()
  const [liveRoom, setLiveRoom] = useState<LiveRoom | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLiveRoom = async () => {
      if (!id) return

      try {
        const response = await liveRoomApi.getLiveRoom(parseInt(id))
        setLiveRoom(response.data)
      } catch (err) {
        setError('获取直播间详情失败')
        console.error('Failed to fetch live room:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchLiveRoom()
  }, [id])

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* 面包屑导航 */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex text-sm text-gray-500">
            <Link to="/" className="hover:text-blue-600 transition-colors">首页</Link>
            <span className="mx-2">/</span>
            <Link to="/live-rooms" className="hover:text-blue-600 transition-colors">我的直播间</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">详情</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 主要内容区域 */}
          <div className="lg:col-span-2 space-y-8">
            {/* 直播间标题卡片 */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* 封面图片 */}
              <div className="relative h-64 bg-gradient-to-br from-gray-200 to-gray-300">
                {liveRoom.coverUrl ? (
                  <img
                    src={liveRoom.coverUrl}
                    alt={liveRoom.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-20 h-20 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}

                {/* 直播状态覆盖层 */}
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
                  <div className="p-6 w-full">
                    <div className="flex items-center justify-between mb-4">
                      {liveRoom.isLive ? (
                        <div className="flex items-center bg-red-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                          <div className="w-3 h-3 bg-white rounded-full mr-2 animate-pulse"></div>
                          正在直播
                        </div>
                      ) : (
                        <div className="flex items-center bg-gray-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                          未直播
                        </div>
                      )}
                      <div className="flex items-center bg-black bg-opacity-50 text-white px-3 py-1 rounded-lg text-sm">
                        <span className="mr-1">👁️</span>
                        {liveRoom.viewerCount} 观众
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 内容区域 */}
              <div className="p-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{liveRoom.title}</h1>

                <div className="flex items-center space-x-4 mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-lg">
                        {(liveRoom.owner?.nickname || liveRoom.owner?.username || 'U')[0].toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <Link
                        to={`/users/${liveRoom.owner?.id}`}
                        className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                      >
                        {liveRoom.owner?.nickname || liveRoom.owner?.username}
                      </Link>
                      <p className="text-sm text-gray-500">主播</p>
                    </div>
                  </div>
                </div>

                {liveRoom.description && (
                  <div className="bg-gray-50 rounded-lg p-6 mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">直播间介绍</h3>
                    <p className="text-gray-700 leading-relaxed">{liveRoom.description}</p>
                  </div>
                )}

                <div className="flex flex-wrap gap-4">
                  <Link
                    to={`/live-rooms/${liveRoom.id}/watch`}
                    className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    观看直播
                  </Link>
                  <Link
                    to={`/live-rooms/${liveRoom.id}/edit`}
                    className="inline-flex items-center px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    编辑直播间
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* 侧边栏 */}
          <div className="lg:col-span-1 space-y-6">
            {/* 直播间信息卡片 */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                直播间信息
              </h3>

              <div className="space-y-4">
                {liveRoom.category && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">分类</span>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {liveRoom.category}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">创建时间</span>
                  <span className="text-gray-900 text-sm">
                    {new Date(liveRoom.createdAt).toLocaleString()}
                  </span>
                </div>

                {liveRoom.startedAt && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">开始时间</span>
                    <span className="text-gray-900 text-sm">
                      {new Date(liveRoom.startedAt).toLocaleString()}
                    </span>
                  </div>
                )}

                {liveRoom.endedAt && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">结束时间</span>
                    <span className="text-gray-900 text-sm">
                      {new Date(liveRoom.endedAt).toLocaleString()}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 font-medium">观众数量</span>
                  <span className="text-gray-900 font-semibold">
                    {liveRoom.viewerCount}
                  </span>
                </div>
              </div>
            </div>

            {/* 管理选项卡片 */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <svg className="w-6 h-6 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                管理选项
              </h3>

              <div className="space-y-3">
                <Link
                  to={`/live-rooms/${liveRoom.id}/admins`}
                  className="w-full flex items-center justify-between p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors group"
                >
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="font-medium text-purple-700">管理员管理</span>
                  </div>
                  <svg className="w-5 h-5 text-purple-400 group-hover:text-purple-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>

                <Link
                  to={`/live-rooms/${liveRoom.id}/fans`}
                  className="w-full flex items-center justify-between p-4 bg-pink-50 hover:bg-pink-100 rounded-lg transition-colors group"
                >
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-3 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span className="font-medium text-pink-700">粉丝管理</span>
                  </div>
                  <svg className="w-5 h-5 text-pink-400 group-hover:text-pink-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LiveRoomDetail