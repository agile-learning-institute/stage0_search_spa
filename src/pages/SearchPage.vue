<template>
  <v-container fluid class="pa-0 search-bg min-h-screen">
    <v-row justify="center" class="ma-0 pa-0">
      <v-col cols="12" md="10" lg="8" class="py-8">
        <!-- Search Header -->
        <v-card class="mb-6 elevation-6" color="primary" variant="tonal">
          <v-card-title class="d-flex justify-space-between align-center search-title-card">
            <span class="text-h6">Search</span>
            <v-btn
              color="primary"
              variant="outlined"
              size="small"
              class="ml-2"
              @click="$router.push('/admin')"
            >
              Admin
            </v-btn>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-text-field
              v-model="searchQuery"
              label="Search across all collections"
              variant="outlined"
              prepend-inner-icon="mdi-magnify"
              clearable
              @keyup.enter="performSearch"
              @click:clear="clearSearch"
            >
              <template v-slot:append>
                <v-btn
                  color="primary"
                  @click="performSearch"
                  :loading="loading"
                  :disabled="!searchQuery.trim()"
                >
                  Search
                </v-btn>
              </template>
            </v-text-field>
          </v-card-text>
        </v-card>

        <!-- Search Results -->
        <div v-if="searchResults.length > 0">
          <v-row>
            <v-col
              v-for="result in searchResults"
              :key="result.collection_id"
              cols="12"
              sm="6"
              md="4"
              lg="3"
            >
              <SearchResultCard :result="result" />
            </v-col>
          </v-row>
          
          <!-- Load More Button -->
          <v-row v-if="hasMoreResults" justify="center" class="mt-6">
            <v-col cols="auto">
              <v-btn
                color="primary"
                variant="outlined"
                @click="loadMore"
                :loading="loadingMore"
                :disabled="loadingMore"
              >
                Load More
              </v-btn>
            </v-col>
          </v-row>
        </div>

        <!-- No Results -->
        <v-card v-else-if="hasSearched && !loading" class="elevation-3">
          <v-card-text class="text-center py-8">
            <v-icon size="64" color="grey">mdi-magnify-close</v-icon>
            <div class="text-h6 mt-4">No results found</div>
            <div class="text-body-2 text-grey">Try adjusting your search terms</div>
          </v-card-text>
        </v-card>

        <!-- Loading State -->
        <v-card v-if="loading && !hasSearched" class="elevation-3">
          <v-card-text class="text-center py-8">
            <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
            <div class="text-h6 mt-4">Searching...</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { searchAPI } from '../utils/api'
import type { SearchResult, SearchResponse } from '../types'
import SearchResultCard from '../components/SearchResultCard.vue'

const searchQuery = ref('')
const searchResults = ref<SearchResult[]>([])
const loading = ref(false)
const loadingMore = ref(false)
const hasSearched = ref(false)
const hasMoreResults = ref(false)
const currentPage = ref(1)
const currentPageSize = ref(12)

const performSearch = async (page = 1) => {
  if (!searchQuery.value.trim()) return
  
  loading.value = true
  hasSearched.value = true
  
  try {
    const response = await searchAPI.search({
      search: searchQuery.value.trim(),
      page,
      page_size: currentPageSize.value
    })
    
    const data: SearchResponse = response.data
    
    if (page === 1) {
      searchResults.value = data.items
    } else {
      searchResults.value.push(...data.items)
    }
    
    hasMoreResults.value = data.pagination.has_next
    currentPage.value = data.pagination.page
  } catch (error) {
    console.error('Search failed:', error)
  } finally {
    loading.value = false
  }
}

const loadMore = async () => {
  if (!hasMoreResults.value || loadingMore.value) return
  
  loadingMore.value = true
  await performSearch(currentPage.value + 1)
  loadingMore.value = false
}

const clearSearch = () => {
  searchQuery.value = ''
  searchResults.value = []
  hasSearched.value = false
  hasMoreResults.value = false
  currentPage.value = 1
}

onMounted(() => {
  // Initialize with empty search
})
</script>

<style scoped>
.search-bg {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
}
.v-card {
  border-radius: 18px;
}
.v-card-title {
  background: #f0f4fa;
}
.search-title-card {
  min-height: 56px;
}
</style> 