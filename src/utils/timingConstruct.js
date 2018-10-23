/**
 * Created by luyanan on 18/9/4.
 * construct monitor
 */
/* eslint-disable one-var */
import { parseTime } from '@/utils/index'

var monitorModel = {
  construct: function(mCache, $data) {
    for (let i = 0; i < $data.length; ++i) {
      if ($data[i].ctime === $data[0].ctime) {
        mCache.push({
          cid: $data[i].seq,
          cd: {
            tit: $data[i].code,
            xData: [],
            seData: []
          }
        })
      }
    }
  },
  fixData: function(item, ftbegin, ftend, $daI) {
    if ($daI) {
      item.xData.push(parseTime(ftbegin, true, true))
      item.xData.push(parseTime(ftend, true, true))
      item.seData.push($daI.hvalue)
      item.seData.push($daI.lvalue)
    } else {
      item.xData.push(parseTime(ftbegin, true, true))
      item.xData.push(parseTime(ftend, true, true))
      item.seData.push(0)
      item.seData.push(0)
    }
  },
  shiftData: function(item) {
    item.xData.shift()
    item.xData.shift()
    item.seData.shift()
    item.seData.shift()
  },
  setData: function(mCache, $data, ftbegin, ftend, maxNum) {
    if ($data.length) {
      for (let n = 0; n < mCache.length; ++n) {
        let found_c = false
        for (let m = 0; m < $data.length; ++m) {
          var tj = ($data[m].cid === mCache[n].cid && (ftbegin === $data[m].ctime))
          if (maxNum) {
            tj = ($data[m].cid === mCache[n].cid)
          }
          if (tj) {
            found_c = true
            this.fixData(mCache[n].cd, ftbegin, ftend, $data[m])
            break
          }
        }
        if (!found_c) {
          this.fixData(mCache[n].cd, ftbegin, ftend)
        }

        if (maxNum && mCache[n].cd.xData.length > maxNum) {
          this.shiftData(mCache[n].cd)
        }
      }
    } else {
      for (let k = 0; k < mCache.length; ++k) {
        this.fixData(mCache[k].cd, ftbegin, ftend)

        if (maxNum && mCache[k].cd.xData.length > maxNum) {
          this.shiftData(mCache[k].cd)
        }
      }
    }
  }
}

export default monitorModel
