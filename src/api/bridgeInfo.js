import request from '@/utils/request'

export function getBridgeList(params) { // 用户所有桥梁
  return request({
    url: '/ajax/bridge/byUser',
    method: 'get',
    params
  })
}

export function getBridgeInfo(params) { // 桥梁信息
  return request({
    url: '/ajax/bridge/qo',
    method: 'get',
    params
  })
}

export function getBridgeServers(params) { // 桥梁服务器
  return request({
    url: '/ajax/server/byBridge',
    method: 'get',
    params
  })
}

// 报警信息
export function getDangerList(params) {
  return request({
    url: '/ajax/alarm/msg',
    method: 'get',
    params
  })
}
export function getDangerDetail(params) {
  return request({
    url: '/ajax/alarm/detail',
    method: 'get',
    params
  })
}
// 报警信息

// 未读报警
export function getBridgeUnread(params) {
  return request({
    url: '/ajax/alarm/msg/unread',
    method: 'get',
    params
  })
}
export function setUnreadToRead(params) {
  return request({
    url: '/ajax/alarm/msg/read',
    method: 'post',
    data: params
  })
}
// 未读报警

// 监测信息
export function getMonitorByDay(params, flag) {
  return request({
    url: flag ? '/ajax/collect/wave/server/time' : '/ajax/collect/wave/server/dayTime',
    method: 'get',
    params
  })
}
export function getMonitorByTime(params) {
  return request({
    url: '/ajax/collect/wave/server/time',
    method: 'get',
    params
  })
}
export function getSysTime(params) {
  return request({
    url: '/ajax/collect/wave/curr',
    method: 'get',
    params
  })
}
// 监测信息
