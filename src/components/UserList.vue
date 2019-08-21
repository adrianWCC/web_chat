<template>
  <div class="list" @click="handeleSelect">
    <div class="list-avatar">
      <Badge :count="count" :offset="[]" class-name="badge">
        <Avatar shape="square" size="large" :src="user.avatar"></Avatar>
      </Badge>
      <span v-if="!user.socketId" class="shape"></span>
    </div>
    <div class="list-content">
      <p class="title">{{user.name}}</p>
      <p class="desc">{{user.desc}}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserList',
  props: ['user', 'owerId'],
  methods: {
    handeleSelect() {
      this.$emit('handeleSelect', this.user)
    }
  },
  computed: {
    count() {
      if(this.user.id === this.owerId) return 0
      if(!this.user.msgList) return 0
      return this.user.msgList.filter(msg => (msg.toId === this.owerId && msg.mark === false)).length
    }
  }
}
</script>

<style lang="scss" scope>
.list{
  width: 100%;
  display: flex;
  padding: 5px 10px;
  height: 60px;
  &:hover{
    background-color: #F3F3F3;
  }
  .list-avatar{
    height: 50px;
    line-height: 50px;
    margin-right: 10px;
    position: relative;
    .shape{
      position: absolute;
      width: 40px;
      height: 40px;
      background-color: #000;
      border-radius: 4px;
      opacity: 0.6;
      left: 0;
      top: 6px;
    }
  }
  .list-content{
    .title{
      font-size: 18px;
    }
    .desc{
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
    }
  }
}
</style>