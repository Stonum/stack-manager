<template>
  <v-list-item dense>
    <v-list-item-icon>
      <v-icon small :color="color"> mdi-circle </v-icon>
    </v-list-item-icon>

    <v-list-item-content>
      <v-list-item-title>{{ item.name }}</v-list-item-title>
      <v-list-item-subtitle>{{ item.path }} --inspect={{ item.port || '0000' }}</v-list-item-subtitle>
    </v-list-item-content>

    <v-list-item-action-text>
      <v-list-item-subtitle class="text-right">
        <v-btn icon tile small title="Перезапустить" @click="$emit('start', item.name)">
          <v-icon color="primary"> mdi-restart </v-icon>
        </v-btn>
        <v-btn icon tile small v-if="status === 2" title="Запустить" @click="$emit('start', item.name)">
          <v-icon color="primary"> mdi-play </v-icon>
        </v-btn>
        <v-btn icon tile small v-if="status !== 2" title="Остановить" @click="$emit('stop', item.name)">
          <v-icon color="error"> mdi-stop </v-icon>
        </v-btn>
      </v-list-item-subtitle>
    </v-list-item-action-text>
  </v-list-item>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

export default Vue.extend({
  name: 'AppItem',
  props: {
    item: { type: Object as PropType<ProjectApp>, required: true },
  },
  computed: {
    status(): number {
      return this.$store.getters['projectStore/getAppStatus'](this.item.name);
    },
    color(): number {
      return this.$store.getters['projectStore/getAppColor'](this.item.name);
    },
  },
});
</script>
