import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 10000,
})

instance.interceptors.request.use(function (config) {
  return config
});

instance.interceptors.response.use(function (res) {
  return Promise.resolve(res.data)
}, function(err){
  return Promise.resolve({
    code: false,
    data: err
  })
});

export default instance