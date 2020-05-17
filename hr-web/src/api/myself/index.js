import requestList from '@/utils/request'

const request = requestList[0]

export function setBegin(data) {
  return request({
    url: `/setBegin?userId=${data.userId}&time=${data.time}&status=${data.status}&today=${data.today}`,
    method: 'get'
  })
}
export function setFinish(data) {
  return request({
    url: `/setFinish?userId=${data.userId}&time=${data.time}&status=${data.status}&today=${data.today}`,
    method: 'get'
  })
}
export function askforleave(data) {
  return request({
    url: `/askforleave?userId=${data.userId}`,
    method: 'post',
    data: data.timeList
  })
}
export function outWork(data) {
  return request({
    url: `/outWork?userId=${data.userId}`,
    method: 'get'
  })
}
export function setAll(data) {
  return request({
    url: `/setAll`,
    method: 'get'
  })
}

export function myLeave(data) {
  return request({
    url: `/getAllUserLeave?pageSize=${data.pageSize}&currentPage=${data.currentPage}&userId=${data.userId}`,
    method: 'get'
  })
}
export function getMyToday(data) {
  return request({
    url: `/getMyToday?userId=${data.userId}&today=${data.today}`,
    method: 'get'
  })
}

export function mySign(data) {
  return request({
    url: `/getAllUserSign?pageSize=${data.pageSize}&currentPage=${data.currentPage}&userId=${data.userId}`,
    method: 'get'
  })
}
export function askOutJob(data) {
  return request({
    url: `/askOutJob?userId=${data.userId}&time=${data.time}&reason=${data.reason}`,
    method: 'get'
  })
}
export function mySalary(data) {
  return request({
    url: `/selectSalary?pageSize=${data.pageSize}&currentPage=${data.currentPage}&userId=${data.userId}`,
    method: 'get'
  })
}

export function getSalary(data) {
  return request({
    url: `/getSalary?salaryId=${data.salaryId}&status=${data.status}`,
    method: 'get'
  })
}
export function updateUser(data) {
  return request({
    url: `/updateUser`,
    method: 'post',
    data
  })
}
