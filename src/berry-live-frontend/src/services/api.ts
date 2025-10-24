import axios from 'axios'

const api = axios.create({
  baseURL: '/api'
})

export interface User {
  id: number
  username: string
  email: string
  nickname?: string
  avatarUrl?: string
  level: number
  points: number
  createdAt: string
  updatedAt?: string
}

export interface LiveRoom {
  id: number
  title: string
  description?: string
  ownerId: number
  owner?: User
  coverUrl?: string
  category?: string
  isLive: boolean
  createdAt: string
  startedAt?: string
  endedAt?: string
  viewerCount: number
  streamKey: string
}

export interface LiveRoomAdmin {
  id: number
  liveRoomId: number
  userId: number
  user?: User
  role: string
  addedAt: string
  addedByUserId: number
  addedByUser?: User
}

export interface LiveRoomFan {
  id: number
  liveRoomId: number
  userId: number
  user?: User
  followedAt: string
  isActive: boolean
}

export const userApi = {
  register: (data: { username: string; email: string; password: string }) =>
    api.post<User>('/users/register', data),

  login: (data: { username: string; password: string }) =>
    api.post<{ message: string }>('/users/login', data),

  getUser: (id: number) =>
    api.get<User>(`/users/${id}`),

  getUserByUsername: (username: string) =>
    api.get<User>(`/users/by-username/${username}`),

  updateProfile: (id: number, data: { nickname?: string; avatarUrl?: string }) =>
    api.put(`/users/${id}/profile`, data),

  deleteUser: (id: number) =>
    api.delete(`/users/${id}`)
}

export const liveRoomApi = {
  getLiveRooms: (isLive?: boolean, category?: string) => {
    const params = new URLSearchParams()
    if (isLive !== undefined) params.append('isLive', isLive.toString())
    if (category) params.append('category', category)
    return api.get<LiveRoom[]>(`/liverooms?${params}`)
  },

  getLiveRoom: (id: number) =>
    api.get<LiveRoom>(`/liverooms/${id}`),

  getLiveRoomByStreamKey: (streamKey: string) =>
    api.get<LiveRoom>(`/liverooms/stream/${streamKey}`),

  getLiveRoomsByOwner: (ownerId: number) =>
    api.get<LiveRoom[]>(`/liverooms/owner/${ownerId}`),

  createLiveRoom: (data: {
    ownerId: number
    title: string
    description?: string
    category?: string
    coverUrl?: string
  }) =>
    api.post<LiveRoom>('/liverooms', data),

  updateLiveRoom: (id: number, data: {
    title?: string
    description?: string
    category?: string
    coverUrl?: string
  }) =>
    api.put(`/liverooms/${id}`, data),

  startLive: (id: number) =>
    api.post(`/liverooms/${id}/start`),

  endLive: (id: number) =>
    api.post(`/liverooms/${id}/end`),

  deleteLiveRoom: (id: number) =>
    api.delete(`/liverooms/${id}`)
}

export const liveRoomAdminApi = {
  getAdmins: (roomId: number) =>
    api.get<LiveRoomAdmin[]>(`/LiveRoomAdmins/${roomId}`),

  addAdmin: (data: { roomId: number; userId: number; addedByUserId: number; role?: string }) =>
    api.post<LiveRoomAdmin>('/LiveRoomAdmins', data),

  removeAdmin: (roomId: number, userId: number) =>
    api.delete(`/LiveRoomAdmins/${roomId}/${userId}`),

  updateAdminRole: (roomId: number, userId: number, data: { role: string }) =>
    api.put(`/LiveRoomAdmins/${roomId}/${userId}/role`, data)
}

export const liveRoomFanApi = {
  getFans: (roomId: number) =>
    api.get<LiveRoomFan[]>(`/LiveRoomFans/${roomId}`),

  addFan: (data: { roomId: number; userId: number }) =>
    api.post<LiveRoomFan>('/LiveRoomFans', data),

  removeFan: (roomId: number, userId: number) =>
    api.delete(`/LiveRoomFans/${roomId}/${userId}`),

  getFanCount: (roomId: number) =>
    api.get<{ roomId: number; fanCount: number }>(`/LiveRoomFans/${roomId}/count`)
}