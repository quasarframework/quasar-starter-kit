<template>
  <div class="fixed-center text-center">
    <p>
      <img
        src="~assets/sad.svg"
        style="width:30vw;max-width:150px;"
      >
    </p>
    <p class="text-faded">
      Sorry, nothing here...<strong>(404)</strong>
    </p>
    <q-btn
      color="secondary"
      style="width:200px;"
      to="/"
      label="Go back"
    />
  </div>
</template>

<script {{#preset.typescript}}lang="ts"{{/preset.typescript}}>
{{#if preset.typescript}}
import Vue as 'vue';

export default Vue.extend({
  name: 'Error404'
});
{{else}}
export default {
  name: 'Error404'
}
{{/if}}
</script>
