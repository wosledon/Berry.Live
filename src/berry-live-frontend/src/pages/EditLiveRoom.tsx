import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { LiveRoom, liveRoomApi } from '../services/api'

const EditLiveRoom = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [liveRoom, setLiveRoom] = useState<LiveRoom | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setLiveRoom(prev => prev ? { ...prev, [name]: value } : null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!liveRoom) return

    setSaving(true)
    setError(null)

    try {
      await liveRoomApi.updateLiveRoom(liveRoom.id, {
        title: liveRoom.title,
        description: liveRoom.description,
        category: liveRoom.category,
        coverUrl: liveRoom.coverUrl
      })

      navigate(`/live-rooms/${liveRoom.id}`)
    } catch (err: any) {
      setError(err.response?.data?.message || '更新直播间失败')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-lg text-gray-600">加载中...</div>
      </div>
    )
  }

  if (error && !liveRoom) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
        {error}
      </div>
    )
  }

  if (!liveRoom) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
        直播间不存在
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">编辑直播间</h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              直播间标题
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={liveRoom.title}
              onChange={handleChange}
              maxLength={200}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              直播间描述
            </label>
            <textarea
              id="description"
              name="description"
              value={liveRoom.description || ''}
              onChange={handleChange}
              rows={3}
              maxLength={1000}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              value={liveRoom.category || ''}
              onChange={handleChange}
              maxLength={50}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              value={liveRoom.coverUrl || ''}
              onChange={handleChange}
              maxLength={500}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-md font-medium transition-colors"
            >
              {saving ? '保存中...' : '保存修改'}
            </button>
            <Link
              to={`/live-rooms/${liveRoom.id}`}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-md font-medium transition-colors"
            >
              取消
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditLiveRoom