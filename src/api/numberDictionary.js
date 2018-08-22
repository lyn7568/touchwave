import request from '@/utils/request'

/*  主缆 */
export function mainCable() {
  return request({
    url: '/ajax/dict/items',
    method: 'get',
    params: {
    	dict: 'ZLLX'
    }
  })
}

/*  位置 */
export function location() {
  return request({
    url: '/ajax/dict/items',
    method: 'get',
    params: {
    	dict: 'ZLWZ'
    }
  })
}

/*  省市区 */
export function provinceCityDistrict() {
  return request({
    url: '/ajax/dict/items',
    method: 'get',
    params: {
    	dict: 'XZQH'
    }
  })
}