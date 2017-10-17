<template>
  <div class="layout-padding logo-container non-selectable no-pointer-events">
    <div class="logo">
      <img src="statics/quasar-logo-full.svg">
    </div>
  </div>
</template>

<style lang="stylus">
.logo-container
  width 255px
  height 242px
  perspective 800px
  position absolute
  top 50%
  left 50%
  transform translateX(-50%) translateY(-50%)
.logo
  position absolute
  transform-style preserve-3d
</style>
