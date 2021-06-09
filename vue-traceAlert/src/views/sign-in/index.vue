<template>
  <div>
    <app-header></app-header>
    <div class="sign-up-wrap w">
      <h2>Sign In</h2>
      <el-form :rules="rules" :model="form" ref="form">
        <el-form-item prop="email">
          <el-input placeholder="Phone Number/Email Address" v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input placeholder="Password" type="password" v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit">SignIn</el-button>
        </el-form-item>
      </el-form>
    </div>
    <app-image></app-image>
  </div>
</template>

<script>
import {login} from '@/api/firebase'

export default {
  methods: {
    submit () {
      const {email, password} = this.form
      this.$refs['form'].validate((valid) => {
        if (valid) {
          login(email, password).then(() => {
            this.$message.success('Sign In Success!')
            this.$router.push({
              path: '/mime'
            })
          }).catch(() => {
            this.$message.error('Your email or password is wrong. Please login again')
          })
        }
      })
    }
  },
  data () {
    return {
      form: {
        email: '',
        password: ''
      },
      rules: {
        email: [
          { required: true, message: 'Please Enter', trigger: 'blur' }
        ],
        password: [
          { required: true, message: 'Please Enter', trigger: 'blur' }
        ]
      }
    }
  },
  components: {
    'app-header': () => import('@/components/header'),
    'app-image': () => import('@/components/image')
  }
}
</script>

<style scoped>
</style>
