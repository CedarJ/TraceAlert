<template>
  <div>
    <app-header></app-header>
    <el-row type="flex" class="row-bg" justify="end">
      <el-button type="primary" icon="el-icon-camera" style="margin-right: 20px;margin-top: 20px"></el-button>
    </el-row>
    <div class="w qr-code-wrap">
      <h2>{{user.firstname}} {{user.surname}}</h2>

      <h5>Updated at 2020-04-03 10:00:00</h5>
      <div class="pic">
        <img :src="qrCodeUrl">
      </div>
      <p>You have indirect contact with people whohave tested positive for covID-19 within thepast 2 weeks.</p>
      <el-button type="primary">Visit SA Health Website</el-button>
    </div>
  </div>
</template>

<script>
import {getUserInfo} from '@/api/firebase'

export default {
  components: {
    'app-header': () => import('@/components/header')
  },
  computed: {
    qrCodeUrl () {
      return 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Tracing' + this.user.uid.substring(0, 10)
    }
  },
  data () {
    return {
      user: {
        uid: ''
      }
    }
  },
  created () {
    getUserInfo().then(res => {
      this.user = res
    })
  }
}
</script>

<style scoped>
  .qr-code-wrap{
    text-align: center;
  }
</style>
