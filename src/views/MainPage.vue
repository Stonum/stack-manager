<template>
  <v-container>
    <v-row>
      <v-col>
        <v-expansion-panels>
          <v-expansion-panel v-for="(item, idx) in items" :key="idx">
            <v-expansion-panel-header style="padding: 0">
              <v-app-bar flat color="rgba(0, 0, 0, 0)">
                <v-toolbar-title>
                  {{ item.name }}
                </v-toolbar-title>

                <v-spacer />

                <v-icon v-for="(task, idxtask) in item.tasks" :key="idxtask" small :color="taskColor(task.status)"> mdi-circle </v-icon>
              </v-app-bar>
            </v-expansion-panel-header>

            <v-expansion-panel-content>
              <v-list-item v-for="(task, idxtask) in item.tasks" :key="idxtask" dense>
                <v-list-item-icon>
                  <v-icon small :color="taskColor(task.status)"> mdi-circle </v-icon>
                </v-list-item-icon>

                <v-list-item-subtitle>{{ task.name }}</v-list-item-subtitle>

                <v-list-item-subtitle class="text-right">
                  <v-btn icon>
                    <v-icon color="primary"> mdi-play </v-icon>
                  </v-btn>
                  <v-btn icon>
                    <v-icon color="primary"> mdi-stop </v-icon>
                  </v-btn>
                </v-list-item-subtitle>
              </v-list-item>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'Main',
  data() {
    return {
      items: [
        {
          name: 'Магнитогорск',
          tasks: [
            { name: 'ЮЛ', status: 0 },
            { name: 'ФЛ', status: 2 },
            { name: 'Админ', status: 1 },
          ],
        },
        {
          name: 'Норильск',
          tasks: [
            { name: 'ЮЛ', status: 0 },
            { name: 'ФЛ', status: 2 },
            { name: 'Коммун', status: 0 },
            { name: 'Админ', status: 0 },
          ],
        },
      ],
    };
  },
  methods: {
    taskColor(status: number) {
      switch (status) {
        case 0:
          return 'green';
        case 1:
          return 'warning';

        default:
          return 'error';
      }
    },
  },
});
</script>
