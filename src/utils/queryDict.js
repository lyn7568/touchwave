/**
 * Created by luyanan on 18/8/23.
 * 'ZLLX'----'传感器主缆'
 * 'ZLWZ'----'传感器位置'
 * 'XZQH'----'城市级联'
 */
/* eslint-disable one-var */
import request from '@/utils/request'

var cacheDict = {
    bool: [
      { code: '0', caption: '否', enabled: true },
      { code: '1', caption: '是', enabled: true }
    ]
  },
  handCache = {},
  uri = '/ajax/dict/items',
  setDict = function(code, items) {
    cacheDict[code] = items
    var hs = handCache[code]
    if (hs && hs.length) {
      hs.forEach(h => h(items))
      delete handCache[code]
    }
  },
  loadDict = function(code) {
    request({
      url: uri,
      method: 'get',
      params: {
        dict: code
      }
    }).then(res => {
      setDict(code, res.data)
    })
  },
  applyDict = function(code, hander) {
    var dict = cacheDict[code]
    if (!dict) {
      var hs = handCache[code]
      if (!hs) {
        handCache[code] = hs = []
        loadDict(code)
      }
      hs.push(hander)
    } else {
      hander(dict)
    }
  },
  ret = {
    applyDict: applyDict
  }

export default ret
