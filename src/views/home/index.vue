<template>
 <div class="container">
   <!-- tab标签栏 -->
    <van-tabs v-model="activeIndex" swipeable>
      <van-tab :title="item.name" v-for="(item,index) in channels" :key="index">
      <!-- article组件 -->
       <article-list @showAction='openAction' :channel_id='item.id'></article-list>
      </van-tab>
    </van-tabs>
    <!-- 右边三道杠 -->
    <span class="bar_btn" @click="channelShow=true">
      <van-icon name="wap-nav" />
    </span>
    <!-- 报告组件 -->
    <van-popup :style="{width:'80%'}" v-model="isShow">
      <more-action @clickId="clickId" @reportConstant='repConstant'></more-action>
    </van-popup>
    <!-- 频道编辑组件 -->
    <van-action-sheet
    v-model="channelShow"
    :round="false"
     title="编辑频道">
      <channel-edit @addChannel='addChannel' @delChannel='delChannel' :activeIndex='activeIndex' :channels='channels' @selectChannel='selectChannel'></channel-edit>
    </van-action-sheet>
  </div>
</template>

<script>
import ArticleList from './components/article-list.vue' // 文章列表组件
import MoreAction from './components/more-action.vue' // 报告组件
import { getMyChannels, delChannel, addChannel } from '@/api/channels.js' //  频道
import { disLikeArticle, reportArticle } from '@/api/article.js'
import eventBus from '@/utils/eventBus.js'
import channelEdit from '@/views/home/components/channel-edit.vue'
export default {
  name: 'home', // devtools查看组件时 可以看到对应的name名称
  components: {
    ArticleList,
    MoreAction,
    channelEdit

  },
  data () {
    return {
      activeIndex: 2, // 默认标签栏 显示的栏数 索引是从0开始的
      channels: [], // 需要的频道数据
      isShow: false, // 弹层显示
      articleId: '', // 传进来的文章Id
      channelShow: false // 频道编辑面板控制按钮
    }
  },
  methods: {
    async getMyChannels () {
      let data = await getMyChannels()
      // debugger
      // console.log(data)
      this.channels = data.channels
    },
    // 点击叉号后，显示出举报弹出层
    openAction (artId) {
      this.isShow = true
      this.articleId = artId
      // console.log('弹出')
    },
    // 点击不感兴趣触发
    async clickId () {
      try {
        if (this.articleId) {
          await disLikeArticle({
            target: this.articleId
          })
          eventBus.$emit('delArticle', this.articleId, this.channels[this.activeIndex].id)
          this.$notify({ type: 'success', message: '删除成功' })
          this.isShow = false
        }
      } catch (error) {
        this.$notify({ type: 'warning', message: '删除失败' })
      }
    },
    // 举报更多内容
    async repConstant (value) {
      try {
        if (this.articleId) {
          // debugger
          await reportArticle({
            target: this.articleId,
            type: value
          })
          eventBus.$emit('delArticle', this.articleId, this.channels[this.activeIndex].id)
          this.$notify({ type: 'success', message: '删除成功' })
          this.isShow = false
        }
      } catch (error) {
        this.$notify({ type: 'warning', message: '删除失败' })
      }
    },
    selectChannel (channelId) {
      // debugger
      this.channelShow = false
      this.activeIndex = channelId
    },
    // 删除频道
    async delChannel (id) {
      console.log(123)
      // debugger
      try {
        // debugger
        await delChannel(id)
        // 删除成功
        // 这里要根据索引删除，因为选中的会有个特效
        // debugger
        let index = this.channels.findIndex(item => item.id === id)

        this.channels.splice(index, 1)
        this.$notify({ type: 'success', message: '删除成功' })
      } catch (error) {
        this.$notify({ type: 'danger', message: '删除失败' })
        console.log(error)
      }
    },
    // 添加频道
    async addChannel (item) {
      await addChannel(item)
      this.channels.push(item)
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
  .van-action-sheet {
  max-height: 100%;
  height: 100%;
  .van-action-sheet__header {
    background: #3296fa;
    color: #fff;
    .van-icon-close {
      color: #fff;
    }
  }
  }
</style>
