import requestList from '@/utils/request'

const request = requestList[0]

export function login(data) {
  return request({
    url: `/login?userphone=${data.username}&password=${data.password} `,
    method: 'get'
  })
}

export function getInfo(token) {
  return request({
    url: '/vue-element-admin/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}
