<template>
  <div>
    <app-header></app-header>
    <div class="visited-detail-wrap w">
      <h2>{{contacts.locationInfo.name}}</h2>
      <h5>{{contacts.locationInfo.city}} {{contacts.locationInfo.state}}</h5>
      <ul class="visited-ul">
        <li class="visited-ul-li" v-for="(item,index) in contacts.contact" :key="index">
          <div class="visited-ul-li-title">
            <span>{{item.preciseLocation}}</span>
            <span class="visited-ul-li-number">1</span>
          </div>
          <p>{{dateFormat(item.time)}}</p>
        </li>
      </ul>
    </div>
    <app-nav></app-nav>
  </div>
</template>

<script>
import {getContacts, dateFormat} from '@/api/firebase'
export default {
  components: {
    'app-nav': () => import('@/components/nav'),
    'app-header': () => import('@/components/header')
  },
  created () {
    getContacts().then(res => {
      this.contacts = res[this.$route.params.id]
    })
  },
  data () {
    return {
      contacts: []
    }
  },
  methods: {
    dateFormat (date) {
      return dateFormat(Date(date), true)
    }
  }
}
</script>

<style scoped>
.visited-ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.visited-ul-li {
  border-bottom: 1px solid #e5e5e5;
  margin: 10px 0;
}

.visited-ul-li .visited-ul-li-title {
  font-weight: bold;
  display: flex;
  justify-content: space-between;
}

.visited-ul-li-number {
  font-size: 25px;
}
</style>
