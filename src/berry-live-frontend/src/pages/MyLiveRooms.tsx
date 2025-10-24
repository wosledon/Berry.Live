import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { LiveRoom, liveRoomApi } from '../services/api'

const MyLiveRooms = () => {
  const [liveRooms, setLiveRooms] = useState<LiveRoom[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'edit' | 'admins' | 'fans'>('overview')
  const [editingRoom, setEditingRoom] = useState<LiveRoom | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copySuccess, setCopySuccess] = useState<string | null>(null)

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopySuccess(`${label}已复制到剪贴板`)
      setTimeout(() => setCopySuccess(null), 2000)
    } catch (err) {
      alert('复制失败，请手动复制')
    }
  }

  useEffect(() => {
    fetchLiveRooms()
  }, [])

  const fetchLiveRooms = async () => {
    try {
      const response = await liveRoomApi.getLiveRooms()
      setLiveRooms(response.data)
      // 如果有直播间，默认选择第一个进行编辑
      if (response.data.length > 0) {
        setEditingRoom(response.data[0])
      }
    } catch (error) {
      console.error('Failed to fetch live rooms:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStartLive = async (id: number) => {
    try {
      await liveRoomApi.startLive(id)
      fetchLiveRooms()
    } catch (error) {
      console.error('Failed to start live:', error)
      alert('开始直播失败')
    }
  }

  const handleEndLive = async (id: number) => {
    try {
      await liveRoomApi.endLive(id)
      fetchLiveRooms()
    } catch (error) {
      console.error('Failed to end live:', error)
      alert('结束直播失败')
    }
  }

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditingRoom(prev => prev ? { ...prev, [name]: value } : null)
  }

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingRoom) return

    setSaving(true)
    setError(null)

    try {
      await liveRoomApi.updateLiveRoom(editingRoom.id, {
        title: editingRoom.title,
        description: editingRoom.description,
        category: editingRoom.category,
        coverUrl: editingRoom.coverUrl
      })
      fetchLiveRooms()
      setActiveTab('overview')
    } catch (err: any) {
      setError(err.response?.data?.message || '更新直播间失败')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }

  const currentRoom = liveRooms[0] // 假设只有一个直播间

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* 顶部直播间展示区域 */}
      {currentRoom && (
        <div className="relative h-96 overflow-hidden rounded-3xl mx-4 mt-4 mb-8 shadow-2xl">
          {/* 多层渐变背景 */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 rounded-3xl"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-800/30 via-transparent to-cyan-800/30 rounded-3xl"></div>
          <div className="absolute inset-0 bg-gradient-to-bl from-violet-600/20 via-transparent to-rose-600/20 rounded-3xl"></div>

          {/* 动态装饰元素 */}
          <div className="absolute inset-0">
            {/* 大型装饰圆 */}
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-gradient-to-tr from-pink-400/10 to-cyan-400/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-indigo-400/5 to-purple-400/5 rounded-full blur-2xl animate-pulse" style={{animationDelay: '4s'}}></div>

            {/* 几何图形装饰 */}
            <div className="absolute top-20 left-20 w-32 h-32 border border-white/10 rounded-lg rotate-45 animate-spin" style={{animationDuration: '20s'}}></div>
            <div className="absolute bottom-20 right-20 w-24 h-24 border border-white/10 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
            <div className="absolute top-1/3 right-1/3 w-16 h-16 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-lg rotate-12 animate-pulse" style={{animationDelay: '3s'}}></div>
          </div>

          {/* 网格背景 */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
              backgroundSize: '50px 50px'
            }}></div>
          </div>

          {/* 主要内容 */}
          <div className="relative h-full flex items-center">
            <div className="w-full px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                {/* 直播间信息 */}
                <div className="text-white">
                  <div className="flex items-center space-x-3 mb-4">
                    {currentRoom.isLive ? (
                      <div className="flex items-center bg-red-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg backdrop-blur-sm bg-red-500/90">
                        <div className="w-3 h-3 bg-white rounded-full mr-2 animate-pulse"></div>
                        正在直播
                      </div>
                    ) : (
                      <div className="flex items-center bg-gray-600/80 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
                        未直播
                      </div>
                    )}
                    <div className="flex items-center bg-black/30 text-white px-3 py-1 rounded-lg text-sm backdrop-blur-sm">
                      <span className="mr-1">👁️</span>
                      {currentRoom.viewerCount} 观众
                    </div>
                  </div>

                  <h1 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                    {currentRoom.title}
                  </h1>

                  <p className="text-xl text-blue-100 mb-6 max-w-lg leading-relaxed">
                    {currentRoom.description || '暂无描述'}
                  </p>

                  <div className="flex items-center space-x-4 mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center ring-2 ring-white/20">
                        <span className="text-white font-semibold text-lg">
                          {(currentRoom.owner?.nickname || currentRoom.owner?.username || 'U')[0].toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-white">{currentRoom.owner?.nickname || currentRoom.owner?.username}</p>
                        <p className="text-sm text-blue-200">主播</p>
                      </div>
                    </div>
                    {currentRoom.category && (
                      <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm border border-white/10">
                        {currentRoom.category}
                      </span>
                    )}
                  </div>

                  {/* 操作按钮 */}
                  <div className="flex flex-wrap gap-4">
                    <Link
                      to={`/live-rooms/${currentRoom.id}/watch`}
                      className="inline-flex items-center px-8 py-3 bg-white text-indigo-600 font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 backdrop-blur-sm"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      观看直播
                    </Link>

                    {currentRoom.isLive ? (
                      <button
                        onClick={() => handleEndLive(currentRoom.id)}
                        className="inline-flex items-center px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 backdrop-blur-sm"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H9a1 1 0 01-1-1v-4z" />
                        </svg>
                        结束直播
                      </button>
                    ) : (
                      <button
                        onClick={() => handleStartLive(currentRoom.id)}
                        className="inline-flex items-center px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 backdrop-blur-sm"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l.707.707A1 1 0 0012.414 11H15m-3 7.5A9.5 9.5 0 1121.5 12 9.5 9.5 0 0112 2.5z" />
                        </svg>
                        开始直播
                      </button>
                    )}
                  </div>
                </div>

                {/* 封面图片 */}
                <div className="flex justify-center lg:justify-end">
                  <div className="relative">
                    {currentRoom.coverUrl ? (
                      <img
                        src={currentRoom.coverUrl}
                        alt={currentRoom.title}
                        className="w-80 h-48 object-cover rounded-2xl shadow-2xl border-4 border-white/20 backdrop-blur-sm"
                      />
                    ) : (
                      <div className="w-80 h-48 bg-white/10 rounded-2xl flex items-center justify-center border-4 border-white/20 backdrop-blur-sm">
                        <svg className="w-20 h-20 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}

                    {/* 装饰光晕 */}
                    <div className="absolute -inset-4 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-2xl blur-xl -z-10"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 主要内容区域 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 选项卡导航 */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('overview')}
                className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                  activeTab === 'overview'
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <svg className="w-5 h-5 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                概览
              </button>
              <button
                onClick={() => setActiveTab('edit')}
                className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                  activeTab === 'edit'
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <svg className="w-5 h-5 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                编辑直播间
              </button>
              <button
                onClick={() => setActiveTab('admins')}
                className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                  activeTab === 'admins'
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <svg className="w-5 h-5 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                管理员管理
              </button>
              <button
                onClick={() => setActiveTab('fans')}
                className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                  activeTab === 'fans'
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <svg className="w-5 h-5 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                粉丝管理
              </button>
            </nav>
          </div>

          {/* 选项卡内容 */}
          <div className="p-8">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">直播间统计</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-blue-100 text-sm">总观看次数</p>
                          <p className="text-2xl font-bold">{currentRoom?.viewerCount || 0}</p>
                        </div>
                        <svg className="w-8 h-8 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-green-100 text-sm">直播时长</p>
                          <p className="text-2xl font-bold">--</p>
                        </div>
                        <svg className="w-8 h-8 text-green-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-purple-100 text-sm">粉丝数量</p>
                          <p className="text-2xl font-bold">--</p>
                        </div>
                        <svg className="w-8 h-8 text-purple-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-orange-100 text-sm">直播场次</p>
                          <p className="text-2xl font-bold">--</p>
                        </div>
                        <svg className="w-8 h-8 text-orange-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 推流设置 */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">推流设置</h3>

                  {copySuccess && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-4">
                      {copySuccess}
                    </div>
                  )}

                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">RTMP 推流地址</label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={`rtmp://${window.location.hostname}:1935/live/${currentRoom?.streamKey || ''}`}
                            readOnly
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-white text-sm font-mono"
                          />
                          <button
                            onClick={() => copyToClipboard(`rtmp://${window.location.hostname}:1935/live/${currentRoom?.streamKey || ''}`, '推流地址')}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                          >
                            复制
                          </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">使用此地址在 OBS Studio 或其他推流软件中进行直播</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">流密钥</label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={currentRoom?.streamKey || ''}
                            readOnly
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-white text-sm font-mono"
                          />
                          <button
                            onClick={() => copyToClipboard(currentRoom?.streamKey || '', '流密钥')}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                          >
                            复制
                          </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">请妥善保管流密钥，不要泄露给他人</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">直播间信息</h3>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">直播间标题</label>
                        <p className="text-gray-900">{currentRoom?.title}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">分类</label>
                        <p className="text-gray-900">{currentRoom?.category || '未分类'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">创建时间</label>
                        <p className="text-gray-900">{currentRoom ? new Date(currentRoom.createdAt).toLocaleString() : ''}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">当前状态</label>
                        <p className="text-gray-900">{currentRoom?.isLive ? '直播中' : '未直播'}</p>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">直播间描述</label>
                        <p className="text-gray-900">{currentRoom?.description || '暂无描述'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'edit' && editingRoom && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">编辑直播间</h3>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSaveEdit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                        直播间标题
                      </label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        value={editingRoom.title}
                        onChange={handleEditChange}
                        maxLength={200}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                        直播间描述
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        value={editingRoom.description || ''}
                        onChange={handleEditChange}
                        rows={4}
                        maxLength={1000}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                        分类
                      </label>
                      <input
                        type="text"
                        id="category"
                        name="category"
                        value={editingRoom.category || ''}
                        onChange={handleEditChange}
                        maxLength={50}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="coverUrl" className="block text-sm font-medium text-gray-700 mb-2">
                        封面图片URL
                      </label>
                      <input
                        type="url"
                        id="coverUrl"
                        name="coverUrl"
                        value={editingRoom.coverUrl || ''}
                        onChange={handleEditChange}
                        maxLength={500}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 pt-6">
                    <button
                      type="submit"
                      disabled={saving}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-8 py-3 rounded-lg font-medium transition-colors shadow-lg"
                    >
                      {saving ? '保存中...' : '保存修改'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('overview')}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
                    >
                      取消
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'admins' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">管理员管理</h3>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                    添加管理员
                  </button>
                </div>

                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">暂无管理员</h4>
                  <p className="text-gray-600">您可以添加管理员来帮助管理直播间</p>
                </div>
              </div>
            )}

            {activeTab === 'fans' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">粉丝管理</h3>
                  <div className="flex gap-2">
                    <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium">
                      全部粉丝
                    </button>
                    <button className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 px-4 py-2 rounded-lg text-sm font-medium">
                      VIP粉丝
                    </button>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">暂无粉丝</h4>
                  <p className="text-gray-600">开始直播后，粉丝会出现在这里</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 空状态 */}
      {!currentRoom && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">还没有直播间</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              创建您的第一个直播间，开始精彩的直播之旅
            </p>
            <Link
              to="/live-rooms/create"
              className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              创建直播间
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default MyLiveRooms