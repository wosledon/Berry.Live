import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { LiveRoom, liveRoomApi, liveRoomFanApi, LiveRoomFan } from '../services/api'

const LiveRoomFans = () => {
  const { id } = useParams<{ id: string }>()
  const [liveRoom, setLiveRoom] = useState<LiveRoom | null>(null)
  const [fans, setFans] = useState<LiveRoomFan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all')

  useEffect(() => {
    if (id) {
      fetchLiveRoom()
      fetchFans()
    }
  }, [id])

  const fetchLiveRoom = async () => {
    if (!id) return

    try {
      const response = await liveRoomApi.getLiveRoom(parseInt(id))
      setLiveRoom(response.data)
    } catch (err) {
      setError('获取直播间信息失败')
      console.error('Failed to fetch live room:', err)
    }
  }

  const fetchFans = async () => {
    if (!id) return

    try {
      const response = await liveRoomFanApi.getFans(parseInt(id))
      setFans(response.data)
    } catch (err) {
      setError('获取粉丝列表失败')
      console.error('Failed to fetch fans:', err)
    } finally {
      setLoading(false)
    }
  }

  const filteredFans = fans.filter(fan => {
    const username = fan.user?.username || ''
    const nickname = fan.user?.nickname || ''
    const matchesSearch = username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         nickname.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filter === 'all' ||
                         (filter === 'active' && fan.isActive) ||
                         (filter === 'inactive' && !fan.isActive)
    return matchesSearch && matchesFilter
  })

  const handleRemoveFan = async (userId: number) => {
    if (!confirm('确定要移除这个粉丝吗？')) return
    if (!id) return

    try {
      await liveRoomFanApi.removeFan(parseInt(id), userId)
      setFans(fans.filter(fan => fan.userId !== userId))
    } catch (err) {
      alert('移除粉丝失败')
      console.error('Failed to remove fan:', err)
    }
  }

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
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <nav className="flex mb-4" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link to="/live-rooms" className="text-gray-700 hover:text-blue-600">
                我的直播间
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <svg className="w-3 h-3 text-gray-400 mx-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
                <span className="text-gray-500">{liveRoom?.title}</span>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <svg className="w-3 h-3 text-gray-400 mx-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
                <span className="text-gray-400">粉丝管理</span>
              </div>
            </li>
          </ol>
        </nav>

        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">粉丝管理</h1>
            <p className="text-gray-600 mt-2">管理直播间的粉丝和VIP用户</p>
          </div>
        </div>
      </div>

      {/* 搜索和筛选 */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="搜索粉丝用户名或昵称..."
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
              全部 ({fans.length})
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === 'active'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              活跃 ({fans.filter(f => f.isActive).length})
            </button>
            <button
              onClick={() => setFilter('inactive')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === 'inactive'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              非活跃 ({fans.filter(f => !f.isActive).length})
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">粉丝列表</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  用户名
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  昵称
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  关注时间
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  状态
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredFans.map((fan) => (
                <tr key={fan.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {fan.user?.username || `用户${fan.userId}`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {fan.user?.nickname || '未知'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(fan.followedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      fan.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {fan.isActive ? '活跃' : '非活跃'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleRemoveFan(fan.userId)}
                      className="text-red-600 hover:text-red-900"
                    >
                      移除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredFans.length === 0 && (
          <div className="px-6 py-8 text-center text-gray-500">
            {searchTerm || filter !== 'all' ? '没有找到匹配的粉丝' : '暂无粉丝'}
          </div>
        )}
      </div>
    </div>
  )
}

export default LiveRoomFans