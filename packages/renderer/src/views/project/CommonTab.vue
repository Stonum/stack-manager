<template>
  <v-container fluid>
    <v-row>
      <v-col cols="9">
        <base-input-folder
          v-model="project.path.git"
          label="Каталог проекта в git"
          :readonly="!isNewProject" 
          required
          @update:model-value="emit('update:projectFolder')"
        />
      </v-col>
      <v-col>
        <base-autocomplete
          v-model="project.type"
          label="Тип проекта" 
          :items="[{ title: 'stack', value: 0 }, { title: 'app_host', value: 1 }]"
          :return-object="false"
          no-filter
          :readonly="!isNewProject" 
          @update:model-value="emit('update:projectType')"
        />
      </v-col>
      <template v-if="project.path.git">
        <v-col cols="12">
          <base-combobox
            v-if="props.isNewProject"
            v-model="project.path.ini"
            :items="props.inifiles"
            label="Путь к stack.ini"
            prepend-icon="mdi-file-document-outline"
            required
            no-filter
            @update:model-value="emit('update:iniFile')"
          />
          <base-input-file
            v-else 
            v-model="project.path.ini"
            label="Путь к stack.ini"
            required
            @update:model-value="emit('update:iniFile')"
          />
        </v-col>
        <template v-if="props.isAppHost && project.gateway">
          <v-col cols="9" md="10">
            <base-input-folder v-model="project.gateway.path" label="StackGateway каталог" required />
          </v-col>
          <v-col cols="3" md="2">
            <base-input v-model="project.gateway.port" label="порт" required type="number" />
          </v-col>
        </template>
        <v-col cols="9" md="10">
          <base-input-folder v-model="project.path.front" label="Stack.Front каталог" :hide-details="false" />
        </v-col>
        <v-col cols="3" md="2">
          <base-input v-model.number="project.port" label="порт для публикации" type="number" />
        </v-col>
        <v-col cols="3">
          <base-input-history v-model.trim="project.sql.server" label="SQL сервер (psql порт можно указать через ':')" required :history-id="`${project.name}-server`" />
        </v-col>
        <v-col cols="3">
          <base-input-history v-model.trim="project.sql.base" label="База данных" :history-id="`${project.name}-base`" required />
        </v-col>
        <v-spacer />
        <v-col cols="3" md="2">
          <base-input v-model.trim="project.sql.login" label="Логин" required />
        </v-col>
        <v-col cols="3" md="2">
          <base-input v-model="project.sql.password" label="Пароль" />
        </v-col>
        <v-col cols="12">
          <base-input-folder v-model="project.path.version" label="Каталог версии" required />
        </v-col>
        <v-col cols="10" md="5">
          <base-input v-model="project.restartMaxCount" type="number">
            <template #prepend>
              <span class="text-subtitle-1 d-flex align-end">
                Максимальное количество неуспешных перезапусков
              </span>
            </template>
          </base-input>
        </v-col>
      </template>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useVModel } from '@vueuse/core';

const props = defineProps<{
   modelValue: Project,
   isNewProject: boolean,
   isAppHost: boolean,
   inifiles: Array<any>
}>();

const emit = defineEmits<{
   (e: 'update:modelValue', modelValue: Settings): void,
   (e: 'update:iniFile'): void,
   (e: 'update:projectFolder'): void,
   (e: 'update:projectType'): void,
}
>();

const project = useVModel(props, 'modelValue', emit);
</script>