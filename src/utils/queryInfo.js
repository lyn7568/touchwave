/**
 * Created by luyanan on 18/8/23.
 * All information about bridges
 */
/* eslint-disable one-var */
import request from '@/utils/request'
import store from '@/store'

var bridgeObj = {},
  serverList = [],
  deviceList = [],
  transducerList = [],
  listOk = false,
  cbArr = [],
  qaiCb = function(func) {
    if (listOk) {
      func()
    } else {
      cbArr.push(func)
    }
  },
  sortByCode = function(a, b) {
    var s = a.code.toLowerCase()
    var t = b.code.toLowerCase()
    if (s > t) {
      return 1
    } else {
      return -1
    }
  },
  queryAllInfo = function() {
    // setTimeout(function() {
    if (!bridgeObj.server && store.getters.roles.indexOf('1') === -1) {
      request({
        url: '/ajax/all/byUser',
        method: 'get',
        params: {
          active: 1
        }
      }).then(res => {
        if (res.success) {
          bridgeObj = res.data
          serverList = res.data.server
          deviceList = res.data.device
          transducerList = res.data.transducer
          listOk = true
          cbArr.forEach(function(item) {
            item()
          })
        }
      })
    }
    // }, 1)
  },
  queryServers = function(bid, flag) {
    const obj = serverList
    var servers = [], serverSeqArr = []
    for (let i = 0; i < obj.length; ++i) {
      if (bid === obj[i].bridgeId) {
        servers.push(obj[i])
        serverSeqArr.push(obj[i].seq)
      }
    }
    servers.sort(sortByCode)
    return flag ? serverSeqArr : servers
  },
  queryDevices = function(bid) {
    var devices = []
    for (let i = 0; i < serverList.length; ++i) {
      if (bid === serverList[i].bridgeId) {
        for (let j = 0; j < deviceList.length; ++j) {
          if (serverList[i].id === deviceList[j].serverId) {
            deviceList[j].serverCode = serverList[i].code
            devices.push(deviceList[j])
          }
        }
      }
    }
    devices.sort(sortByCode)
    return devices
  },
  queryTrans = function(bid) {
    var trans = []
    for (let i = 0; i < serverList.length; ++i) {
      if (bid === serverList[i].bridgeId) {
        for (let j = 0; j < deviceList.length; ++j) {
          if (serverList[i].id === deviceList[j].serverId) {
            for (let m = 0; m < transducerList.length; ++m) {
              if (deviceList[j].id === transducerList[m].deviceId) {
                transducerList[m].deviceCode = deviceList[j].code
                trans.push(transducerList[m])
              }
            }
          }
        }
      }
    }
    trans.sort(sortByCode)
    return trans
  },
  ret = {
    queryAllInfo: queryAllInfo,
    queryServers: queryServers,
    queryDevices: queryDevices,
    queryTrans: queryTrans,
    qaiCb: qaiCb
  }

export default ret
