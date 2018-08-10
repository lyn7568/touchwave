import request from '@/utils/request'

export function login(account, pw, vc) {
  return request({
    url: '/ajax/sys/login',
    method: 'post',
    data: {
      account,
      pw,
      vc
    }
  })
}

export function getInfo(params) {
  return request({
    url: '/ajax/sys/user',
    method: 'get',
    params
  })
}

export function logout() {
  // return request({
  //   url: '/user/logout',
  //   method: 'post'
  // })
}

export function isReg(params) {
  return request({
    url: '/ajax/sys/check',
    method: 'get',
    params
  })
}

export function getMsgPhone(params) {
  return request({
    url: '/ajax/sys/resetPwMobile',
    method: 'get',
    params
  })
}
