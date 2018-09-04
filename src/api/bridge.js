import request from '@/utils/request'

/*  添加桥梁 */
export function addDevice(params) {
  return request({
    url: '/ajax/bridge',
    method: 'post',
    data: params
  })
}

/*  更新桥梁信息 */
export function updateDevice(params) {
  return request({
    url: '/ajax/bridge/update',
    method: 'post',
    data: params
  })
}

/*  删除桥梁信息 */
export function deleteDevice(params) {
  return request({
    url: '/ajax/bridge/delete',
    method: 'get',
    params
  })
}

/*  查询单个桥梁 */
export function queryDevice(params) {
  return request({
    url: '/ajax/bridge/qo',
    method: 'get',
    params
  })
}

/*  分页查询桥梁 */
export function pageQueryDevice(params) {
  return request({
    url: '/ajax/bridge/pq',
    method: 'get',
    params
  })
}

/*  校验桥梁编号 */
export function checkDeviceCode(params) {
  return request({
    url: '/ajax/bridge/checkCode',
    method: 'get',
    params
  })
}

/*  校验桥梁简称 */
export function checkBridgeShortName(params) {
  return request({
    url: '/ajax/bridge/checkShortName',
    method: 'get',
    params
  })
}

/*  校验桥梁全称 */
export function checkBridgeName(params) {
  return request({
    url: '/ajax/bridge/checkName',
    method: 'get',
    params
  })
}

/*  上传图片 */
export function uploadBridgeImg() {
  return request({
    url: '/ajax/bridge/upload',
    method: 'post'
  })
}
