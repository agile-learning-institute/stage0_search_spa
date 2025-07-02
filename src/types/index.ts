// API Response Types
export interface PaginationInfo {
  page: number
  page_size: number
  total_items: number
  total_pages: number
  has_next: boolean
  has_previous: boolean
}

export interface SearchResult {
  collection_id: string
  collection_name: string
  [key: string]: any // Additional fields vary by collection
}

export interface SearchResponse {
  items: SearchResult[]
  pagination: PaginationInfo
}

export interface SyncResult {
  id: string
  start_time: string
  collections: Array<{
    name: string
    count: number
    end_time: string
  }>
}

export interface SyncHistoryResponse {
  items: SyncResult[]
  pagination: PaginationInfo
}

export interface ConfigItem {
  name: string
  value: string
  from: 'default' | 'file' | 'environment'
}

export interface Token {
  user_id: string
  from_ip?: string
  roles: string[]
}

export interface Config {
  config_items: ConfigItem[]
  token: Token
  enumerators?: Record<string, string>
  versions?: string[]
}

export interface SyncPeriodicity {
  sync_period_seconds: number
}

// Collection-specific types
export interface Bot {
  name: string
  description?: string
  [key: string]: any
}

export interface Chain {
  name: string
  description?: string
  [key: string]: any
}

export interface Conversation {
  title?: string
  description?: string
  [key: string]: any
}

export interface Workshop {
  name: string
  description?: string
  [key: string]: any
}

export interface Exercise {
  name: string
  description?: string
  [key: string]: any
} 