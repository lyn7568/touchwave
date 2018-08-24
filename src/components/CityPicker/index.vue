<template>
  <div class="linkage">
    <el-row :gutter="10">
      <el-col :span="8">
        <el-select
          v-model="sheng"
          @change="choseProvince"
          placeholder="省">
          <el-option
            v-for="item in province"
            :key="item.id"
            :label="item.value"
            :value="item.id">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="8">
        <el-select
          v-model="shi"
          @change="choseCity"
          placeholder="市">
          <el-option
            v-for="item in shi1"
            :key="item.id"
            :label="item.value"
            :value="item.id">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="8">
        <el-select
          v-model="qu"
          @change="choseBlock"
          placeholder="区(县)">
          <el-option
            v-for="item in qu1"
            :key="item.id"
            :label="item.value"
            :value="item.id">
          </el-option>
        </el-select>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import queryDict from '@/utils/queryDict'
export default {
  props: ['addrCode'],
  data() {
    return {
      firstFlag: false,
      province: [],
      sheng: '',
      shi: '',
      shi1: [],
      qu: '',
      qu1: [],
      city: '',
      block: ''
    }
  },
  watch: {
    addrCode: function() {
      this.initpsq()
    }
  },
  methods: {
    getCityData: function() {
      var that = this
      queryDict.applyDict('XZQH', function(dictData) {
        if (dictData) {
          var data = dictData.sort((obj1, obj2) => {
            return obj1.code - obj2.code
          })
          that.province = {}
          data.map(item => {
            if (item.code.match(/0000$/)) {
              that.province[item.code] = { id: item.code, value: item.caption, children: {}}
            } else if (item.code.match(/00$/)) {
              var p = that.province[item.code.slice(0, 2) + '0000']
              p.children[item.code] = { id: item.code, value: item.caption, children: {}}
              if (!p.defaultChild) {
                p.defaultChild = p.children[item.code]
              }
            } else {
              var pp = that.province[item.code.slice(0, 2) + '0000'].children[item.code.slice(0, 4) + '00']
              pp.children[item.code] = { id: item.code, value: item.caption }
              if (!pp.defaultChild) {
                pp.defaultChild = pp.children[item.code]
              }
            }
          })
        } else {
          console.log(dictData.status)
        }
      })
    },
    choseProvince: function(e) {
      var p = this.province[e]
      this.shi1 = p.children
      this.shi = p.defaultChild.value
      this.qu1 = p.defaultChild.children
      this.qu = p.defaultChild.defaultChild.value
      this.E = p.defaultChild.defaultChild.id
      this.sheng = p.value
      this.$emit('paren', this.E)
    },
    choseCity: function(e) {
      var p = this.province[e.slice(0, 2) + '0000'].children[e]
      this.shi = p.value
      this.qu1 = p.children
      this.qu = p.defaultChild.value
      this.E = p.defaultChild.id
      this.$emit('paren', this.E)
    },
    choseBlock: function(e) {
      this.qu = this.province[e.slice(0, 2) + '0000'].children[e.slice(0, 4) + '00'].children[e].value
      this.E = e
      this.$emit('paren', this.E)
    },
    initpsq: function() {
      if (!this.addrCode) {
        this.sheng = ''
        this.shi = ''
        this.qu = ''
        return
      }
      const s = this.addrCode.substring(0, 2) + '0000'
      const si = this.addrCode.substring(0, 4) + '00'
      const x = this.addrCode
      var p = this.province[s]
      this.sheng = p.value
      this.shi = p.children[si].value
      this.qu = p.children[si].children[x].value
    }
  },
  created: function() {
    this.getCityData()
  }
}
</script>
