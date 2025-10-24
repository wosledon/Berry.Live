import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { User, userApi, liveRoomApi } from '../services/api'

const UserProfile = () => {
  const { id } = useParams<{ id: string }>()
  const [user, setUser] = useState<User | null>(null)
  const [liveRooms, setLiveRooms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserData = async () => {
      if (!id) return

      try {
        const [userResponse, roomsResponse] = await Promise.all([
          userApi.getUser(parseInt(id)),
          liveRoomApi.getLiveRoomsByOwner(parseInt(id))
        ])

        setUser(userResponse.data)
        setLiveRooms(roomsResponse.data)
      } catch (err) {
        setError('获取用户信息失败')
        console.error('Failed to fetch user data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [id])

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-lg text-gray-600">加载中...</div>
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
        {error || '用户不存在'}
      </div>
    )
  }

  return (
    <div>
      <nav className="mb-6">
        <ol className="flex text-sm text-gray-500">
          <li>
            <Link to="/" className="hover:text-blue-600">首页</Link>
          </li>
          <li className="mx-2">/</li>
          <li className="text-gray-900">用户资料</li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.nickname || user.username}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
              ) : (
                <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>
              )}
              <h3 className="text-xl font-semibold text-gray-900 mb-1">
                {user.nickname || user.username}
              </h3>
              <p className="text-gray-600 mb-4">@{user.username}</p>
              <div className="flex justify-center space-x-4 text-sm text-gray-500">
                <div className="text-center">
                  <div className="font-semibold text-gray-900">Lv.{user.level}</div>
                  <div>等级</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-gray-900">{user.points}</div>
                  <div>积分</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">用户信息</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">用户名:</span>
                <span className="text-gray-900">{user.username}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">邮箱:</span>
                <span className="text-gray-900">{user.email}</span>
              </div>
              {user.nickname && (
                <div className="flex justify-between">
                  <span className="text-gray-600">昵称:</span>
                  <span className="text-gray-900">{user.nickname}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">注册时间:</span>
                <span className="text-gray-900">{new Date(user.createdAt).toLocaleString()}</span>
              </div>
              {user.updatedAt && (
                <div className="flex justify-between">
                  <span className="text-gray-600">最后更新:</span>
                  <span className="text-gray-900">{new Date(user.updatedAt).toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mt-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-semibold text-gray-900">直播间 ({liveRooms.length})</h4>
              <Link
                to="/live-rooms/create"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                创建直播间
              </Link>
            </div>
            {liveRooms.length === 0 ? (
              <p className="text-gray-500">暂无直播间</p>
            ) : (
              <div className="space-y-4">
                {liveRooms.map((room) => (
                  <div key={room.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h5 className="font-semibold text-gray-900 mb-1">{room.title}</h5>
                        {room.description && (
                          <p className="text-gray-600 text-sm mb-2">{room.description}</p>
                        )}
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          {room.isLive ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              ● 直播中
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              未直播
                            </span>
                          )}
                          <span>{room.viewerCount} 观众</span>
                          {room.category && <span>{room.category}</span>}
                        </div>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <Link
                          to={`/live-rooms/${room.id}`}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          查看
                        </Link>
                        {room.isLive && (
                          <Link
                            to={`/live-rooms/${room.id}/watch`}
                            className="text-green-600 hover:text-green-800 text-sm font-medium"
                          >
                            观看
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserProfile