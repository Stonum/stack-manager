<template>
  <v-container fluid>
    <v-table density="compact">
      <thead>
        <th class="text-left">
          <span>Название</span>
        </th>
        <th class="text-left">
          <span>Имя</span>
        </th>
        <th v-if="!isAppHost" class="text-left">
          <span>Путь</span>
        </th>
        <th v-if="!hidePort" class="text-left">
          <span>Порт</span>
        </th>
        <th v-if="!hideCols" class="text-left">
          <span> Доп. аргументы</span>
        </th>
        <template v-if="!hideCols && isAppHost">
          <th class="text-left">
            <span>Потоки</span>
          </th>
          <th class="text-left">
            <span>Асинх потоки </span>
          </th>
          <th class="text-left">
            <span> Асинх работы</span>
          </th>
        </template>
      </thead>
      <tbody>
        <template v-for="(app, idx) in props.apps" :key="app.id">
          <tr>
            <td class="pl-0" style="width: 30em">
              <base-checkbox
                :key="app.id"
                v-model="app.selected"
                :label="app.title"
                hide-details
                density="compact" 
                @update:model-value="emit('select', idx, $event)"
              />
            </td>
            <td class="pl-0" style="width: 15em">
              <base-input v-model="app.name" hide-details />
            </td>
            <td v-if="!isAppHost" class="pl-0" style="width: 15em">
              <base-input v-model="app.path" hide-details />
            </td>
            <td v-if="!hidePort" class="pl-0" style="width: 10em">
              <base-input v-model="app.port" type="number" hide-details title="Порт для отладки" />
            </td>
            <td v-if="!hideCols" class="pl-0" style="width: 15em">
              <base-input v-model="app.args" hide-details title="Дополнительные аргументы строки запуска" />
            </td>
            <template v-if="!hideCols && isAppHost">
              <td class="pl-0">
                <base-input v-model="app.syncThreadCount" type="number" hide-details title="Количество синхронных потоков" />
              </td>
              <td class="pl-0">
                <base-input v-model="app.asyncThreadCount" type="number" hide-details title="Количество асинхронных потоков" />
              </td>
              <td class="pl-0">
                <base-input v-model="app.asyncTaskCount" type="number" hide-details title="Количество асинхронных работ" />
              </td>
            </template>
          </tr>
        </template>
      </tbody>
    </v-table>
  </v-container>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useDisplay } from 'vuetify';
const { name } = useDisplay();

const hideCols = computed(() => name.value === 'md' || name.value === 'sm' || name.value === 'xs');
const hidePort = computed(() => name.value === 'sm' || name.value === 'xs');

const props = defineProps<{
   apps: SelectableApp[],
   isAppHost: boolean
}>();

const emit = defineEmits<{
   (e: 'update:apps', apps: SelectableApp): void,
   (e: 'select', id: number, checked: boolean): void,
}
>();
</script>