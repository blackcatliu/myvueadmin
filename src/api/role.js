import request from '@/utils/request'

export function getRoutes() {
  return request({
    url: '/routes',
    method: 'get'
  })
}

export function getRoles(params) {
  return request({
    url: '/sys/role/list',
    method: 'get',
    data: params
  })
}

export function addRole(params) {
  return request({
    url: '/sys/role/save',
    method: 'post',
    data: params
  })
}
export function searRole(id, params) {
  return request({
    url: `/sys/role/info/${id}`,
    method: 'post',
    data: params
  })
}
export function updateRole(id, params) {
  return request({
    url: '/sys/role/update',
    method: 'post',
    data: params
  })
}

export function deleteRole(id, params) {
  return request({
    url: '/sys/role/delete',
    method: 'post',
    data: params
  })
}
