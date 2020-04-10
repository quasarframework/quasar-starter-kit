<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script {{#preset.typescript}}lang="ts"{{/preset.typescript}}>
export default {
  name: 'App'
}
</script>
