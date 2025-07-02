import axios from 'axios'

const API_BASE_URL = '/api'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)

// API functions
export const searchAPI = {
  // Search documents
  search: (params: {
    search?: string
    query?: string
    page?: number
    page_size?: number
  }) => {
    return api.get('/search/', { params })
  },

  // Get sync history
  getSyncHistory: (params: {
    page?: number
    page_size?: number
    limit?: number
  }) => {
    return api.get('/sync/', { params })
  },

  // Sync all collections
  syncAll: () => {
    return api.post('/sync/')
  },

  // Sync specific collection
  syncCollection: (collectionName: string, indexAs?: string) => {
    const params = indexAs ? { index_as: indexAs } : {}
    return api.patch(`/sync/${collectionName}/`, null, { params })
  },

  // Get sync periodicity
  getSyncPeriodicity: () => {
    return api.get('/sync/periodicity/')
  },

  // Set sync periodicity
  setSyncPeriodicity: (periodSeconds: number) => {
    return api.put('/sync/', { period_seconds: periodSeconds })
  },

  // Get configuration
  getConfig: () => {
    return api.get('/config/')
  },

  // Health check
  health: () => {
    return api.get('/health/')
  }
}

export default api 