import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { SchoolBatterySummary } from '@/types';

export const useFilterStore = defineStore('filters', () => {
  const showUnhealthyOnly = ref(false);
  const schoolIdFilter = ref<number | null>(null);

  const filteredSchools = computed(() => (schools: SchoolBatterySummary[]) => {
    console.log(
      'filteredSchools called, schoolIdFilter:',
      schoolIdFilter.value,
      'schools:',
      schools
    );
    if (!schoolIdFilter.value) return schools;
    return schools.filter((school) => school.academyId === schoolIdFilter.value);
  });

  return { showUnhealthyOnly, schoolIdFilter, filteredSchools };
});
