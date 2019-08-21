var request = require('request')
var users = require('../data/user')
var msgList = require('../data/msg')

module.exports = (app) => {
  /**
   * 获取随机头像
   */
  app.get('/avatar', function(req, res){
    request('https://api.uomg.com/api/rand.avatar?format=json', function(err, response, body){
      if (!err && response.statusCode == 200) {
        const bodyObj = JSON.parse(body)
        res.json({imgurl: bodyObj.imgurl})
      }
    })
  }),

  /**
   * 读取用户列表
   */
  app.get('/users', function(req, res){
    let userList = users.map(item => {
      const {avatar, name, id, desc, socketId} = item
      return {avatar, name, id, desc, socketId}
    })
    res.json({
      code: true,
      data: userList
    })
  })

  /**
   * 新增用户
   */
  app.post('/regist', function(req, res){
    let clientUser = req.body
    request('https://api.uomg.com/api/rand.avatar?format=json', function(err, response, body){
      if (!err && response.statusCode == 200) {
        const bodyObj = JSON.parse(body)
        clientUser.avatar = bodyObj.imgurl
        clientUser.id = new Date().getTime().toString(16),
        clientUser.desc = '',
        users.push(clientUser)
        res.json({
          code: true,
          avatar: clientUser.avatar,
          desc: clientUser.desc,
          name: clientUser.name,
          id: clientUser.id
        })
      } else {
        res.json({
          code: false,
          data: '注册失败'
        })
      }
    })
  })
  
  /**
   * login
   */
  app.post('/login', function(req, res){
    let clientUser = req.body
    let dataUser = users.filter(user => user.name === clientUser.name)[0]
    if(dataUser) {
      if(dataUser.pwd === clientUser.pwd){
        const user = {
          avatar: dataUser.avatar,
          desc: dataUser.desc,
          name: dataUser.name,
          id: dataUser.id
        }
        dataUser.socketId = clientUser.socketId
        res.json({code: true, user })
      } else {
        res.json({
          code: false,
          data: '用户名或密码错误'
        })
      }
    } else {
      request('https://api.uomg.com/api/rand.avatar?format=json', function(err, response, body){
        if (!err && response.statusCode == 200) {
          const bodyObj = JSON.parse(body)
          const user = {
            avatar: bodyObj.imgurl,
            desc: "",
            name: clientUser.name,
            id: new Date().getTime().toString(16).substr(4),
            pwd: clientUser.pwd,
            socketId: clientUser.socketId
          }
          users.push(user)
          res.json({code: true, user })
        }
      })
    }
  })

  app.get('/msg', function(req, res){
    const {id} = req.query
    const result = msgList.filter(msg => msg.sign.indexOf(id) !== -1)
    res.json({code: true, result })
  })
}