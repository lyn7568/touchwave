import request from '@/utils/request'

/*  停用用户 */
export function deleteUser(params) {
  return request({
    url: '/ajax/sys/ban',
    method: 'get',
    params
  })
}

/*  查询负责桥梁 */
export function queryResponsibleBridge(params) {
  return request({
    url: '/ajax/bridge/byUserId',
    method: 'get',
    params
  })
}

/*  分页查询用户 */
export function pageQueryUser(params) {
  return request({
    url: '/ajax/sys/pq',
    method: 'get',
    params
  })
}

/*  检查账号是否注册 */
export function checkRegister(params) {
  return request({
    url: '/ajax/sys/check',
    method: 'get',
    params
  })
}

/*  新增新用户 */
export function addRegister(params) {
  return request({
    url: '/ajax/sys/insert',
    method: 'post',
    data: params
  })
}

/*  更新新用户 */
export function updateRegister(params) {
  return request({
    url: '/ajax/sys/update',
    method: 'post',
    data: params
  })
}

/*  查找用户信息 */
export function queryRegister(params) {
  return request({
    url: '/ajax/sys/qo',
    method: 'get',
    params
  })
}

/*  传感器所属采集盒编号列表 */
export function DeviceOfservice(params) {
  return request({
    url: '/ajax/bridge/list',
    method: 'get',
    params
  })
}

/*  更新用户权限 */
export function updatePermission(params) {
  return request({
    url: '/ajax/sys/userBridge/refresh',
    method: 'post',
    data: params
  })
}
