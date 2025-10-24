import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Navigation from './components/Navigation'
import Home from './pages/Home'
import AllLiveRooms from './pages/AllLiveRooms'
import MyLiveRooms from './pages/MyLiveRooms'
import LiveRoomDetail from './pages/LiveRoomDetail'
import WatchLive from './pages/WatchLive'
import CreateLiveRoom from './pages/CreateLiveRoom'
import EditLiveRoom from './pages/EditLiveRoom'
import LiveRoomAdmins from './pages/LiveRoomAdmins'
import LiveRoomFans from './pages/LiveRoomFans'
import UserProfile from './pages/UserProfile'
import Register from './pages/Register'
import Login from './pages/Login'
import NotFound from './pages/NotFound'

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="pt-16">
        <Routes>
          <Route path="/" element={
            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
              <Home />
            </main>
          } />
          <Route path="/live-rooms" element={
            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
              <AllLiveRooms />
            </main>
          } />
          <Route path="/my-live-rooms" element={
            <ProtectedRoute>
              <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <MyLiveRooms />
              </main>
            </ProtectedRoute>
          } />
          <Route path="/live-rooms/:id" element={
            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
              <LiveRoomDetail />
            </main>
          } />
          <Route path="/live-rooms/:id/edit" element={
            <ProtectedRoute>
              <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <EditLiveRoom />
              </main>
            </ProtectedRoute>
          } />
          <Route path="/live-rooms/:id/watch" element={<WatchLive />} />
          <Route path="/live-rooms/:id/admins" element={
            <ProtectedRoute>
              <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <LiveRoomAdmins />
              </main>
            </ProtectedRoute>
          } />
        <Route path="/live-rooms/:id/fans" element={
          <ProtectedRoute>
            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
              <LiveRoomFans />
            </main>
          </ProtectedRoute>
        } />
        <Route path="/live-rooms/create" element={
          <ProtectedRoute>
            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
              <CreateLiveRoom />
            </main>
          </ProtectedRoute>
        } />
        <Route path="/users/:id" element={
          <ProtectedRoute>
            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
              <UserProfile />
            </main>
          </ProtectedRoute>
        } />
        <Route path="/register" element={
          <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <Register />
          </main>
        } />
        <Route path="/login" element={
          <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <Login />
          </main>
        } />
        <Route path="*" element={
          <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <NotFound />
          </main>
        } />
      </Routes>
      </div>
    </div>
    </AuthProvider>
  )
}

export default App