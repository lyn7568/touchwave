import request from '@/utils/request'

/*eslint one-var: ["error", { "initialized": "always", "uninitialized": "never" }]*/
var serverList = [],
  deviceList = [],
  transducerList = [],
  queryAllInfo = function() {
    request({
      url: '/ajax/all/byUser',
      method: 'get',
      params: {
        active: 1
      }
    }).then(res => {
      if (res.success) {
        serverList = res.data.server
        deviceList = res.data.device
        transducerList = res.data.transducer
      }
    })
  },
  queryServers = function(bid, flag) {
    const obj = serverList
    /*eslint one-var: ["error", { "initialized": "always", "uninitialized": "never" }]*/
    var servers = [], serverSeqArr = []
    for (let i = 0; i < obj.length; ++i) {
      if (bid === obj[i].bridgeId) {
        servers.push(obj[i])
        serverSeqArr.push(obj[i].seq)
      }
    }
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
    return devices
  },
  queryTrans = function(bid) {
    var trans = []
    for (let i = 0; i < serverList.length; ++i) {
      if (bid === serverList[i].bridgeId) {
        for (let j = 0; j < deviceList.length; ++j) {
          for (let m = 0; m < transducerList.length; ++m) {
            if (serverList[i].id === transducerList[m].serverId) {
              transducerList[m].deviceCode = deviceList[j].code
              trans.push(transducerList[m])
            }
          }
        }
      }
    }
    return trans
  },
  ret = {
    queryAllInfo: queryAllInfo,
    queryServers: queryServers,
    queryDevices: queryDevices,
    queryTrans: queryTrans
  }

export default ret
