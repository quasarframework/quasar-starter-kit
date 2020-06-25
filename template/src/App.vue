<template>
  <div id="q-app">
    <router-view />
  </div>
</template>
{{#if preset.typescript}}
<script lang="ts">
{{#if_eq typescriptConfig "composition"}}import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'App',
});{{/if_eq}}{{#if_eq typescriptConfig "class"}}import { Vue, Component } from 'vue-property-decorator';

@Component
export default class App extends Vue {}{{/if_eq}}{{#if_eq typescriptConfig "options"}}import Vue from 'vue';

export default Vue.extend({
  name: 'App'
});{{/if_eq}}
</script>
{{else}}
<script>
export default {
  name: 'App'
}
</script>
{{/if}}
