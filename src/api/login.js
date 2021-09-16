import axios from '@/utils/request'

// 获取验证码
export async function getCaptcha () {
  return await axios({
    url: '/res/captcha',
    method: 'GET'
  })
}
// 登录
export async function login (data) {
  return await axios({
    url: '/api/admin/login',
    method: 'POST',
    data
  })
}
// 恢复登录状态
export async function getUserInfo () {
  return await axios({
    url: '/api/admin/whoami',
    method: 'GET'
  })
}
