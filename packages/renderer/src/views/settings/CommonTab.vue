<template>
  <v-container fluid>
    <v-row no-gutters>
      <v-col cols="8">
        <base-input v-model="settings.dispatcher_url" label="Диспетчер ( адрес : порт )" placeholder="http://<url>:<port>" prepend-icon="mdi-web" clearable />
      </v-col>
      <v-spacer />
      <v-col cols="3">
        <base-input v-model="settings.dispatcher_password" label="Пароль" clearable />
      </v-col>
      <v-col cols="8">
        <base-input v-model="settings.rabbitmq_url" label="RabbitMQ ( адрес : порт )" placeholder="http://<url>:<port>" prepend-icon="mdi-web" clearable />
      </v-col>
      <v-col cols="12">
        <base-input-folder v-model="settings.stackversion" label="Локальный каталог Stack.Version" clearable>
          <template #append>
            <help-icon>
              Локальный каталог для версий. Сюда будет копироваться каталог версии. Если не указан, будем использовать ссылку на каталог версии указанной при создании
            </help-icon>
          </template>
        </base-input-folder>
      </v-col>
      <v-col cols="12">
        <base-input-folder v-model="settings.bin" label="Общий каталог bin" clearable>
          <template #append>
            <help-icon>Общий каталог где будут создаваться папки для запуска веб сервиса. Если не заполнен, создаем в bin проекта</help-icon>
          </template>
        </base-input-folder>
      </v-col>
      <v-col cols="12">
        <base-input-folder v-model="settings.jre" label="Каталог jre" clearable>
          <template #append>
            <help-icon>Каталог jre</help-icon>
          </template>
        </base-input-folder>
      </v-col>
      <v-col cols="12">
        <base-input-folder v-model="settings.workspacePath" label="Каталог vs-code workspace" required>
          <template #append>
            <help-icon>Каталог в котором будут находиться сгенерированные рабочие области для vs-code</help-icon>
          </template>
        </base-input-folder>
      </v-col>
      <v-col cols="3">
        <base-input v-model="settings.refresh_interval" label="Интервал обномления статусов приложений" type="number" suffix="мс" />
      </v-col>
      <v-col cols="12">
        <v-switch v-model="settings.fullLogging" class="my-0" label="Полное логирование ( включает логирование всех запросов после перезапуска )" density="compact" hide-details />
      </v-col>
      <v-col cols="12">
        <v-switch v-model="settings.colorBlindMode" class="my-0" label="Режим цветовой слепоты" density="compact" hide-details />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useVModel } from '@vueuse/core';

const props = defineProps<{
   modelValue: Settings
}>();

const emit = defineEmits<{ (e: 'update:modelValue', modelValue: Settings): void }>();

const settings = useVModel(props, 'modelValue', emit);
</script>
