<template>
  <DeviceOverview/>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import DeviceOverview from "./views/DeviceOverview.vue";

export default defineComponent({
  name: 'App',
  components: {
    DeviceOverview
  }
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
h1 {
  margin: 0;
  padding: 0;
}
table {
  border-spacing: 0;
}
</style>
