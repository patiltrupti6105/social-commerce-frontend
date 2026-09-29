import api from './axiosConfig'

export const userApi = {
  getMe: () => api.get('/users/me'),
  updateMe: (data) => api.put('/users/me', data),
  getProfile: (uuid) => api.get(`/users/${uuid}`),
  follow: (uuid) => api.post(`/users/${uuid}/follow`),
  unfollow: (uuid) => api.delete(`/users/${uuid}/follow`),
  getFollowers: (uuid, page=0) => api.get(`/users/${uuid}/followers?page=${page}`),
  getFollowing: (uuid, page=0) => api.get(`/users/${uuid}/following?page=${page}`),
}
