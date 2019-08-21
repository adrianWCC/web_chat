<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  sockets: {
    connect() {
      this.$store.commit('setSocketId', this.$socket.id)
      if(this.user.id){
        this.$socket.emit('update_socket_id', {userId: this.user.id, socketId: this.$socket.id})
      }
    },
    connected() {}
  },
  computed: {
    user () {
      return this.$store.state.user
    }
  }
}
</script>