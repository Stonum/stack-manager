<template>
  <v-container fluid>
    <v-row>
      <v-col cols="3">
        <base-input v-model="project.name" label="Краткое название проекта" required @change="$emit('changeName')" />
      </v-col>
      <v-col cols="12">
        <base-input-folder v-model="project.path.git" label="Каталог проекта в git" :readonly="!isNewProject" @change="$emit('changeProjectFolder')" />
      </v-col>
      <template v-if="project.path.git">
        <v-col cols="12">
          <base-combobox
            v-if="isNewProject"
            v-model="project.path.ini"
            :items="inifiles"
            label="Путь к stack.ini"
            prepend-icon="mdi-file-document-outline"
            required
            @change="$emit('changeInIFile')"
          />
          <base-input-file v-else v-model="project.path.ini" label="Путь к stack.ini" required @change="$emit('changeInIFile')" />
        </v-col>
        <template v-if="isAppHost && project.gateway">
          <v-col cols="11">
            <base-input-folder v-model="project.gateway.path" label="StackGateway каталог" required />
          </v-col>
          <v-col cols="1">
            <base-input v-model="project.gateway.port" label="порт" required type="number" />
          </v-col>
        </template>
        <v-col cols="10">
          <base-input-folder v-model="project.path.front" label="Stack.Front каталог" />
        </v-col>
        <v-col cols="2">
          <base-input v-model.number="project.port" label="порт для публикации" type="number" />
        </v-col>
        <v-col cols="3">
          <base-input-history v-model.trim="project.sql.server" label="SQL сервер (psql порт можно указать через ':')" required :history-id="`${project.name}-server`" />
        </v-col>
        <v-col cols="3">
          <base-input-history v-model.trim="project.sql.base" label="База данных" :history-id="`${project.name}-base`" required />
        </v-col>
        <v-spacer />
        <v-col cols="2">
          <base-input v-model.trim="project.sql.login" label="Логин" required />
        </v-col>
        <v-col cols="2">
          <base-input v-model="project.sql.password" label="Пароль" />
        </v-col>
        <v-col cols="12">
          <base-input-folder v-model="project.path.version" label="Каталог версии" required />
        </v-col>
      </template>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

export default Vue.extend({
  name: 'CommonTab',
  props: {
    project: { type: Object as PropType<Project>, required: true },
    isNewProject: { type: Boolean, default: false },
    inifiles: { type: Array, required: true },
  },
  data() {
    return {
      inspectport: 0,
    };
  },
  computed: {
    isAppHost(): boolean {
      return this.project.type === 1;
    },
  },
});
</script>
