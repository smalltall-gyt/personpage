import axios from '@/utils/request'

// 获取所有的留言信息
export async function getMessage (params) {
  return await axios({
    url: '/api/message',
    method: 'GET',
    params
  })
}
// 删除留言
export async function deleteMessage (messageId) {
  return await axios({
    url: `/api/message/${messageId}`,
    method: 'DELETE'
  })
}
// 添加留言
export async function addMessage (data) {
  return await axios({
    url: '/api/message',
    method: 'POST',
    data
  })
}
