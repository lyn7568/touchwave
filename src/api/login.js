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

export function getInfo() {
  return request({
    url: '/ajax/sys/user',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/ajax/sys/logout',
    method: 'get'
  })
}

export function isReg(params) {
  return request({
    url: '/ajax/sys/check',
    method: 'get',
    params
  })
}

// 找回密码
export function getResetMsgPhone(params) {
  return request({
    url: '/ajax/sys/resetPwMobile',
    method: 'get',
    params
  })
}

export function resetPwdByTel(pw, vc) {
  return request({
    url: '/ajax/sys/resetPasswordWithMobilePhone',
    method: 'post',
    data: {
      pw,
      vc
    }
  })
}

// 修改密码
export function changePw(id, oldPw, newPw) {
  return request({
    url: '/ajax/sys/changePw',
    method: 'post',
    data: {
      id,
      oldPw,
      newPw
    }
  })
}
