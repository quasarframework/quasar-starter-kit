<template>
  <div class="fixed-center text-center">
    <p>
      <q-icon :name="$q.icon.type.warning" size="10rem" color="light"/>
    </p>
    <p class="text-faded">Sorry, nothing here...<strong>(404)</strong></p>
    <q-btn
      color="secondary"
      style="width:200px"
      @click="$router.push('/')"
    >Go back</q-btn>
  </div>
</template>
