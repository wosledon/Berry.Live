import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { LiveRoom, liveRoomApi, liveRoomAdminApi, LiveRoomAdmin } from '../services/api'

const LiveRoomAdmins = () => {
  const { id } = useParams<{ id: string }>()
  const [liveRoom, setLiveRoom] = useState<LiveRoom | null>(null)
  const [admins, setAdmins] = useState<LiveRoomAdmin[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (id) {
      fetchLiveRoom()
      fetchAdmins()
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

  const fetchAdmins = async () => {
    if (!id) return

    try {
      const response = await liveRoomAdminApi.getAdmins(parseInt(id))
      setAdmins(response.data)
    } catch (err) {
      setError('获取管理员列表失败')
      console.error('Failed to fetch admins:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveAdmin = async (userId: number) => {
    if (!confirm('确定要移除这个管理员吗？')) return
    if (!id) return

    try {
      await liveRoomAdminApi.removeAdmin(parseInt(id), userId)
      setAdmins(admins.filter(admin => admin.userId !== userId))
    } catch (err) {
      alert('移除管理员失败')
      console.error('Failed to remove admin:', err)
    }
  }

  const handleAddAdmin = () => {
    // 这里应该打开添加管理员的模态框或跳转到添加页面
    alert('添加管理员功能开发中')
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
                <span className="text-gray-400">管理员管理</span>
              </div>
            </li>
          </ol>
        </nav>

        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">管理员管理</h1>
            <p className="text-gray-600 mt-2">管理直播间的管理员权限</p>
          </div>
          <button
            onClick={handleAddAdmin}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
          >
            添加管理员
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">管理员列表</h2>
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
                  角色
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  加入时间
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {admins.map((admin) => (
                <tr key={admin.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {admin.user?.username || `用户${admin.userId}`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {admin.user?.nickname || '未知'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      admin.role === '超级管理员' || admin.role === 'admin'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {admin.role === 'admin' ? '管理员' : admin.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(admin.addedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {admin.role !== '超级管理员' && admin.role !== 'admin' && (
                      <button
                        onClick={() => handleRemoveAdmin(admin.userId)}
                        className="text-red-600 hover:text-red-900"
                      >
                        移除
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {admins.length === 0 && (
          <div className="px-6 py-8 text-center text-gray-500">
            暂无管理员
          </div>
        )}
      </div>
    </div>
  )
}

export default LiveRoomAdmins