<template>
  <div class="linkage">
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
  </div>
</template>
<script>
import axios from 'axios'
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
      axios.get('/ajax/dict/items?dict=XZQH').then(function(response) {
        if (response.status === 200) {
          var data = response.data.data.sort((obj1, obj2) => {
            return obj1.code - obj2.code
          })
          that.province = []
          that.city = []
          that.block = []
          data.map(item => {
            if (item.code.match(/0000$/)) {
              that.province.push({ id: item.code, value: item.caption, children: [] })
            } else if (item.code.match(/00$/)) {
              that.city.push({ id: item.code, value: item.caption, children: [] })
            } else {
              that.block.push({ id: item.code, value: item.caption })
            }
          })
          for (var index in that.province) {
            for (var index1 in that.city) {
              if (that.province[index].id.slice(0, 2) === that.city[index1].id.slice(0, 2)) {
                that.province[index].children.push(that.city[index1])
              }
            }
          }
          for (var item1 in that.city) {
            for (var item2 in that.block) {
              if (that.block[item2].id.slice(0, 4) === that.city[item1].id.slice(0, 4)) {
                that.city[item1].children.push(that.block[item2])
              }
            }
          }
          if (!that.firstFlag) {
            that.initpsq()
          }
        } else {
          console.log(response.status)
        }
      })
    },
    choseProvince: function(e) {
      for (var index2 in this.province) {
        if (e === this.province[index2].id) {
          this.shi1 = this.province[index2].children
          this.shi = this.province[index2].children[0].value
          this.qu1 = this.province[index2].children[0].children
          this.qu = this.province[index2].children[0].children[0].value
          this.E = this.qu1[0].id
          this.sheng = this.province[index2].value
        }
      }
      this.$emit('paren', this.E)
    },
    choseCity: function(e) {
      for (var index3 in this.city) {
        if (e === this.city[index3].id) {
          this.qu1 = this.city[index3].children
          this.qu = this.city[index3].children[0].value
          this.E = this.qu1[0].id
          this.shi = this.city[index3].value
        }
      }
      this.$emit('paren', this.E)
    },
    choseBlock: function(e) {
      for (var index3 in this.qu1) {
        if (e === this.qu1[index3].id) {
          this.qu = this.qu1[index3].value
        }
      }
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
      this.province.map(item => {
        if (item.id === s) {
          this.sheng = item.value
          item.children.map(item => {
            if (item.id === si) {
              this.shi = item.value
              item.children.map(item => {
                if (x === item.id) {
                  this.qu = item.value
                }
              })
            }
          })
        }
      })
    }
  },
  created: function() {
    this.getCityData()
  }
}
</script>
