<template>
  <div id="app">
    <router-view/>
    <app-nav></app-nav>
  </div>
</template>

<script>
export default {
  name: 'App',
  components: {
    'app-nav': () => import('@/components/nav')
  }
}
</script>

<style>

.w{
  margin: 0 auto;
  width: 90%;
}

body{
  padding-bottom: 70px;
}

</style>
