/**
 * Created by luyanan on 18/8/27.
 * bridge、server、device
 */
/* eslint-disable one-var */
import request from '@/utils/request'
var $req = {
  get: function(url, data, sh, eh) {
    request({
      method: 'get',
      url: url,
      params: data
    }).then(res => {
      sh(res)
    }).catch(err => {
      console.log(err)
      eh(err)
    })
  }
}
var objCache = {
  bridge: {},
  server: {},
  device: {}
}
var objHcache = {
  bridge: {},
  server: {},
  device: {}
}
var objCacheHandler = {
  bridge: function(id) {
    var hc = objHcache.bridge[id]
    $req.get('/ajax/bridge/qo?id=' + id, null, function(data) {
      delete objHcache.bridge[id]
      if (data.success) {
        objCache.bridge[id] = data.data
        for (let i = 0; i < hc.length; ++i) {
          hc[i](true, data.data)
        }
      } else {
        for (let i = 0; i < hc.length; ++i) {
          hc[i](false)
        }
      }
    }, function() {
      for (let i = 0; i < hc.length; ++i) {
        hc[i](false)
      }
    })
  },
  server: function(id) {
    var hc = objHcache.server[id]
    $req.get('/ajax/server/qo?id=' + id, null, function(data) {
      delete objHcache.server[id]
      if (data.success) {
        objCache.server[id] = data.data
        for (let i = 0; i < hc.length; ++i) {
          hc[i](true, data.data)
        }
      } else {
        for (let i = 0; i < hc.length; ++i) {
          hc[i](false)
        }
      }
    }, function() {
      for (let i = 0; i < hc.length; ++i) {
        hc[i](false)
      }
    })
  },
  device: function(id) {
    var hc = objHcache.device[id]
    $req.get('/ajax/device/qo?id=' + id, null, function(data) {
      delete objHcache.device[id]
      if (data.success) {
        objCache.device[id] = data.data
        for (let i = 0; i < hc.length; ++i) {
          hc[i](true, data.data)
        }
      } else {
        for (let i = 0; i < hc.length; ++i) {
          hc[i](false)
        }
      }
    }, function() {
      for (let i = 0; i < hc.length; ++i) {
        hc[i](false)
      }
    })
  }
}
var cacheModel = {
  getBridge: function(id, handler) {
    var data = objCache.bridge[id]
    if (data) {
      handler(true, data)
    } else {
      if (objHcache.bridge[id]) {
        objHcache.bridge[id].push(handler)
      } else {
        objHcache.bridge[id] = []
        objHcache.bridge[id].push(handler)
        objCacheHandler.bridge(id)
      }
    }
  },
  getServer: function(id, handler) {
    var data = objCache.server[id]
    if (data) {
      handler(true, data)
    } else {
      if (objHcache.server[id]) {
        objHcache.server[id].push(handler)
      } else {
        objHcache.server[id] = []
        objHcache.server[id].push(handler)
        objCacheHandler.server(id)
      }
    }
  },
  getDevice: function(id, handler) {
    var data = objCache.device[id]
    if (data) {
      handler(true, data)
    } else {
      if (objHcache.device[id]) {
        objHcache.device[id].push(handler)
      } else {
        objHcache.device[id] = []
        objHcache.device[id].push(handler)
        objCacheHandler.device(id)
      }
    }
  }
}

export default cacheModel
