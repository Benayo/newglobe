import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Ref } from 'vue';
import type { SchoolBatterySummary } from '@/types';

export const useFilterStore = defineStore('filters', () => {
  const showUnhealthyOnly: Ref<boolean> = ref(false);
  const schoolIdFilter: Ref<number | null> = ref(null);

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
