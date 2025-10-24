import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { LiveRoom, liveRoomApi } from '../services/api'

const AllLiveRooms = () => {
  const [liveRooms, setLiveRooms] = useState<LiveRoom[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState<'all' | 'live' | 'offline'>('all')

  useEffect(() => {
    fetchLiveRooms()
  }, [])

  const fetchLiveRooms = async () => {
    try {
      // 获取所有直播间，包括离线的
      const response = await liveRoomApi.getLiveRooms()
      setLiveRooms(response.data)
    } catch (error) {
      console.error('Failed to fetch live rooms:', error)
      setError('获取直播间列表失败')
    } finally {
      setLoading(false)
    }
  }

  const filteredRooms = liveRooms.filter(room => {
    const title = room.title.toLowerCase()
    const description = room.description?.toLowerCase() || ''
    const matchesSearch = title.includes(searchTerm.toLowerCase()) ||
                         description.includes(searchTerm.toLowerCase())

    const matchesFilter = filter === 'all' ||
                         (filter === 'live' && room.isLive) ||
                         (filter === 'offline' && !room.isLive)

    return matchesSearch && matchesFilter
  })

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-lg text-gray-600">加载中...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
        {error}
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">全部直播</h1>
        <p className="text-gray-600 mt-2">浏览所有直播间，发现精彩内容</p>
      </div>

      {/* 搜索和筛选 */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="搜索直播间标题或描述..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              全部 ({liveRooms.length})
            </button>
            <button
              onClick={() => setFilter('live')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === 'live'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              直播中 ({liveRooms.filter(r => r.isLive).length})
            </button>
            <button
              onClick={() => setFilter('offline')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === 'offline'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              未直播 ({liveRooms.filter(r => !r.isLive).length})
            </button>
          </div>
        </div>
      </div>

      {/* 直播间网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms.map((room) => (
          <div key={room.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-video bg-gray-200 relative">
              {room.streamKey ? (
                <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                  <span className="text-white text-sm">直播画面</span>
                </div>
              ) : (
                <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
              )}

              {/* 直播状态标签 */}
              <div className="absolute top-2 left-2">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  room.isLive
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-500 text-white'
                }`}>
                  {room.isLive ? '● 直播中' : '离线'}
                </span>
              </div>

              {/* 观看按钮 */}
              {room.isLive && (
                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all flex items-center justify-center">
                  <Link
                    to={`/live-rooms/${room.id}/watch`}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium opacity-0 hover:opacity-100 transition-opacity"
                  >
                    观看直播
                  </Link>
                </div>
              )}
            </div>

            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                {room.title}
              </h3>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {room.description || '暂无描述'}
              </p>

              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>创建时间: {new Date(room.createdAt).toLocaleDateString()}</span>
                <Link
                  to={`/live-rooms/${room.id}`}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  查看详情 →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredRooms.length === 0 && (
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">暂无直播间</h3>
          <p className="text-gray-600">
            {searchTerm || filter !== 'all' ? '没有找到匹配的直播间' : '还没有创建任何直播间'}
          </p>
        </div>
      )}
    </div>
  )
}

export default AllLiveRooms