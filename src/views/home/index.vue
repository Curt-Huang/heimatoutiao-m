<template>
 <div class="container">
   <!-- tab标签栏 -->
    <van-tabs v-model="activeIndex" swipeable>
      <van-tab :title="item.name" v-for="item in channels" :key="item.id">
      <!-- article组件 -->
       <article-list :channel_id='item.id'></article-list>
      </van-tab>
    </van-tabs>
    <!-- 右边三道杠 -->
    <span class="bar_btn">
      <van-icon name="wap-nav" />
    </span>
  </div>
</template>

<script>
import ArticleList from '@/components/article-list.vue'
import { getMyChannels } from '@/api/channels'
export default {
  name: 'home', // devtools查看组件时 可以看到对应的name名称
  components: {
    ArticleList
  },
  data () {
    return {
      activeIndex: 2, // 默认标签栏 显示的栏数 索引是从0开始的
      channels: [], // 需要的频道数据
      timestamp: null // 当前时间戳
    }
  },
  methods: {
    async getMyChannels () {
      let data = await getMyChannels()
      // console.log(b)
      this.channels = data.channels
    }
  },
  created () {
    // 组件创建阶段就需要引入
    this.getMyChannels()
  }
}
</script>

<style lang="less" scoped>
.van-tabs {
  height: 100%;
  display: flex;
  flex-direction: column;
  /deep/ .van-tabs__wrap {
    height: 36px;
    padding-right: 36px;
    .van-tab {
      line-height: 36px;
    }
    .van-tabs__line {
      background-color: #3296fa;
      height: 2px;
    }
  }
  /deep/ .van-tabs__content{
    flex: 1;
    overflow: hidden;
  }
  /deep/ .van-tab__pane{
    height: 100%;
    .scroll-wrapper{
      height: 100%;
      overflow-y: auto;
    }
  }
}
.bar_btn {
  width: 36px;
  height: 35px;
  position: absolute;
  top: 0;
  right: 0;
  &::before {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 999;
    box-shadow: 0 0 10px #999;
    transform: scale(1, 0.6);
  }
  .van-icon-wap-nav {
    width: 100%;
    height: 100%;
    background: #fff;
    text-align: center;
    line-height: 35px;
    position: relative;
    z-index: 1000;
    &::before {
      font-size: 20px;
    }
  }
}
</style>
