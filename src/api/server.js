import request from '@/utils/request'

/*  添加服务器 */
export function addDevice(params) {
  return request({
    url: '/ajax/server',
    method: 'post',
    params
  })
}

/*  更新服务器信息 */
export function updateDevice(params) {
  return request({
    url: '/ajax/server/update',
    method: 'post',
    params
  })
}

/*  删除服务器信息 */
export function deleteDevice(params) {
  return request({
    url: '/ajax/server/delete',
    method: 'get',
    params
  })
}

/*  查询单个服务器 */
export function queryDevice(params) {
  return request({
    url: '/ajax/server/qo',
    method: 'get',
    params
  })
}

/*  分页查询服务器 */
export function pageQueryDevice(params) {
  return request({
    url: '/ajax/server/pq',
    method: 'get',
    params
  })
}

/*  服务器所属采桥梁列表 */
export function DeviceOfservice(params) {
  return request({
    url: '/ajax/bridge/list',
    method: 'get',
    params
  })
}

/*  校验服务器编号 */
export function checkDeviceCode(params) {
  return request({
    url: '/ajax/server/checkCode',
    method: 'get',
    params
  })
}

/*  校验服务器内部编号 */
export function checkDeviceInternalCode(params) {
  return request({
    url: '/ajax/server/checkSeq',
    method: 'get',
    params
  })
}

/*  查询服务器名字 */
export function queryServer(params) {
  return request({
    url: '/ajax/bridge/qo',
    method: 'get',
    params
  })
}
