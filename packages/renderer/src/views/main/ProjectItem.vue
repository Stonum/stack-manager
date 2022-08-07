<template>
  <v-card class="flex-grow-1">
    <v-card-item>
      <v-card-title>
        <v-row align="center" hide-gutters no-gutters>
          <v-col cols="6">
            {{ item.name }}
          </v-col>
          <v-col cols="6" class="text-right">
            <!-- <v-progress-circular class="mr-3" :size="20" :width="isRunning ? 2 : 0" color="primary" :indeterminate="isRunning" /> -->
            <v-menu bottom left offset-y>
              <template #activator="attrs">
                <v-btn icon flat v-bind="attrs.props">
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>

              <v-list class="pa-0">
                <v-list-item v-for="(action, i) in projectActions" :key="i" @click="action.method">
                  <template #prepend>
                    <v-icon :color="action.color">
                      {{ action.icon }}
                    </v-icon>
                  </template>
                  <v-list-item-title>{{ action.name }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-col>
        </v-row>
      </v-card-title>

      <v-row justify="space-between" hide-gutters no-gutters>
        <v-col cols="5">
          <v-btn icon flat :title="projectUrl" :disabled="!item.port">
            <v-icon color="primary">
              mdi-web
            </v-icon>
          </v-btn>
          <v-btn icon flat title="Workspace" @click="onOpenWorkspace">
            <v-icon color="blue">
              mdi-microsoft-visual-studio-code
            </v-icon>
          </v-btn>
        </v-col>

        <v-col cols="7" class="text-right">
          <v-btn icon flat title="Обновить гит" :loading="projectStatus.pulling" @click="onGitPull">
            <v-icon color="accent">
              mdi-briefcase-download
            </v-icon>
          </v-btn>
          <v-btn icon flat title="Собрать фронт" :loading="projectStatus.deploying" @click="onBuildFront">
            <v-icon color="accent">
              mdi-code-tags-check
            </v-icon>
          </v-btn>
          <v-btn icon flat title="Перезапустить" @click="onRestart">
            <v-icon color="primary">
              mdi-restart
            </v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-card-item>

    <v-list dense>
      <!-- <app-item v-for="(app, idxtask) in item.apps" :key="idxtask" :item="app" @restart="onRestart($event)" @start="onStart($event)" @stop="onStop($event)" /> -->
    </v-list>
  </v-card>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

const props = defineProps({
   item: { type: Object, required: true },
   id: { type: Number, required: true },
});

const emit = defineEmits(['edit', 'delete']);

const projectActions = [
   {
      name: 'Редактировать',
      icon: 'mdi-pencil',
      color: 'primary',
      method: () => {
         emit('edit');
      },
   },
   {
      name: 'Удалить',
      icon: 'mdi-delete',
      color: 'error',
      method: () => {
         emit('delete');
      },
   },
];

const projectUrl = computed(() => {
   return `http://localhost:${props.item.port || '0000'}`;
});

const projectStatus = computed(() => {
   return {};
});

const onOpenWorkspace = () => { };
const onGitPull = () => { };
const onBuildFront = () => { };
const onRestart = () => { };

// import AppItem from './AppItem.vue';

// export default Vue.extend({
//   name: 'ProjectItem',
//   components: { AppItem },
//   model: { prop: 'item' },
//   props: {
//     item: { type: Object as PropType<Project>, required: true },
//     id: { type: Number, required: true },
//   },
//   data() {
//     return {
//       projectActions: [] as any[],
//     };
//   },
//   computed: {
//     projectUrl() {
//       return `http://localhost:${this.item.port || '0000'}`;
//     },
//     projectStatus(): ProjectCondition {
//       return this.$store.getters['projectStore/getProjectStatus'](this.item.name);
//     },
//     isRunning(): boolean {
//       if (!this.projectStatus) {
//         return false;
//       }
//       return !!this.projectStatus.building || !!this.projectStatus.restarting;
//     },
//   },

//   mounted() {
//     this.projectActions.push({
//       name: 'Редактировать',
//       icon: 'mdi-pencil',
//       color: 'primary',
//       method: () => {
//         this.$emit('edit');
//       },
//     });
//     this.projectActions.push({
//       name: 'Удалить',
//       icon: 'mdi-delete',
//       color: 'error',
//       method: () => {
//         this.$emit('delete');
//       },
//     });
//   },

//   methods: {
//     ...mapActions('projectStore', ['projectSendJob', 'getAppStatus', 'getEvents']),
//     ...mapActions('mainStore', ['openURL']),

//     setProjectStatus(status: ProjectCondition) {
//       this.$store.commit('projectStore/PROJECT_SET_STATUS', { name: this.item.name, status });
//     },

//     async onStop(appname?: string) {
//       await this.projectSendJob({ jobName: 'appStop', projectId: this.id, params: appname });
//       this.getAppStatus();
//       this.getEvents();
//     },
//     async onStart(appname?: string) {
//       await this.projectSendJob({ jobName: 'appStart', projectId: this.id, params: appname });
//       this.getAppStatus();
//       this.getEvents();
//     },
//     async onRestart(appname?: string) {
//       this.setProjectStatus({ restarting: true });
//       try {
//         if (appname && typeof appname === 'string') {
//           await this.projectSendJob({ jobName: 'appReStart', projectId: this.id, params: appname });
//         } else {
//           for (const app of this.item.apps) {
//             if (app.active) {
//               await this.projectSendJob({ jobName: 'appReStart', projectId: this.id, params: app.name });
//             }
//           }
//         }
//       } finally {
//         this.setProjectStatus({ restarting: false });
//         this.getAppStatus();
//         this.getEvents();
//       }
//     },

//     async onBuildFront() {
//       this.setProjectStatus({ deploying: true });
//       try {
//         await this.projectSendJob({ jobName: 'buildFront', projectId: this.id });
//       } finally {
//         this.setProjectStatus({ deploying: false });
//       }
//     },

//     async onGitPull() {
//       this.setProjectStatus({ pulling: true });
//       try {
//         await this.projectSendJob({ jobName: 'gitPull', projectId: this.id });
//       } finally {
//         this.setProjectStatus({ pulling: false });
//       }
//     },

//     onOpenUrl(e: Event) {
//       e.preventDefault();
//       this.openURL({ url: this.projectUrl });
//     },

//     onOpenWorkspace() {
//       this.projectSendJob({ jobName: 'openWorkspace', projectId: this.id });
//     },

//     appColor(name: string | undefined) {
//       return this.$store.getters['projectStore/getAppColor'](name);
//     },
//   },
// });
</script>
