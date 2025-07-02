<template>
  <v-container fluid class="pa-0 admin-bg min-h-screen">
    <v-row justify="center" class="ma-0 pa-0">
      <v-col cols="12" md="8" lg="6" class="py-8">
        <v-card class="mb-6 elevation-6" color="primary" variant="tonal">
          <v-card-title class="d-flex justify-space-between align-center spa-title-card">
            <span class="text-h6">Admin</span>
            <v-btn
              color="primary"
              variant="outlined"
              size="small"
              class="ml-2"
              @click="$router.push('/search')"
            >
              Back to Search
            </v-btn>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="d-flex align-center justify-center">
            <span class="text-h6 mr-4">SPA Built At:</span>
            <span class="text-h6 font-weight-bold">{{ spaBuiltAt }}</span>
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

        <!-- Token Information -->
        <v-card class="mb-6 elevation-3">
          <v-card-title class="text-h6 font-weight-bold">Token Information</v-card-title>
          <v-divider></v-divider>
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
        </v-card>

        <!-- Configuration Items -->
        <v-card class="mb-6 elevation-3">
          <v-card-title class="text-h6 font-weight-bold">Configuration Items</v-card-title>
          <v-divider></v-divider>
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
        </v-card>

        <!-- SPA Config Section -->
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
                      color="secondary"
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
                      color="info"
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

        <!-- Enumerators -->
        <v-card class="mb-6 elevation-3">
          <v-card-title class="text-h6 font-weight-bold">Enumerators</v-card-title>
          <v-divider></v-divider>
          <v-list>
            <v-list-item
              v-for="(value, key) in config?.enumerators"
              :key="key"
              class="py-2"
            >
              <v-list-item-title>{{ key }}</v-list-item-title>
              <v-list-item-subtitle>{{ value }}</v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card>

        <!-- Versions -->
        <v-card class="mb-6 elevation-3">
          <v-card-title class="text-h6 font-weight-bold">Versions</v-card-title>
          <v-divider></v-divider>
          <v-list>
            <v-list-item
              v-for="(version, idx) in config?.versions"
              :key="idx"
              class="py-2"
            >
              <v-list-item-title>{{ version }}</v-list-item-title>
            </v-list-item>
          </v-list>
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

const spaConfigExpanded = ref(true)
const showPeriodicityDialog = ref(false)
const periodicitySeconds = ref('300')
const syncing = ref(false)
const settingPeriodicity = ref(false)
const error = ref<string | null>(null)
const successMessage = ref<string | null>(null)
const periodicityError = ref<string | null>(null)

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
  } catch (err) {
    console.error('Failed to set periodicity:', err)
    error.value = 'Failed to set sync periodicity. Please try again.'
  } finally {
    settingPeriodicity.value = false
  }
}

onMounted(async () => {
  await fetchConfig()
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
.spa-title-card {
  min-height: 56px;
}
</style> 