<template>
  <div>
    <app-header></app-header>
    <div class="visited-wrap w">
      <h2>Places Visited</h2>
      <h5>since {{dateFormat(new Date())}}</h5>
      <ul class="visited-ul">
        <li class="visited-ul-li" v-for="(item,index) in contacts" :key="index" @click="toDetail(index)">
          <div class="visited-ul-li-title">
              <span>{{item.locationInfo.name}}</span>
              <span class="visited-ul-li-number">{{item.contact.length}}</span>
          </div>
          <p>Last time visited: {{dateFormat(item.contact[item.contact.length-1].time)}}</p>
        </li>
      </ul>
      <p>Total number of places: {{contacts.length}}</p>
      <p>Total number of people met: {{totalPeoples}}</p>
    </div>
    <app-nav></app-nav>
  </div>
</template>

<script scoped>
import {getContacts, dateFormat} from '@/api/firebase'
export default {
  components: {
    'app-nav': () => import('@/components/nav'),
    'app-header': () => import('@/components/header')
  },
  methods: {
    toDetail (id) {
      this.$router.push({
        path: '/visited/detail/' + id
      })
    },
    dateFormat (date) {
      return dateFormat(Date(date), true)
    }
  },
  created () {
    getContacts().then(res => {
      this.contacts = res
      console.log(res)
    })
  },
  data () {
    return {
      contacts: []
    }
  },
  computed: {
    totalPeoples () {
      let sum = 0
      this.contacts.forEach(item => {
        sum += item.contact.length
      })
      return sum
    }
  }
}
</script>

<style>
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

.visited-ul-li-number{
    font-size: 25px;
}
</style>
