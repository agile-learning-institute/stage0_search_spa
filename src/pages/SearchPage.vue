<template>
  <v-container fluid class="pa-0 search-bg min-h-screen">
    <v-row justify="center" class="ma-0 pa-0">
      <v-col cols="12" md="10" lg="8" class="py-8">
        <!-- Search Header -->
        <v-card class="mb-6 elevation-6" color="primary" variant="tonal">
          <v-card-text class="pa-6">
            <v-text-field
              v-model="searchQuery"
              label="search"
              variant="outlined"
              prepend-inner-icon="mdi-magnify"
              append-inner-icon="mdi-magnify"
              clearable
              @keyup.enter="performSearch"
              @click:clear="clearSearch"
              @click:append-inner="performSearch"
              :disabled="loading"
              class="search-input"
            ></v-text-field>
          </v-card-text>
        </v-card>

        <!-- Error State -->
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

        <!-- Search Results -->
        <div v-if="searchResults.length > 0">
          <v-row>
            <v-col
              v-for="(result, index) in searchResults"
              :key="`${result.collection_id}-${index}`"
              cols="12"
            >
              <SearchResultCard :result="result" />
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

        <!-- Initial Loading State -->
        <v-card v-if="loading && !hasSearched" class="elevation-3">
          <v-card-text class="text-center py-8">
            <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
            <div class="text-h6 mt-4">Searching...</div>
          </v-card-text>
        </v-card>

        <!-- Initial State -->
        <v-card v-if="!hasSearched && !loading && !error && searchResults.length === 0" class="elevation-3">
          <v-card-text class="text-center py-8">
            <v-icon size="64" color="primary">mdi-magnify</v-icon>
            <div class="text-h6 mt-4">Enter your search terms above to get started</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { searchAPI } from '../utils/api'
import type { SearchResult, SearchResponse } from '../types'
import SearchResultCard from '../components/SearchResultCard.vue'

const searchQuery = ref('')
const searchResults = ref<SearchResult[]>([])
const loading = ref(false)
const hasSearched = ref(false)
const error = ref<string | null>(null)

const performSearch = async () => {
  if (!searchQuery.value.trim()) return
  
  loading.value = true
  hasSearched.value = true
  error.value = null
  
  // Clear existing results for new search
  searchResults.value = []
  
  try {
    const response = await searchAPI.search({
      search: searchQuery.value.trim(),
      page: 1,
      page_size: 30
    })
    
    const data: SearchResponse = response.data
    searchResults.value = data.items
  } catch (err) {
    console.error('Search failed:', err)
    error.value = 'Failed to perform search. Please try again.'
    searchResults.value = []
  } finally {
    loading.value = false
  }
}

const clearSearch = () => {
  searchQuery.value = ''
  searchResults.value = []
  hasSearched.value = false
  error.value = null
}
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
.search-input {
  padding-left: 24px;
  padding-right: 24px;
}
</style> 