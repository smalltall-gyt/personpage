import axios from '@/utils/request'

// 获取首页标语
export async function getBanner () {
  return await axios({
    url: '/api/banner',
    method: 'GET'
  })
}
// 修改首页标语
export async function updateBanner (data) {
  return await axios({
    url: '/api/banner',
    method: 'POST',
    data
  })
}
