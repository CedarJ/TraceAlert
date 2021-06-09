<template>
  <div>
    <app-header></app-header>
    <div class="sign-up-wrap w">
      <h2></h2>
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item prop="phone">
          <el-input placeholder="Phone Number" v-model="form.phone"></el-input>
        </el-form-item>
        <el-form-item prop="email">
          <el-input placeholder="Email Address" type="email" v-model="form.email"></el-input>
        </el-form-item>
        <div class="form-item-inline-wrap">
          <el-form-item prop="firstname">
            <el-input placeholder="First Name"  v-model="form.firstname"></el-input>
          </el-form-item>
          <div></div>
          <el-form-item prop="surname">
            <el-input placeholder="Last Name" v-model="form.surname"></el-input>
          </el-form-item>
        </div>
        <el-form-item prop="dateOfBirth">
          <el-date-picker v-model="form.dateOfBirth" type="date" placeholder="Birthday">
          </el-date-picker>
        </el-form-item>
        <el-form-item prop="address">
          <el-input placeholder="Address" v-model="form.address"></el-input>
        </el-form-item>
        <div class="form-item-inline-wrap">
          <el-form-item prop="city">
            <el-input placeholder="City" v-model="form.city"></el-input>
          </el-form-item>
          <div></div>
          <el-form-item prop="state">
            <el-input placeholder="State" v-model="form.state"></el-input>
          </el-form-item>
        </div>
        <el-form-item prop="postalCode">
          <el-input placeholder="Postal code" v-model="form.postalCode"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit">Submit</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {getUserInfo, updateUser} from '@/api/firebase'

export default {
  methods: {
    submit () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          updateUser(this.form).then(() => {
            this.$message.success('updated user profile success!')
          }).catch(() => {
            this.$message.error('updated user profile error!')
          })
        }
      })
    }
  },
  data () {
    return {
      form: {},
      rules: {
        firstname: [
          { required: true, message: 'Please Enter', trigger: 'blur' }
        ],
        email: [
          { required: true, message: 'Please Enter', trigger: 'blur' }
        ],
        address: [
          { required: true, message: 'Please Enter', trigger: 'blur' }
        ],
        surname: [
          { required: true, message: 'Please Enter', trigger: 'blur' }
        ],
        dateOfBirth: [
          { required: true, message: 'Please Enter', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: 'Please Enter', trigger: 'blur' }
        ],
        city: [
          { required: true, message: 'Please Enter', trigger: 'blur' }
        ],
        state: [
          { required: true, message: 'Please Enter', trigger: 'blur' }
        ],
        postalCode: [
          { required: true, message: 'Please Enter', trigger: 'blur' }
        ]
      }
    }
  },
  components: {
    'app-header': () => import('@/components/header')
  },
  created () {
    getUserInfo().then(res => {
      this.form = res
    })
  }
}
</script>

<style scoped>

.form-item-inline-wrap {
  display: flex;
  justify-content: space-between;
}

.form-item-inline-wrap > div {
  flex: 1;
}

.form-item-inline-wrap > .el-form-item {
  flex: 6;
}

</style>
