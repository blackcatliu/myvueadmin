import request from '@/utils/request'
export function getRoutes() {
  return request({
    url: '/routes',
    method: 'get'
  })
}
export function getUser(params) {
  return request({
    url: '/user/list',
    method: 'get',
    data: params
  })
}

export function addUser(params) {
  return request({
    url: '/sys/user/save',
    method: 'post',
    data: params
  })
}
export function updateuser(id, params) {
  return request({
    url: '/sys/user/update',
    method: 'post',
    data: params
  })
}

export function deleteuser(id) {
  return request({
    url: '/sys/user/delete',
    method: 'delete'
  })
}
