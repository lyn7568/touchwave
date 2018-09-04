import request from '@/utils/request'

/*  添加采集盒 */
export function addDevice(params) {
  return request({
    url: '/ajax/device',
    method: 'post',
    data: params
  })
}

/*  更新采集盒信息 */
export function updateDevice(params) {
  return request({
    url: '/ajax/device/update',
    method: 'post',
    data: params
  })
}

/*  删除采集盒信息 */
export function deleteDevice(params) {
  return request({
    url: '/ajax/device/delete',
    method: 'get',
    params
  })
}

/*  查询单个采集盒 */
export function queryDevice(params) {
  return request({
    url: '/ajax/device/qo',
    method: 'get',
    params
  })
}

/*  分页查询采集盒 */
export function pageQueryDevice(params) {
  return request({
    url: '/ajax/device/pq',
    method: 'get',
    params
  })
}

/*  采集盒所属服务器编号列表 */
export function DeviceOfservice(params) {
  return request({
    url: '/ajax/server/listByCode',
    method: 'get',
    params
  })
}

/*  校验采集盒编号 */
export function checkDeviceCode(params) {
  return request({
    url: '/ajax/device/checkCode',
    method: 'get',
    params
  })
}

/*  校验采集盒内部编号 */
export function checkDeviceInternalCode(params) {
  return request({
    url: '/ajax/device/checkSeq',
    method: 'get',
    params
  })
}
