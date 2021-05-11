<template>
  <div>
    <app-header></app-header>
    <div class="info-wrap w">
      <div class="info-avatar">
        <div class="image">
          <img src="static/avatar.png" alt="" />
        </div>
        <div class="text">{{user.firstname}} {{user.surname}}</div>
      </div>
      <div class="info-item">
        <i class="el-icon-date"></i>
        <span>{{user.dateOfBirth}}</span>
      </div>
      <div class="info-item">
        <i class="el-icon-mobile-phone"></i>
        <span>{{user.phone}}</span>
      </div>
      <div class="info-item">
        <i class="el-icon-message"></i>
        <span>{{user.email}}</span>
      </div>
      <div class="info-item">
        <i class="el-icon-location-outline"></i>
        <span>{{user.city}}</span>
      </div>
      <el-button type="primary" @click="edit">Edit</el-button>
      <el-button type="primary" @click="signOut">Sign Out</el-button>
    </div>
  </div>
</template>

<script>
import {getUserInfo} from '@/api/firebase'

export default {
  components: {
    'app-header': () => import('@/components/header')
  },
  data () {
    return {
      user: {

      }
    }
  },
  methods: {
    edit () {
      this.$router.push({
        path: '/profile'
      })
    },
    signOut () {
      this.$router.push({
        path: '/'
      })
    },
    getUserInfo () {
      getUserInfo().then(res => {
        this.user = res
      })
    }

  },
  created () {
    this.getUserInfo()
  }
}
</script>

<style scoped>
.info-avatar {
  display: flex;
  height: 80px;
  margin: 20px 0;
}

.info-avatar .image {
  flex: 2;
}
.info-avatar .image img {
  width: 80px;
}

.info-avatar .text {
  flex: 5;
  line-height: 80px;
  font-size: 20px;
}

.info-item {
  height: 50px;
  line-height: 50px;
  font-size: 16px;
}

.info-item > i {
  font-weight: bold;
  font-size: 20px;
  margin-right: 10px;
}
</style>
