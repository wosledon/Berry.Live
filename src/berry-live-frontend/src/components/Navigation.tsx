import { Link } from 'react-router-dom'
import UserMenu from './UserMenu'

const Navigation = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 text-white shadow-lg backdrop-blur-sm border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-white hover:text-blue-200 transition-colors duration-200">
              Berry.Live
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="text-blue-100 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-white/10 backdrop-blur-sm"
            >
              首页
            </Link>
            <Link
              to="/live-rooms"
              className="text-blue-100 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-white/10 backdrop-blur-sm"
            >
              全部直播
            </Link>
            <UserMenu />
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation