import request from '@/utils/request'

/*  添加传感器 */
export function addDevice(params) {
  return request({
    url: '/ajax/transducer',
    method: 'post',
    params
  })
}

/*  更新传感器信息 */
export function updateDevice(params) {
  return request({
    url: '/ajax/transducer/update',
    method: 'post',
    params
  })
}

/*  删除传感器信息 */
export function deleteDevice(params) {
  return request({
    url: '/ajax/transducer/delete',
    method: 'get',
    params
  })
}

/*  查询单个传感器 */
export function queryDevice(params) {
  return request({
    url: '/ajax/transducer/qo',
    method: 'get',
    params
  })
}

/*  分页查询传感器 */
export function pageQueryDevice(params) {
  return request({
    url: '/ajax/transducer/pq',
    method: 'get',
    params
  })
}

/*  传感器所属采集盒编号列表 */
export function DeviceOfservice(params) {
  return request({
    url: '/ajax/device/listByCode',
    method: 'get',
    params
  })
}

/*  校验传感器编号 */
export function checkDeviceCode(params) {
  return request({
    url: '/ajax/transducer/checkCode',
    method: 'get',
    params
  })
}

/*  校验传感器内部编号 */
export function checkDeviceInternalCode(params) {
  return request({
    url: '/ajax/transducer/checkSeq',
    method: 'get',
    params
  })
}

/*  查询采集盒名字 */
export function queryServer(params) {
  return request({
    url: '/ajax/device/qo',
    method: 'get',
    params
  })
}
