<template>
  <div class="fullscreen bg-blue text-white text-center q-pa-md flex flex-center">
    <div>
      <div style="font-size: 30vh">
        404
      </div>

      <div class="text-h2" style="opacity:.4">
        Oops. Nothing here...
      </div>

      <q-btn
        class="q-mt-xl"
        color="white"
        text-color="blue"
        unelevated
        to="/"
        label="Go Home"
        no-caps
      />
    </div>
  </div>
</template>

{{#if preset.typescript}}
<script lang="ts">
{{#if_eq typescriptConfig "composition"}}import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'Error404',
});{{/if_eq}}{{#if_eq typescriptConfig "class"}}import { Vue, Component } from 'vue-property-decorator';

@Component
export default class Error404 extends Vue {}{{/if_eq}}{{#if_eq typescriptConfig "options"}}import Vue from 'vue';

export default Vue.extend({
  name: 'Error404'
});{{/if_eq}}
</script>
{{else}}
<script>
export default {
  name: 'Error404'
}
</script>
{{/if}}
