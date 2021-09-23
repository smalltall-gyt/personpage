import axios from '@/utils/request'

// 修改密码
export async function updateAdmin (data) {
  return await axios({
    url: '/api/admin',
    method: 'PUT',
    data
  })
}
