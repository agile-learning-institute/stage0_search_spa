<template>
  <v-container fluid class="pa-0 admin-bg min-h-screen">
    <v-row justify="center" class="ma-0 pa-0">
      <v-col cols="12" md="8" lg="6" class="py-8">
        <!-- Page Title -->
        <div class="text-center mb-8">
          <h1 class="text-h3 font-weight-bold text-primary">Admin</h1>
        </div>

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

        <!-- Success Alert -->
        <v-alert
          v-if="successMessage"
          type="success"
          variant="tonal"
          class="mb-6"
          closable
          @click:close="successMessage = null"
        >
          {{ successMessage }}
        </v-alert>

        <!-- SPA Config -->
        <v-card class="mb-6 elevation-3">
          <v-card-title class="text-h6 font-weight-bold d-flex align-center">
            <span>SPA Config</span>
            <v-spacer></v-spacer>
            <v-btn
              :icon="spaConfigExpanded ? 'mdi-chevron-up' : 'mdi-chevron-down'"
              variant="text"
              size="small"
              @click="spaConfigExpanded = !spaConfigExpanded"
            ></v-btn>
          </v-card-title>
          <v-divider></v-divider>
          <v-expand-transition>
            <div v-show="spaConfigExpanded">
              <v-card-text>
                <div class="d-flex align-center justify-center mb-4">
                  <span class="text-h6 mr-4">SPA Built At:</span>
                  <span class="text-h6">{{ spaBuiltAt }}</span>
                </div>
                <div class="d-flex align-center justify-center mb-4">
                  <span class="text-h6 mr-4">Current Sync Period:</span>
                  <span class="text-h6">{{ getCurrentSyncPeriod() }}</span>
                </div>
                <v-row>
                  <v-col cols="12" sm="6">
                    <v-btn
                      color="primary"
                      variant="outlined"
                      block
                      @click="syncAll"
                      :loading="syncing"
                      :disabled="syncing"
                    >
                      <v-icon left>mdi-sync</v-icon>
                      Sync All Collections
                    </v-btn>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-btn
                      color="primary"
                      variant="outlined"
                      block
                      @click="$router.push('/synced')"
                    >
                      <v-icon left>mdi-history</v-icon>
                      View Sync History
                    </v-btn>
                  </v-col>
                </v-row>
                <v-row class="mt-4">
                  <v-col cols="12">
                    <v-btn
                      color="primary"
                      variant="outlined"
                      block
                      @click="showPeriodicityDialog = true"
                    >
                      <v-icon left>mdi-clock-outline</v-icon>
                      Set Sync Periodicity
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card-text>
            </div>
          </v-expand-transition>
        </v-card>

        <!-- Token Information -->
        <v-card class="mb-6 elevation-3">
          <v-card-title class="text-h6 font-weight-bold d-flex align-center">
            <span>Token Information</span>
            <v-spacer></v-spacer>
            <v-btn
              :icon="tokenExpanded ? 'mdi-chevron-up' : 'mdi-chevron-down'"
              variant="text"
              size="small"
              @click="tokenExpanded = !tokenExpanded"
            ></v-btn>
          </v-card-title>
          <v-divider></v-divider>
          <v-expand-transition>
            <div v-show="tokenExpanded">
              <v-card-text>
                <v-list>
                  <v-list-item class="py-2">
                    <v-list-item-title>User ID</v-list-item-title>
                    <v-list-item-subtitle>{{ config?.token?.user_id }}</v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item v-if="config?.token?.from_ip" class="py-2">
                    <v-list-item-title>IP Address</v-list-item-title>
                    <v-list-item-subtitle>{{ config.token.from_ip }}</v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item class="py-2">
                    <v-list-item-title>Roles</v-list-item-title>
                    <v-list-item-subtitle>
                      <v-chip
                        v-for="role in config?.token?.roles"
                        :key="role"
                        class="mr-1"
                        size="small"
                      >
                        {{ role }}
                      </v-chip>
                    </v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </div>
          </v-expand-transition>
        </v-card>

        <!-- Configuration Items -->
        <v-card class="mb-6 elevation-3">
          <v-card-title class="text-h6 font-weight-bold d-flex align-center">
            <span>Configuration Items</span>
            <v-spacer></v-spacer>
            <v-btn
              :icon="configExpanded ? 'mdi-chevron-up' : 'mdi-chevron-down'"
              variant="text"
              size="small"
              @click="configExpanded = !configExpanded"
            ></v-btn>
          </v-card-title>
          <v-divider></v-divider>
          <v-expand-transition>
            <div v-show="configExpanded">
              <v-card-text>
                <v-list>
                  <v-list-item
                    v-for="item in config?.config_items"
                    :key="item.name"
                    class="py-2"
                  >
                    <v-list-item-title>{{ item.name }}</v-list-item-title>
                    <v-list-item-subtitle>
                      {{ item.value }} ({{ item.from }})
                    </v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </div>
          </v-expand-transition>
        </v-card>

        <!-- Enumerators -->
        <v-card class="mb-6 elevation-3">
          <v-card-title class="text-h6 font-weight-bold d-flex align-center">
            <span>Enumerators</span>
            <v-spacer></v-spacer>
            <v-btn
              :icon="enumeratorsExpanded ? 'mdi-chevron-up' : 'mdi-chevron-down'"
              variant="text"
              size="small"
              @click="enumeratorsExpanded = !enumeratorsExpanded"
            ></v-btn>
          </v-card-title>
          <v-divider></v-divider>
          <v-expand-transition>
            <div v-show="enumeratorsExpanded">
              <v-card-text>
                <div v-if="config?.enumerators && config.enumerators.length > 0">
                  <div v-for="(enumGroup, groupIndex) in config.enumerators" :key="groupIndex" class="mb-4">
                    <v-card variant="outlined" class="mb-3">
                      <v-card-title class="text-h6 font-weight-bold d-flex align-center py-2">
                        <v-icon class="mr-2" color="primary">mdi-format-list-bulleted</v-icon>
                        <span>{{ enumGroup.name }}</span>
                        <v-chip size="small" color="secondary" class="ml-2">{{ enumGroup.status }}</v-chip>
                        <v-chip size="small" color="info" class="ml-2">v{{ enumGroup.version }}</v-chip>
                        <v-spacer></v-spacer>
                        <v-btn
                          :icon="enumGroupExpanded[groupIndex] ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                          variant="text"
                          size="small"
                          @click="toggleEnumGroup(groupIndex)"
                        ></v-btn>
                      </v-card-title>
                      <v-expand-transition>
                        <div v-show="enumGroupExpanded[groupIndex]">
                          <v-divider></v-divider>
                          <v-card-text class="pt-2">
                            <div v-if="enumGroup.enumerators && Object.keys(enumGroup.enumerators).length > 0">
                              <div v-for="(value, key) in enumGroup.enumerators" :key="key" class="mb-3">
                                <v-card variant="outlined" class="mb-2">
                                  <v-card-title class="text-subtitle-1 font-weight-bold d-flex align-center py-1">
                                    <span class="text-primary">{{ key }}</span>
                                    <v-spacer></v-spacer>
                                    <v-btn
                                      :icon="enumExpanded[`${groupIndex}-${key}`] ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                                      variant="text"
                                      size="small"
                                      @click="toggleEnum(key, groupIndex)"
                                    ></v-btn>
                                  </v-card-title>
                                  <v-expand-transition>
                                    <div v-show="enumExpanded[`${groupIndex}-${key}`]">
                                      <v-divider></v-divider>
                                      <v-card-text class="py-1">
                                        <div
                                          v-for="(itemValue, itemKey) in value"
                                          :key="itemKey"
                                          class="text-body-2 py-1"
                                        >
                                          <span class="font-weight-medium">{{ itemKey }}:</span>
                                          <span class="ml-1">{{ itemValue }}</span>
                                        </div>
                                      </v-card-text>
                                    </div>
                                  </v-expand-transition>
                                </v-card>
                              </div>
                            </div>
                            <div v-else class="text-center py-2 text-grey">
                              No enumerators in this group
                            </div>
                          </v-card-text>
                        </div>
                      </v-expand-transition>
                    </v-card>
                  </div>
                </div>
                <div v-else class="text-center py-4 text-grey">
                  No enumerators available
                </div>
              </v-card-text>
            </div>
          </v-expand-transition>
        </v-card>

        <!-- Versions -->
        <v-card class="mb-6 elevation-3">
          <v-card-title class="text-h6 font-weight-bold d-flex align-center">
            <span>Versions</span>
            <v-spacer></v-spacer>
            <v-btn
              :icon="versionsExpanded ? 'mdi-chevron-up' : 'mdi-chevron-down'"
              variant="text"
              size="small"
              @click="versionsExpanded = !versionsExpanded"
            ></v-btn>
          </v-card-title>
          <v-divider></v-divider>
          <v-expand-transition>
            <div v-show="versionsExpanded">
              <v-card-text>
                <div v-if="config?.versions && config.versions.length > 0">
                  <v-row>
                    <v-col
                      v-for="version in config.versions"
                      :key="version._id"
                      cols="12"
                      sm="6"
                      md="4"
                    >
                      <v-card variant="outlined" class="pa-3">
                        <div class="d-flex align-center mb-2">
                          <v-icon class="mr-2" color="primary">mdi-database</v-icon>
                          <div class="text-subtitle-2 font-weight-bold text-primary">
                            {{ version.collection_name }}
                          </div>
                        </div>
                        <div class="text-body-2">
                          <span class="font-weight-medium">Current Version:</span>
                          <v-chip size="small" color="success" class="ml-2">
                            {{ version.current_version }}
                          </v-chip>
                        </div>
                      </v-card>
                    </v-col>
                  </v-row>
                </div>
                <div v-else class="text-center py-4 text-grey">
                  No versions available
                </div>
              </v-card-text>
            </div>
          </v-expand-transition>
        </v-card>
      </v-col>
    </v-row>

    <!-- Periodicity Dialog -->
    <v-dialog v-model="showPeriodicityDialog" max-width="400">
      <v-card>
        <v-card-title>Set Sync Periodicity</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="periodicitySeconds"
            label="Period (seconds)"
            type="number"
            min="0"
            variant="outlined"
            hint="0 to disable periodic sync"
            persistent-hint
            :error-messages="periodicityError"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="showPeriodicityDialog = false">Cancel</v-btn>
          <v-btn
            color="primary"
            @click="setPeriodicity"
            :loading="settingPeriodicity"
          >
            Set
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useConfig } from '../composables/useConfig'
import { searchAPI } from '../utils/api'
import { getSpaBuiltAt } from '../utils/buildInfo'

const router = useRouter()
const { config, fetchConfig } = useConfig()
const spaBuiltAt = getSpaBuiltAt()

// Expansion states for all cards
const spaConfigExpanded = ref(true)
const tokenExpanded = ref(false)
const configExpanded = ref(false)
const enumeratorsExpanded = ref(false)
const versionsExpanded = ref(false)

const showPeriodicityDialog = ref(false)
const periodicitySeconds = ref('300')
const syncing = ref(false)
const settingPeriodicity = ref(false)
const error = ref<string | null>(null)
const successMessage = ref<string | null>(null)
const periodicityError = ref<string | null>(null)
const currentSyncPeriod = ref<number>(0)

const enumGroupExpanded = ref<Record<number, boolean>>({})
const enumExpanded = ref<Record<string, boolean>>({})

const syncAll = async () => {
  syncing.value = true
  error.value = null
  successMessage.value = null
  
  try {
    await searchAPI.syncAll()
    successMessage.value = 'Sync completed successfully!'
    router.push('/synced')
  } catch (err) {
    console.error('Sync failed:', err)
    error.value = 'Failed to sync collections. Please try again.'
  } finally {
    syncing.value = false
  }
}

const setPeriodicity = async () => {
  const seconds = parseInt(periodicitySeconds.value)
  if (isNaN(seconds) || seconds < 0) {
    periodicityError.value = 'Please enter a valid number (0 or greater)'
    return
  }
  
  settingPeriodicity.value = true
  error.value = null
  successMessage.value = null
  periodicityError.value = null
  
  try {
    await searchAPI.setSyncPeriodicity(seconds)
    successMessage.value = `Sync periodicity updated to ${seconds} seconds`
    showPeriodicityDialog.value = false
    // Fetch the updated sync periodicity
    await fetchCurrentSyncPeriod()
  } catch (err) {
    console.error('Failed to set periodicity:', err)
    error.value = 'Failed to set sync periodicity. Please try again.'
  } finally {
    settingPeriodicity.value = false
  }
}

const toggleEnumGroup = (groupIndex: number) => {
  enumGroupExpanded.value[groupIndex] = !enumGroupExpanded.value[groupIndex]
}

const toggleEnum = (key: string, groupIndex: number) => {
  const keyName = `${groupIndex}-${key}`
  enumExpanded.value[keyName] = !enumExpanded.value[keyName]
}

const fetchCurrentSyncPeriod = async () => {
  try {
    const response = await searchAPI.getSyncPeriodicity()
    currentSyncPeriod.value = response.data.sync_period_seconds
  } catch (err) {
    console.error('Failed to fetch sync periodicity:', err)
    currentSyncPeriod.value = 0
  }
}

const getCurrentSyncPeriod = (): string => {
  const period = currentSyncPeriod.value
  if (period === 0) return 'Disabled'
  if (period < 60) return `${period} seconds`
  if (period < 3600) return `${Math.floor(period / 60)} minutes`
  return `${Math.floor(period / 3600)} hours`
}

onMounted(async () => {
  await Promise.all([
    fetchConfig(),
    fetchCurrentSyncPeriod()
  ])
})
</script>

<style scoped>
.admin-bg {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
}
.v-card {
  border-radius: 18px;
}
.v-card-title {
  background: #f0f4fa;
}
</style> 