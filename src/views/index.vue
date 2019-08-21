<template>
  <div class="page">
    <Row class="row">
      <i-Col span="7" class="left-box">
        <Tabs :animated="false">
          <TabPane label="Message">
            <template v-for="custom in customs">
              <UserList :src="custom.avatar" @handeleSelect="handleSelect" :user="custom" :key="custom.id" :owerId="user.id"></UserList>
            </template>
          </TabPane>
          <TabPane label="Topic">Topic</TabPane>
        </Tabs>
      </i-Col>
      <i-Col span="16" offset="1" class="right-box">
        <div class="split">
          <Split v-model="split" mode="vertical">
              <div slot="top" class="split-pane">
                <div class="title">
                  <Avatar class="avatar" shape="square" :src="target.avatar"></Avatar>
                </div>
                <ul class="msg-box">
                  <template v-for="(msg, index) in target.msgList">
                    <li class="msg-item msg-item-left" v-if="msg.fromId !== user.id" :key="index">
                      <Avatar class="avatar" shape="square" :src="target.avatar"></Avatar>
                      <span class="msg">{{msg.msg}}</span>
                    </li>
                    <li class="msg-item msg-item-right" v-else :key="index">
                      <span class="msg">{{msg.msg}}</span>
                      <Avatar class="avatar" shape="square" :src="user.avatar"></Avatar>
                    </li>
                  </template>
                </ul>
              </div>
              <div slot="bottom" class="split-pane">
                <Input class="send-box" v-model="sendMsg" type="textarea" @on-keypress="handleSendMsg" placeholder="Enter something..." />
              </div>
          </Split>
        </div>
      </i-Col>
    </Row>
  </div>
</template>

<script>
import UserList from '../components/UserList'
export default {
  name: 'Index',
  data() {
    return {
      split: 0.5,
      sendMsg: '',
      src: 'https://i.loli.net/2017/08/21/599a521472424.jpg',
      customs: [],
      msgList: [],
      lastMsg: {},
      targetId: null
    }
  },
  async mounted() {
    await this.getUserList()
    this.getMsgList()
  },
  methods: {
    handleSendMsg(e) {
      if(e.key !== 'Enter') return
      e.preventDefault()
      this.$socket.emit('chat message', {
        source: this.user,
        msg: this.sendMsg,
        target: this.target
      })
      this.sendMsg = ''
    },
    handleSelect(target) {
      if(target.id === this.user.id) return
      this.targetId = target.id
      this.mark()
      this.$socket.emit('chatRead', this.targetId)
    },
    mark() {
      let msgList = this.customs.filter(cus => cus.id === this.targetId)[0].msgList || []
      msgList.forEach(msg => {
        msg.mark = true
      })

      this.customs = JSON.parse(JSON.stringify(this.customs))
    },
    async getUserList() {
      const {code, data} = await this.$api.get('/users')
      if(code) {
        this.customs = data
      }
    },
    async getMsgList() {
      const {code, result} = await this.$api.get(`/msg?id=${this.user.id}`)
      if(code) {
        this.msgList = result
      }
    }
  },
  computed: {
    user() {
      return this.$store.state.user
    },
    target() {
      return this.customs.filter(cus => cus.id === this.targetId)[0] || {}
    }
  },
  watch: {
    lastMsg: {
      handler(val) {
        if(val.fromId === this.target.id) {
          this.lastMsg.mark = true
          this.$socket.emit('chatRead', this.targetId)
        }
        this.customs.forEach(cus => {
          if(cus.id === val.fromId || cus.id === val.toId) {
            cus.msgList ? cus.msgList.push(val) : cus.msgList = [val]
          }
        });
        this.$nextTick(() => {
          this.customs = JSON.parse(JSON.stringify(this.customs))
        })
      }
    },
    msgList: {
      deep: true,
      immediate: true,
      handler(val) {
        if(!val) return
        for(let i=0; i<val.length; i++) {
          const item = val[i]
          for(let j=0; j<this.customs.length; j++) {
            const custom = this.customs[j]
            if(item.sign.indexOf(custom.id) !== -1) {
              custom.msgList ? custom.msgList = [...custom.msgList, ...item.list] : custom.msgList = [...item.list]
              custom.msgList.sort((a, b) => (a.time - b.time))
            }
          }
        }
        this.$nextTick(() => {
          this.customs = JSON.parse(JSON.stringify(this.customs))
        })
      }
    }
  },
  components: {UserList},
  sockets: {
    connect() {
    },
    customEmit(data) {
      this.$store.commit('setMsg', data)
    },
    async updateUserList(){
      await this.getUserList()
      this.getMsgList
    },
    newMsg(data) {
      this.lastMsg = data
    }
  }
}
</script>>

<style lang="scss" scoped>
.page{
  height: 100vh;
  background-color: #E3E8EE;
  padding: 40px;
}
.left-box{
  background-color: #fff;
  height: 100%;
  border-radius: 10px;
  overflow-x: hidden;
}
.row{
  height: 100%;
}
/deep/ .left-box{
  .ivu-tabs-nav{
    width: 100%;
    .ivu-tabs-tab{
      width: 50%;
      text-align: center;
    }
  }
}
.right-box{
  height: 100%;
  background-color: #fff;
  .split{
    height: 100%;
    border-radius: 5px;
  }
  .split-pane{
    height: 100%;
  }
  .title{
    padding: 5px 15px;
    background-color: #aaa;
  }
  .send-box{
    height: 100%;
    padding-top: 6px;
    /deep/ textarea.ivu-input{
      height: 100%;
      border: 0;
      box-shadow: none;
      padding: 15px;
      &:active, &:hover, &:focus{
        border: 0;
        box-shadow: none
      }
    }
  }
  .msg-box{
    height: calc(100% - 45px);
    overflow-y: auto;
    padding: 5px 15px;
    margin: 0;
    list-style: none;
    font-size: 16px;
    .msg-item{
      padding: 0;
      margin: 0;
      list-style: none;
      margin: 10px 0;
      display: flex;
      .msg{
        display: inline-block;
        max-width: 40%;
        border-radius: 3px;
        padding: 3px 5px;
        background-color: #86DB49;
        margin-left: 10px;
      }
      &.msg-item-right{
        justify-content: flex-end;
        .msg{
          margin: 0 10px 0;
        }
      }
    }
  }
}
</style>