<template>
  <v-footer app padless fixed>
    <v-container fluid class="pb-0">
      <v-card fluid :elevation="0">
        <v-tabs hide-slider :height="tabHeaderHight" v-model="activeTab">
          <v-tab @click="onClickTab(0)">Сообщения</v-tab>
          <v-tab @click="onClickTab(1)">События диспетчера</v-tab>

          <v-spacer />
          <v-btn color="primary" icon @click="onClickUpDown">
            <v-icon>{{ updownicon }}</v-icon>
          </v-btn>
        </v-tabs>

        <v-tabs-items v-model="activeTab" :style="`height: ${tabBodyHeight}px`">
          <v-tab-item>
            <message-list :items="messages" :height="tabBodyHeight" />
          </v-tab-item>
          <v-tab-item>
            <message-list :items="events" :height="tabBodyHeight" />
          </v-tab-item>
        </v-tabs-items>
      </v-card>
    </v-container>
  </v-footer>
</template>

<script lang="ts">
import Vue from 'vue';
import MessageList from '../MessageList/MessageList.vue';

export default Vue.extend({
  name: 'FooterBar',
  components: { MessageList },
  data() {
    const tabHeaderHight = 35;
    const tabBodyMaxHeight = tabHeaderHight * 8 - tabHeaderHight;
    return {
      tabHeaderHight,
      tabBodyMaxHeight,
      tabBodyHeight: 0,
      activeTab: null,
    };
  },
  computed: {
    messages(): Message[] {
      return this.$store.getters['mainStore/getMessages']().sort((a: Message, b: Message) => {
        return a.time < b.time ? 1 : -1;
      });
    },
    events(): Message[] {
      return this.$store.getters['projectStore/getEvents']();
    },
    collapsedFooter(): boolean {
      return this.tabBodyHeight === 0;
    },
    updownicon(): string {
      return this.collapsedFooter ? 'mdi-chevron-up' : 'mdi-chevron-down';
    },
  },
  methods: {
    onClickTab(tab: number) {
      if (this.collapsedFooter || tab === this.activeTab) {
        this.onClickUpDown();
      }
    },
    onClickUpDown() {
      this.tabBodyHeight = this.collapsedFooter ? this.tabBodyMaxHeight : 0;
      this.$emit('change', this.tabHeaderHight + this.tabBodyHeight);
    },
  },
  created() {
    this.$emit('change', this.tabHeaderHight + this.tabBodyHeight);
  },
});
</script>
