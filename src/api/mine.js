import axios from '@/utils/request'

// 获取我的页面的地址
export async function getURL () {
  return await axios({
    url: '/api/about',
    method: 'GET'
  })
}
// 设置我的页面的地址
export async function setURL (data) {
  return await axios({
    url: '/api/about',
    method: 'POST',
    data
  })
}
