import request from '@/utils/request'

export function getUserAllResource(params) { // 用户所有信息
  return request({
    url: '/ajax/all/byUser',
    method: 'get',
    params
  })
}

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

export function getServerInfo(params) { // 某个服务器
  return request({
    url: '/ajax/server/qo',
    method: 'get',
    params
  })
}

export function getDeviceInfo(params) { // 某个采集盒
  return request({
    url: '/ajax/device/qo',
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
export function getMonitorByDay(params) {
  return request({
    url: '/ajax/collect/wave/server/day',
    method: 'get',
    params
  })
}
export function getTimingMonitor(params) {
  return request({
    url: '/ajax/collect/wave/curr',
    method: 'get',
    params
  })
}
// 监测信息
