import axios from '@/utils/request'

// 获取所有项目
export async function getProject () {
  return await axios({
    url: '/api/project',
    method: 'GET'
  })
}
// 新增项目
export async function addProject (data) {
  return await axios({
    url: '/api/project',
    method: 'POST',
    data
  })
}
// 删除项目
export async function deleteProject (projectId) {
  return await axios({
    url: `/api/project/${projectId}`,
    method: 'DELETE'
  })
}
// 修改项目
export async function updateProject (projectId, data) {
  return await axios({
    url: `/api/project/${projectId}`,
    method: 'PUT',
    data
  })
}
