import api from './axiosConfig'

export const uploadApi = {
  /**
   * Upload an image file.
   * @param {File} file
   * @returns {Promise<{url: string}>}
   *
   * NOTE: Do NOT set Content-Type manually — axios automatically sets
   * "multipart/form-data; boundary=XXXX" when the body is FormData.
   * Setting it manually strips the boundary and breaks multipart parsing.
   */
  uploadImage: (file) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post('/upload/image', formData)
  },
}
