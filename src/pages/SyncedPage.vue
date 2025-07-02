<template>
  <v-container fluid class="pa-0 synced-bg min-h-screen">
    <v-row justify="center" class="ma-0 pa-0">
      <v-col cols="12" md="10" lg="8" class="py-8">
        <v-card class="mb-6 elevation-6" color="primary" variant="tonal">
          <v-card-title class="d-flex justify-space-between align-center synced-title-card">
            <span class="text-h6">Sync History</span>
            <v-btn
              color="primary"
              variant="outlined"
              size="small"
              class="ml-2"
              @click="$router.push('/admin')"
            >
              Back to Admin
            </v-btn>
          </v-card-title>
        </v-card>

        <!-- Error Alert -->
        <v-alert
          v-if="error"
          type="error"
          variant="tonal"
          class="mb-6"
          closable
          @click:close="error = null"
        >
          {{ error }}
        </v-alert>

        <!-- Sync History List -->
        <div v-if="syncHistory.length > 0">
          <v-card
            v-for="sync in syncHistory"
            :key="sync.id"
            class="mb-4 elevation-3"
          >
            <v-card-title class="d-flex justify-space-between align-center">
              <span class="text-h6">{{ sync.id }}</span>
              <v-chip color="primary" size="small">
                {{ formatDate(sync.start_time) }}
              </v-chip>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <v-list>
                <v-list-item
                  v-for="collection in sync.collections"
                  :key="collection.name"
                  class="py-2"
                >
                  <v-list-item-title class="d-flex justify-space-between align-center">
                    <span>{{ collection.name }}</span>
                    <v-chip color="success" size="small">
                      {{ collection.count }} items
                    </v-chip>
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    Completed: {{ formatDate(collection.end_time) }}
                  </v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </div>

        <!-- No Results -->
        <v-card v-else-if="!loading" class="elevation-3">
          <v-card-text class="text-center py-8">
            <v-icon size="64" color="grey">mdi-sync-off</v-icon>
            <div class="text-h6 mt-4">No sync history found</div>
            <div class="text-body-2 text-grey">Run a sync from the admin page to see history</div>
          </v-card-text>
        </v-card>

        <!-- Loading State -->
        <v-card v-if="loading" class="elevation-3">
          <v-card-text class="text-center py-8">
            <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
            <div class="text-h6 mt-4">Loading sync history...</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { searchAPI } from '../utils/api'
import type { SyncResult, SyncHistoryResponse } from '../types'

const syncHistory = ref<SyncResult[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

const loadSyncHistory = async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await searchAPI.getSyncHistory({
      page: 1,
      page_size: 30
    })
    
    const data: SyncHistoryResponse = response.data
    syncHistory.value = data.items
  } catch (err) {
    console.error('Failed to load sync history:', err)
    error.value = 'Failed to load sync history. Please try again.'
    syncHistory.value = []
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleString()
}

onMounted(async () => {
  await loadSyncHistory()
})
</script>

<style scoped>
.synced-bg {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
}
.v-card {
  border-radius: 18px;
}
.v-card-title {
  background: #f0f4fa;
}
.synced-title-card {
  min-height: 56px;
}
</style> 