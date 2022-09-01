import { ref, computed } from 'vue';

export function useFooter(emit: any) {

  const tabHeaderHight = ref(30);
  const tabBodyMaxHeight = ref(tabHeaderHight.value * 8 - tabHeaderHight.value);
  const tabBodyHeight = ref(0);

  const collapsed = computed(() => tabBodyHeight.value === 0);
  const updownicon = computed(() => (collapsed.value ? 'mdi-chevron-up' : 'mdi-chevron-down'));

  function onClickUpDown() {
    tabBodyHeight.value = collapsed.value ? tabBodyMaxHeight.value : 0;
    emit('change', tabHeaderHight.value + tabBodyHeight.value);
  }

  emit('change', tabHeaderHight.value + tabBodyHeight.value);

  return {
    tabHeaderHight,
    tabBodyHeight,
    collapsed,
    updownicon,
    onClickUpDown
  };
}
