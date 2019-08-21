<template>
  <div class="page">
    <div class="login-box">
      <i-form :model="form" @submit.native.prevent :rules="form.rule">
        <FormItem prop="user">
          <i-input v-model="form.user">
            <Icon type="ios-person-outline" slot="prepend"></Icon>
          </i-input>
        </FormItem>
        <FormItem prop="password">
          <i-input v-model="form.password" type="password">
            <Icon type="ios-lock-outline" slot="prepend"></Icon>
          </i-input>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="login">登录/注册</Button>
        </FormItem>
      </i-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      form: {
        user: '',
        password: '',
        rule: {
          user: [
            { required: true, message: 'Please fill in the user name', trigger: 'blur' }
          ],
          password: [
            { required: true, message: 'Please fill in the password.', trigger: 'blur' },
            { type: 'string', min: 6, message: 'The password length cannot be less than 6 bits', trigger: 'blur' }
          ]
        }
      }
    }
  },
  methods: {
    async login() {
      const {code, user, data} = await this.$api.post('/login', {
        name: this.form.user,
        pwd: this.form.password,
        socketId: this.socketId
      })
      if(code) {
        this.$store.commit('setUser', user)
        this.$router.push({path: '/'})
        this.$socket.emit('update_socket_id', {userId: user.id, socketId: this.$socket.id})
        return
      }
      this.$Notice.error({
        title: data
      })
    }
  },
  computed: {
    socketId() {
      return this.$store.state.socketId
    }
  }
}
</script>

<style lang="scss" scoped>
.page{
  height: 100vh;
  width: 100%;
  position: relative;
  background-color: #F2F2F2;
  background: url('../assets/bg.jpg') no-repeat center;
  .login-box{
    width: 300px;
    height: 350px;
    position: absolute;
    right: 100px;
    top: 30%
  }
}
</style>