import axios from '@/utils/request'

// 获取所有评论
export async function getComment (params) {
  return await axios({
    url: '/api/comment',
    method: 'GET',
    params
  })
}
// 删除评论
export async function deleteComment (commentId) {
  return await axios({
    url: `/api/comment/${commentId}`,
    method: 'DELETE'
  })
}
// 添加评论
export async function addComment (data) {
  return await axios({
    url: '/api/comment',
    method: 'POST',
    data
  })
}
