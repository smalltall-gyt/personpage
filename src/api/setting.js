import axios from '@/utils/request'

// 获取设置
export async function getSetting () {
  return await axios({
    url: '/api/setting',
    method: 'GET'
  })
}
// 修改全局设置
export async function updateSetting (data) {
  return await axios({
    url: '/api/setting',
    method: 'PUT',
    data
  })
}
