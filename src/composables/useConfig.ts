import { ref, onMounted } from 'vue'
import { searchAPI } from '../utils/api'
import type { Config } from '../types'

export function useConfig() {
  const config = ref<Config | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchConfig = async () => {
    loading.value = true
    error.value = null
    
    try {
      const response = await searchAPI.getConfig()
      config.value = response.data
    } catch (err) {
      console.error('Failed to fetch config:', err)
      error.value = 'Failed to load configuration'
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    fetchConfig()
  })

  return {
    config,
    loading,
    error,
    fetchConfig
  }
} 