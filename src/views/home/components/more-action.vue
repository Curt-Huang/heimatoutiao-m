<template>
  <div class="moreAction">
      <van-cell-group v-if='!isReport'>
          <van-cell @click="$emit('clickId')" >不感兴趣</van-cell>
          <van-cell is-link @click="isReport=true">反馈垃圾内容</van-cell>
          <van-cell >拉黑作者</van-cell>
      </van-cell-group>
      <van-cell-group v-else >
          <van-cell @click='isReport=false'>返回</van-cell>
          <van-cell @click="$emit('reportConstant',item.value)" v-for="item in constant" :key="item.value">{{item.label}}</van-cell>
      </van-cell-group>
  </div>
</template>

<script>
import eventBus from '@/utils/eventBus'
import { constant } from '@/api/constant.js'
export default {
  data () {
    return {
      isReport: false,
      constant // 传递进来的举报常量
    }
  },
  created () {
    eventBus.$on('delArticle', () => { this.isReport = false })
  }
}
</script>

<style lang="less" scoped>
.moreAction{
  border-radius: 4px;
}
</style>
