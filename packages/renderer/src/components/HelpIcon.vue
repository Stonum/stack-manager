<template>
  <v-menu open-on-hover left bottom offset-y offset-overflow>
    <template #activator="attrs">
      <v-btn icon="mdi-help-circle-outline" v-bind="attrs.props" flat density="compact" />
    </template>
    <v-card>
      <v-container>
        <span class="text-caption"><slot /></span>
      </v-container>
    </v-card>
  </v-menu>
</template>
