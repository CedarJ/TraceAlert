<template>
  <div>
    <app-header></app-header>
    <div class="text-wrap">
      <p>Stay Strong,</p>
      <p>Stay Safe</p>
    </div>

    <div class="button-wrap">
      <div class="btn-div">
        <el-button type="primary" @click="signUp">Sign Up</el-button>
      </div>
      <div class="btn-div">
        <el-button type="primary" @click="signIn">Sign In</el-button>
      </div>
    </div>

    <app-image></app-image>
  </div>
</template>

<script>
export default {
  methods: {
    signUp () {
      this.$router.push({
        path: '/signUp'
      })
    },
    signIn () {
      this.$router.push({
        path: '/signIn'
      })
    }
  },
  components: {
    'app-header': () => import('@/components/header'),
    'app-image': () => import('@/components/image')
  }
}
</script>

<style scoped>
.text-wrap {
  margin-top: 40%;
  text-align: center;
  font-size: 40px;
}

.button-wrap {
  text-align: center;
}
.btn-div {
  margin: 10px 0;
}
</style>
