export default {
  setMsg (state, msg) {
    state.msgList.push(msg)
  },
  setUser (state, user) {
    state.user = Object.assign({}, state.user, user)
  },
  setSocketId (state, id) {
    state.socketId = id
  },
  delSocketId (state) {
    state.socketId = null
  }
}