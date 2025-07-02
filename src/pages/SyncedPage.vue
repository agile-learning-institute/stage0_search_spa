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
          <v-divider></v-divider>
          <v-card-text class="d-flex align-center justify-center">
            <span class="text-h6 mr-4">Total Syncs:</span>
            <span class="text-h6 font-weight-bold">{{ totalItems }}</span>
          </v-card-text>
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
          
          <!-- Loading More Indicator -->
          <v-row v-if="loadingMore" justify="center" class="mt-6">
            <v-col cols="auto">
              <v-progress-circular indeterminate color="primary" size="32"></v-progress-circular>
              <span class="ml-3 text-body-2">Loading more history...</span>
            </v-col>
          </v-row>
          
          <!-- Infinite Scroll Sentinel -->
          <div ref="infiniteScrollSentinel" style="height: 1px;"></div>
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
import { ref, onMounted, watch, nextTick, onBeforeUnmount } from 'vue'
import { searchAPI } from '../utils/api'
import type { SyncResult, SyncHistoryResponse } from '../types'

const syncHistory = ref<SyncResult[]>([])
const loading = ref(false)
const loadingMore = ref(false)
const hasMoreResults = ref(false)
const currentPage = ref(1)
const currentPageSize = ref(10)
const totalItems = ref(0)
const error = ref<string | null>(null)
const infiniteScrollSentinel = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

const loadSyncHistory = async (page = 1) => {
  if (page === 1) {
    loading.value = true
    error.value = null
  } else {
    loadingMore.value = true
  }
  
  try {
    const response = await searchAPI.getSyncHistory({
      page,
      page_size: currentPageSize.value
    })
    
    const data: SyncHistoryResponse = response.data
    
    if (page === 1) {
      syncHistory.value = data.items
    } else {
      syncHistory.value.push(...data.items)
    }
    
    hasMoreResults.value = data.pagination.has_next
    currentPage.value = data.pagination.page
    totalItems.value = data.pagination.total_items
  } catch (err) {
    console.error('Failed to load sync history:', err)
    error.value = 'Failed to load sync history. Please try again.'
    if (page === 1) {
      syncHistory.value = []
    }
  } finally {
    loading.value = false
    loadingMore.value = false
  }
}

const loadMore = async () => {
  if (!hasMoreResults.value || loadingMore.value || loading.value) return
  await loadSyncHistory(currentPage.value + 1)
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleString()
}

const setupInfiniteScroll = () => {
  if (observer) observer.disconnect()
  observer = new window.IntersectionObserver(async (entries) => {
    if (entries[0].isIntersecting && hasMoreResults.value && !loading.value && !loadingMore.value) {
      await loadMore()
    }
  })
  if (infiniteScrollSentinel.value) {
    observer.observe(infiniteScrollSentinel.value)
  }
}

watch([syncHistory, hasMoreResults], async () => {
  await nextTick()
  setupInfiniteScroll()
})

onMounted(async () => {
  await loadSyncHistory()
  setupInfiniteScroll()
})

onBeforeUnmount(() => {
  if (observer) observer.disconnect()
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