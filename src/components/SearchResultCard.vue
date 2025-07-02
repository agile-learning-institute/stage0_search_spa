<template>
  <v-card class="search-result-card elevation-3" @click="handleCardClick">
    <v-card-title class="d-flex justify-space-between align-center">
      <span class="text-h6">{{ getTitle() }}</span>
      <v-chip :color="getCollectionColor()" size="small">
        {{ result.collection_name }}
      </v-chip>
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <div class="text-body-2">{{ getDescription() }}</div>
      <div class="mt-2">
        <v-chip
          v-for="(value, key) in getKeyFields()"
          :key="key"
          class="mr-1 mb-1"
          size="x-small"
          variant="outlined"
        >
          {{ key }}: {{ value }}
        </v-chip>
      </div>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        color="primary"
        variant="text"
        size="small"
        @click.stop="handleDetailsClick"
        :disabled="!getDetailUrl()"
      >
        Details
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">

import { useConfig } from '../composables/useConfig'
import type { SearchResult } from '../types'

interface Props {
  result: SearchResult
}

const props = defineProps<Props>()
const { config } = useConfig()

const getTitle = (): string => {
  const collectionData = props.result[props.result.collection_name]
  if (!collectionData) return 'Unknown'
  
  switch (props.result.collection_name) {
    case 'bots':
      return collectionData.name || 'Unnamed Bot'
    case 'chains':
      return collectionData.name || 'Unnamed Chain'
    case 'conversations':
      return collectionData.title || collectionData.name || 'Unnamed Conversation'
    case 'workshops':
      return collectionData.name || 'Unnamed Workshop'
    case 'exercises':
      return collectionData.name || 'Unnamed Exercise'
    default:
      return collectionData.name || 'Unknown'
  }
}

const getDescription = (): string => {
  const collectionData = props.result[props.result.collection_name]
  if (!collectionData) return 'No description available'
  
  return collectionData.description || 'No description available'
}

const getKeyFields = (): Record<string, string> => {
  const collectionData = props.result[props.result.collection_name]
  if (!collectionData) return {}
  
  const keyFields: Record<string, string> = {}
  
  // Add key fields based on collection type
  switch (props.result.collection_name) {
    case 'bots':
      if (collectionData.type) keyFields.type = collectionData.type
      if (collectionData.status) keyFields.status = collectionData.status
      break
    case 'chains':
      if (collectionData.type) keyFields.type = collectionData.type
      if (collectionData.version) keyFields.version = collectionData.version
      break
    case 'conversations':
      if (collectionData.participants) keyFields.participants = collectionData.participants
      if (collectionData.status) keyFields.status = collectionData.status
      break
    case 'workshops':
      if (collectionData.duration) keyFields.duration = collectionData.duration
      if (collectionData.level) keyFields.level = collectionData.level
      break
    case 'exercises':
      if (collectionData.difficulty) keyFields.difficulty = collectionData.difficulty
      if (collectionData.category) keyFields.category = collectionData.category
      break
  }
  
  return keyFields
}

const getCollectionColor = (): string => {
  switch (props.result.collection_name) {
    case 'bots':
      return 'primary'
    case 'chains':
      return 'secondary'
    case 'conversations':
      return 'success'
    case 'workshops':
      return 'warning'
    case 'exercises':
      return 'info'
    default:
      return 'grey'
  }
}

const getDetailUrl = (): string | null => {
  if (!config.value?.config_items) return null
  
  const collectionName = props.result.collection_name
  const configKey = `${collectionName.toUpperCase()}_SPA_URL`
  
  const configItem = config.value.config_items.find(item => item.name === configKey)
  if (!configItem || !configItem.value || configItem.value === 'secret') {
    return null
  }
  
  // Build the detail URL with the collection ID
  return `${configItem.value}${props.result.collection_id}`
}

const handleCardClick = () => {
  const detailUrl = getDetailUrl()
  if (detailUrl) {
    window.location.href = detailUrl
  }
}

const handleDetailsClick = () => {
  const detailUrl = getDetailUrl()
  if (detailUrl) {
    window.location.href = detailUrl
  } else {
    console.warn('No detail URL configured for collection:', props.result.collection_name)
  }
}
</script>

<style scoped>
.search-result-card {
  border-radius: 12px;
  transition: transform 0.2s ease-in-out;
  cursor: pointer;
}

.search-result-card:hover {
  transform: translateY(-2px);
}

.v-card-title {
  background: #f8f9fa;
  border-radius: 12px 12px 0 0;
}
</style> 