<template>
  <div>
    <div class="nav-wrap">
      <ul class="nav">
        <li class="nav-li" v-for="(item, index) in nav" :key="index" :class="item.text === selectedTab? 'bg-red' : ''">
          <div class="nav-li-icon">
            <i :class="item.icon"></i>
          </div>
          <div class="nav-li-text" @click="selectTab(item.text)">
            <router-link :to="item.path">{{ item.text }}</router-link>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      selectedTab: 'Information',
      nav: [
        {
          icon: 'el-icon-location-outline',
          text: 'Visited',
          path: '/visited'
        },
        {
          icon: 'el-icon-full-screen',
          text: 'My Qr Code',
          path: '/qr'
        },
        {
          icon: 'el-icon-user-solid',
          text: 'Information',
          path: '/mime'
        }
      ]
    }
  },

  methods: {
    selectTab (tabName) {
      this.selectedTab = tabName
    }
  }
}
</script>

<style scoped>
.nav-wrap {
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
  height: 60px;
  background-color: #5e00e9;
}

.nav-wrap .nav {
  display: flex;
  margin: 0;
  padding: 0;
  justify-content: space-between;
  list-style: none;
  color: #e5e5e5;
}

.nav .nav-li {
  flex: 1;
  text-align: center;
  line-height: 25px;
  padding: 5px 0;
}

.nav-li > .nav-li-icon {
  font-size: 30px;
}
.nav-li > .nav-li-text {
  font-size: 14px;
}

.nav-li > .nav-li-text>a{
    font-size: 14px;
    color: #E5E5E5;
    text-decoration: none;
}

.bg-red {
  background-color: red;
}
</style>
