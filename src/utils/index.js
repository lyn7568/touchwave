/**
 * Created by luyanan on 18/8/13.
 */
export const comUrl = 'http://localhost:90'

/**
 * 解析url参数
 * @example ?id=12345&a=b
 * @return Object {id:12345,a:b}
 */
export function urlParse(name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || ['', ''])[1].replace(/\+/g, '%20')) || null
}

export function parseTime(startTime, flag, fa) {
  if (flag) {
    if (!fa) {
      return startTime.substring(0, 4) + '年' + startTime.substring(4, 6) + '月' + startTime.substring(6, 8) + '日 ' + startTime.substring(8, 10) + ':' + startTime.substring(10, 12)
    } else {
      return startTime.substring(0, 4) + '/' + startTime.substring(4, 6) + '/' + startTime.substring(6, 8) + ' ' + startTime.substring(8, 10) + ':' + startTime.substring(10, 12) + ':' + startTime.substring(12, 14)
    }
  } else {
    return startTime.substring(0, 4) + '/' + startTime.substring(4, 6) + '/' + startTime.substring(6, 8)
  }
}

export function turnTime(time, hasT, hasF) { // hasT='date/time'是否有时分秒，hasF是否需要显示格式
  if (hasT === 'time') {
    if (hasF) {
      return [time.getFullYear(), time.getMonth() + 1, time.getDate()].join('/') + ' ' + [time.getHours(), time.getMinutes(), time.getSeconds()].join(':')
    } else {
      return time.getFullYear() + (time.getMonth() + 1) + time.getDate() + time.getHours() + time.getMinutes() + time.getSeconds()
    }
  } else if (hasT === 'date') {
    if (hasF) {
      return [time.getFullYear(), time.getMonth() + 1, time.getDate()].join('/')
    } else {
      return time.getFullYear() + (time.getMonth() + 1) + time.getDate()
    }
  }
}

export function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse('{"' + decodeURIComponent(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}')
}
export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result

  const later = function() {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔last小于设定时间间隔wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function(...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}
