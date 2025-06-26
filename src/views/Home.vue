<script setup lang="ts">
import { ref } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import SchoolTable from '../components/SchoolTable.vue';
import { batteryService } from '../services/BatteryService';
import type { SchoolBatterySummary } from '@/types';

const summaries = ref<SchoolBatterySummary[]>([]);

const { isLoading, error } = useQuery({
  queryKey: ['batteryData'],
  queryFn: async () => {
    const data = await batteryService.fetchBatteryData();
    const result = batteryService.calculateBatteryConsumption(data);
    summaries.value = result;
    return result;
  }
});
</script>

<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Battery Health Dashboard</h1>
    <div v-if="isLoading" class="text-center">Loading...</div>
    <div v-else-if="error" class="text-red-500">Error: {{ error.message }}</div>
    <SchoolTable v-else :summaries="summaries" />
  </div>
</template>
