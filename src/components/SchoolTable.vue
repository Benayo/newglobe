<script setup lang="ts">
import { computed, defineProps, watch } from 'vue';
import { useFilterStore } from '@/stores/filters';
import { format } from 'date-fns';
import type { SchoolBatterySummary } from '@/types';

const props = defineProps<{
  summaries: SchoolBatterySummary[];
}>();

console.log('SchoolTable.vue: props.summaries:', props.summaries);

const filterStore = useFilterStore();

watch(
  () => filterStore.showUnhealthyOnly,
  (newValue, oldValue) => {
    console.log('showUnhealthyOnly changed:', { newValue, oldValue });
  }
);

const formatTimestamp = (timestamp: string): string => {
  try {
    return format(new Date(timestamp), 'MM/dd/yyyy HH:mm:ss');
  } catch (error) {
    console.error('Error formatting timestamp:', timestamp, error);
    return timestamp;
  }
};

const filteredSummaries = computed(() => {
  console.log('Computing filteredSummaries, showUnhealthyOnly:', filterStore.showUnhealthyOnly);
  console.log('Summaries prop:', props.summaries);
  console.log(
    'Unhealthy counts:',
    props.summaries.map((s) => ({ academyId: s.academyId, unhealthyCount: s.unhealthyCount }))
  );
  if (!props.summaries) {
    console.warn('Summaries prop is undefined or null');
    return [];
  }
  let filtered = props.summaries;
  if (filterStore.showUnhealthyOnly) {
    filtered = props.summaries.filter((s) => s.unhealthyCount > 0);
    console.log('After unhealthy filter:', filtered);
  }
  const result = filterStore.filteredSchools(filtered);
  console.log('Final filtered summaries:', result);
  return result;
});
</script>

<template>
  <div>
    <div class="mb-4">
      <label>
        <input v-model="filterStore.showUnhealthyOnly" type="checkbox" />
        Show Unhealthy Only
      </label>
      <select v-model="filterStore.schoolIdFilter" class="ml-4">
        <option :value="null">All Schools</option>
        <option
          v-for="summary in props.summaries"
          :key="summary.academyId"
          :value="summary.academyId"
        >
          School {{ summary.academyId }}
        </option>
      </select>
    </div>
    <table class="w-full border-collapse">
      <thead>
        <tr>
          <th class="border p-2">School ID</th>
          <th class="border p-2">Unhealthy Devices</th>
          <th class="border p-2">Details</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="!filteredSummaries.length && filterStore.showUnhealthyOnly" class="border p-2">
          <td colspan="3" class="text-center">No schools with unhealthy devices</td>
        </tr>
        <tr v-else-if="!filteredSummaries.length" class="border p-2">
          <td colspan="3" class="text-center">No data available</td>
        </tr>
        <tr v-for="summary in filteredSummaries" :key="summary.academyId">
          <td class="border p-2">{{ summary.academyId }}</td>
          <td class="border p-2">{{ summary.unhealthyCount }}</td>
          <td class="border p-2">
            <details>
              <summary>Show Devices</summary>
              <table class="w-full mt-2 border-collapse">
                <thead>
                  <tr>
                    <th class="border p-1">Serial Number</th>
                    <th class="border p-1">Daily Consumption</th>
                    <th class="border p-1">Status</th>
                    <th class="border p-1">Last Battery Level</th>
                    <th class="border p-1">Last Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="device in summary.devices" :key="device.serialNumber">
                    <td class="border p-1">{{ device.serialNumber }}</td>
                    <td class="border p-1">
                      {{
                        device.dailyConsumption === 'unknown'
                          ? 'Unknown'
                          : `${(device.dailyConsumption * 100).toFixed(1)}%`
                      }}
                    </td>
                    <td class="border p-1" :class="{ 'text-red-500': device.isUnhealthy }">
                      {{ device.isUnhealthy ? 'Unhealthy' : 'Healthy' }}
                    </td>
                    <td class="border p-1">{{ (device.lastBatteryLevel * 100).toFixed(1) }}%</td>
                    <td class="border p-1">{{ formatTimestamp(device.lastTimestamp) }}</td>
                  </tr>
                </tbody>
              </table>
            </details>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
