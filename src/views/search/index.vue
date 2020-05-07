<template>
  <div class="container">
    <!-- 搜索组件一级路由   返回上一个页面-->
    <van-nav-bar left-arrow title="搜索中心" @click-left="$router.back()"></van-nav-bar>
    <!-- 导航 -->
    <van-search v-model.trim="k" @search='onSearch' placeholder="请输入搜索关键词" shape="round" />
    <van-cell-group  class="suggest-box" v-if='k' >
      <!-- 联想搜索icon -->
      <van-cell icon="search" v-for="item in suggestionList" :key='item' @click='onSearchResult(item)'>
        {{item}}
      </van-cell>
    </van-cell-group>
    <div class="history-box" v-else-if="historyList.length">
      <div class="head">
        <span>历史记录</span>
        <!-- 历史记录全部删除icon -->
        <van-icon name="delete" @click="clear"></van-icon>
      </div>
      <van-cell-group>
        <van-cell @click='toResult(item)' v-for="(item,index) in historyList" :key="index">
          <a class="word_btn">{{item}}</a>
          <!-- 单个历史记录删除 -->
          <van-icon @click.stop="delHistory(index)" class="close_btn" slot="right-icon" name="cross" />
        </van-cell>
      </van-cell-group>
    </div>
  </div>
</template>

<script>
import JSON from 'json-bigint'
import { suggestion } from '@/api/article'
const key = 'hm-91-toutiao-history'
export default {
  name: 'search',
  data () {
    return {
      k: '', // 关键词
      historyList: [1, 2, 3], // 历史记录列表
      suggestionList: [] // 搜索建议列表
    }
  },
  watch: {
    // 函数防抖
    // k () {
    //   clearTimeout(this.timer)
    //   // console.log(this)
    //   this.timer = setTimeout(async () => {
    //     if (!this.k) {
    //       this.suggestionList = []
    //       return false
    //     }
    //     let data = await suggestion({ q: this.k })
    //     this.suggestionList = data.options
    //   }, 1000)
    // }
    // 函数节流
    k () {
      if (!this.timer) {
        this.timer = setTimeout(async () => {
          // 将定时器的标记清为空
          this.timer = null
          if (!this.k) {
            this.suggestionList = []
            return false
          }
          let data = await suggestion({ q: this.k })
          this.suggestionList = data.options
        }, 1000)
      }
    }
  },
  methods: {
    // 删除历史记录
    delHistory (index) {
      this.historyList.splice(index, 1)
      localStorage.setItem(key, JSON.stringify(this.historyList))
    },
    // return键或回车键直接跳转时，跳转之前，把关键字存储起来
    onSearch () {
      if (!this.k) return false
      let data = new Set(this.historyList) // 将数组转化成类似于数组的形式，中括号换成大括号
      data.add(this.k) // 将本次的搜索关键字存储到深拷贝的data里面
      let arr = Array.from(data) // 将类似于数组的数据，通过from转换成数组
      localStorage.setItem(key, JSON.stringify(arr)) // 将数据重新存储到本地
      this.$router.push({ path: '/search/result', query: { q: this.key } })
    },
    // 点击搜索建议的时候，跳转到搜索结果界面
    onSearchResult (text) {
      let data = new Set(this.historyList) // 将数组转化成类似于数组的形式，中括号换成大括号
      data.add(text) // 将本次的搜索关键字存储到深拷贝的data里面
      let arr = Array.from(data) // 将类似于数组的数据，通过from转换成数组
      localStorage.setItem(key, JSON.stringify(arr)) // 将数据重新存储到本地
      this.$router.push({ path: '/search/result', query: { q: text } })
    },
    // 删除全部历史记录
    clear () {
      this.historyList = []
      localStorage.setItem(key, '[]')
    },
    // 点击历史，跳转到对应界面
    toResult (item) {
      // debugger
      this.$router.push({ path: 'search/result', query: { q: item } })
    }
  },
  created () {
    this.historyList = JSON.parse(localStorage.getItem(key) || '[]')
  }

}
</script>

<style lang='less' scoped>
.history-box {
  padding: 0 20px;
  .head{
    line-height: 36px;
    color: #999;
    .van-icon{
      font-size: 16px;
      float: right;
      margin-top: 10px;;
    }
  }
  .van-cell{
    padding: 10px 0;
  }
  .word_btn{
    color:#3296fa;
  }
  .close_btn{
    margin-top:5px;
    color: #999;
  }
}
.suggest-box{
  /deep/ .van-cell{
    padding: 10px 20px;
    color: #999;
    p{
      span{
        color: red;
      }
    }
  }
}
</style>
