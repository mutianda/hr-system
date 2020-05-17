
import requestList from '@/utils/request'

const request = requestList[0]

export function workerList(data) {
  return request({
    url: `/workerList`,
    method: 'get'
  })
}
export function updatePhone(data) {
  return request({
    url: `/updatePhone`,
    method: 'post',
    data
  })
}
export function getAllUserSign(data) {
  return request({
    url: `/getAllUserSign?pageSize=${data.pageSize}&currentPage=${data.currentPage}&userId=${data.userId}`,
    method: 'get'
  })
}
export function selectSalary(data) {
  return request({
    url: `/selectSalary?pageSize=${data.pageSize}&currentPage=${data.currentPage}&userId=${data.userId}`,
    method: 'get'
  })
}

export function getAllUserLeaveList(data) {
  return request({
    url: `/getAllUserLeave?pageSize=${data.pageSize}&currentPage=${data.currentPage}&userId=${data.userId}&role=${data.role}`,
    method: 'get'
  })
}

export function getMyLeave(data) {
  return request({
    url: `/getMyLeave?pageSize=${data.pageSize}&currentPage=${data.currentPage}&userId=${data.userId}&status=${data.status}`,
    method: 'get'
  })
}

export function computeSalary(data) {
  return request({
    url: `/computeSalary`,
    method: 'get'
  })
}

export function agreeLeaveApi(data) {
  return request({

    url: `/agreeLeave?signId=${data.signId}&agree=${data.agree}&time=${data.time}`,
    method: 'get'
  })
}
export function agreeOutApi(data) {
  return request({

    url: `/agreeOut?outId=${data.outId}&agree=${data.agree}&time=${data.time}`,
    method: 'get'
  })
}
export function getAllUserOutList(data) {
  return request({
    url: `/getAllUserOut?pageSize=${data.pageSize}&currentPage=${data.currentPage}&userId=${data.userId}&role=${data.role}`,
    method: 'get'
  })
}
export function addTips(data) {
  return request({
    url: `/createTips`,
    method: 'post',
    data
  })
}
export function addUser(data) {
  return request({
    url: `/register`,
    method: 'post',
    data
  })
}
export function getTips() {
  return request({
    url: `/getTips`,
    method: 'get'
  })
}
export function computSign(time='2020-04') {
  return request({
    url: `/computSign?time=${time}`,
    method: 'get'
  })
}
