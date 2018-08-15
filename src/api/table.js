import request from '@/utils/request'

export function getBridgeList(params) {
  return request({
    url: '/ajax/bridge/byUser',
    method: 'get',
    params
  })
}

export function getBridgeInfo(params) {
  return request({
    url: '/ajax/bridge/qo',
    method: 'get',
    params
  })
}

export function getBridgeServers(params) {
  return request({
    url: '/ajax/server/byBridge',
    method: 'get',
    params
  })
}

export function getBridgeDevices(params) {
  return request({
    url: '/ajax/device/byServer',
    method: 'get',
    params
  })
}

export function getBridgeSensors(params) {
  return request({
    url: '/ajax/transducer/byDevice',
    method: 'get',
    params
  })
}
