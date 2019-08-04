import request from '@/utils/request'

export function getRoutes() {
  return request({
    url: '/sys/menu/list',
    method: 'get'
  })
}

export function getRoles(params) {
  return request({
    url: '/sys/role/list',
    method: 'get',
    params: params
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

export function deleteRole(id) {
  return request({
    url: '/sys/role/delete',
    method: 'delete'
  })
}

export function getLogList(params) {
  return request({
    url: '/sys/log/list',
    method: 'get',
    params: params
  })
}

