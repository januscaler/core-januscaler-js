<script setup lang="ts">
import { RouterView } from 'vue-router';

</script>

<template>
  <div>
    <div style="padding: 10px;display: flex;gap: 10px;">
      <router-link to="/">home</router-link>
      <router-link to="/videocall">videocall</router-link>
    </div>
    <Suspense>
      <RouterView></RouterView>
  </Suspense>
  </div>
</template>

<style scoped>
body{
  
}
</style>
