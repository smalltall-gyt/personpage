import axios from '@/utils/request'

// 分页获取博客
export async function getBlogByPage (params) {
  return await axios({
    url: '/api/blog',
    method: 'GET',
    params
  })
}
// 添加博客
export async function addBlog (data) {
  return await axios({
    url: '/api/blog',
    method: 'POST',
    data
  })
}
// 删除博客
export async function deleteBlog (blogId) {
  return await axios({
    url: `/api/blog/${blogId}`,
    method: 'DELETE',
  })
}
// 编辑博客
export async function updateBlog (blogId, data) {
  return await axios({
    url: `/api/blog/${blogId}`,
    method: 'PUT',
    data
  })
}
// 根据id 获取博客详情
export async function getBlogById (blogId) {
  return await axios({
    url: `/api/blog/${blogId}`,
    method: 'GET'
  })
}
// 获取博客分类
export async function getBlogType () {
  return await axios({
    url: '/api/blogtype',
    method: 'GET',
  })
}
// 添加博客分类
export async function addBlogType (data) {
  return await axios({
    url: '/api/blogtype',
    method: 'POST',
    data
  })
}
// 修改博客分类
export async function updateBlogType (blogId, data) {
  return await axios({
    url: `/api/blogtype/${blogId}`,
    method: 'PUT',
    data
  })
}
// 删除博客分类
export async function deleteBlogType (blogId) {
  return await axios({
    url: `/api/blogtype/${blogId}`,
    method: 'DELETE',
  })
}
