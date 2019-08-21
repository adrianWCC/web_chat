var express = require('express');
var path = require('path')
var app = express()
var bodyParser = require('body-parser');
var http = require('http').createServer(app);
const route = require('./route/index')
var cors = require('cors')

var users = require('./data/user')
var msgList = require('./data/msg')

var io = require('socket.io')(http, {
  path: '/socket',
  serveClient: true,
  // below are engine.IO options
  pingInterval: 10000,
  pingTimeout: 5000,
  cookie: false
});

app.use(bodyParser.json())

app.use(cors())

app.use(express.static(path.join(__dirname, 'dist')))

app.get('/', function(req, res){
  res.sendFile(__dirname + '/dist/index.html')
})

route(app)

io.on('connection', function(socket){
  console.log('user connected');
  io.emit('connected', 'connected')

  // 收到客户端消息
  socket.on('chat message', function(data){
    // 发送给所有客户端
    // io.emit('customEmit', msg);

    const {source, msg, target} = data
    const sign = source.id+target.id
    const reverseSign = target.id + source.id
    let talk = msgList.filter(item => (item.sign === sign || item.sign === reverseSign))[0]
    if(talk) {
      talk.list.push({
        fromId: source.id,
        toId: target.id,
        msg: msg,
        time: new Date().getTime(),
        mark: false
      })
      if(talk.list.length >= 50) {
        talk.list.shift()
      }
    } else {
      msgList.push({
        sign: sign,
        list: [{
          fromId: source.id,
          toId: target.id,
          msg: msg,
          time: new Date().getTime(),
          mark: false
        }]
      })
    }
    // 发送给指定客户端
    io.to(target.socketId).emit('newMsg', {
      fromId: source.id,
      toId: target.id,
      msg: msg,
      time: new Date().getTime(),
      mark: false
    })
    // 发送给当前客户端
    socket.emit('newMsg', {
      fromId: source.id,
      toId: target.id,
      msg: msg,
      time: new Date().getTime(),
      mark: false
    });
  });

  socket.on('update_socket_id', function(data) {
    const {userId, socketId} = data
    if(userId){
      users.filter(item => item.id === userId)[0].socketId = socketId
      io.emit('updateUserList', {userId, socketId});
    }
  })

  socket.on('chatRead', function(userId){
    let msgGroup = msgList.filter(msg => msg.sign.indexOf(userId) !== -1)[0]
    if(msgGroup && msgGroup.list) {
      msgGroup.list.forEach(item => {
        if(item.fromId === userId) {
          item.mark = true
        }
      })
    }
  })

  socket.on('disconnect', function () {
    let disUser = users.filter(item => item.socketId === socket.id)[0]
    if(disUser) {
      disUser.socketId = null
      io.emit('updateUserList', {userId: disUser.id, socketId: null});
    }
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000')
})