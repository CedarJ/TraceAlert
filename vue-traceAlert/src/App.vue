<template>
  <div id="app">
    <router-view/>
    <app-nav v-if="!(currentRouteName == 'Index' || currentRouteName == 'SignIn')"></app-nav>
  </div>
</template>

<script>
export default {
  name: 'App',
  components: {
    'app-nav': () => import('@/components/nav')
  },
  computed: {
    currentRouteName () {
      return this.$route.name
    }
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
