<template>
  <div class="scroll-wrapper">
    <van-pull-refresh v-model="downLoading" @refresh="onRefresh" :success-text="refreshSuccessText">
      <van-list v-model="upLoading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <!-- load是当滚动条与底部的距离小于offset时触发 默认是300px -->
        <!-- 这里注意 这个div设置了滚动条 目的是 给后面做 阅读记忆 留下伏笔 -->
        <!-- 阅读记忆 => 看文章看到一半 滑到中部 去了别的页面 当你回来时 文章还在你看的位置 -->
        <van-cell v-for="article in articles" :key="article.art_id.toString()" >
          <div class="article_item">
            <h3 class="van-ellipsis">{{article.title}}</h3>
            <div class="img_box" v-if="article.cover.type===3">
              <van-image lazy-load class="w33" fit="cover" :src="article.cover.images[0]" />
              <van-image lazy-load class="w33" fit="cover" :src="article.cover.images[1]" />
              <van-image lazy-load class="w33" fit="cover" :src="article.cover.images[2]" />
            </div>
            <div class="img_box" v-if="article.cover.type===1" >
              <van-image lazy-load class="w100" fit="cover" :src="article.cover.images[0]" />
            </div>
            <div class="info_box">
              <span>{{article.aut_name}}</span>
              <span>{{article.comm_count}}评论</span>
              <span>{{article.pubdate | relTime}}</span>
              <span class="close" v-if="user.token" @click="$emit('showAction',article.art_id.toString())">
                <van-icon name="cross"></van-icon>
              </span>
            </div>
          </div>
        </van-cell>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticles } from '@/api/article.js'
import { mapState } from 'vuex'
import eventBus from '@/utils/eventBus.js'
export default {
  name: 'article-list',
  data () {
    return {
      downLoading: false, // 是否开启下拉刷新
      upLoading: false, // 是否开启上拉加载
      finished: false, // 是否已经完成全部的数据加载
      refreshSuccessText: '', // 下拉加载成功提示
      articles: [], // 定义一个数据，用来接收上拉加载的数据
      timestamp: null // 当前时间戳
    }
  },
  props: {
    channel_id: {
      type: Number,
      default: null,
      required: true
    }
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    //   上拉加载
    async onLoad () {
      //   console.log('开始刷新')
      // setTimeout(() => {
      //   if (this.articles.length < 50) {
      //     const arr = Array.from(Array(10), (value, index) => {
      //       return this.articles.length + index + 1 // 返回数组1~10  在添加之后原有的数字基础上 继续添加
      //     })
      //     // console.log(this)
      //     this.articles.push(...arr)
      //     this.upLoading = false // 加载完毕之后 关闭加载状态
      //   } else {
      //     this.finished = true // 当一共加载五十个后 显示所有数据加载完毕
      //   }
      // }, 1000)
      // 导入getArticle请求函数 其中后面的||是或的意思 首先查看timestamp里面有值没，如果没有的话，就取后面当前的时间戳
      this.$sleep(500)// 先通过prototype继承给Vue 然后再全局注册
      let data = await getArticles({ channel_id: this.channel_id, timestamp: this.timestamp || Date.now() })
      this.articles.push(...data.results) // 将数据添加到队列末尾 返回的results是数组的数据，用es6语法将其展开
      this.upLoading = false
      if (data.pre_timestamp) {
        this.timestamp = data.pre_timestamp// 判断历史时间戳是否存在,存在的话，就将它储存起来，作为下次请求，返回给后台的历史时间戳
      } else {
        this.finished = true // 告诉组件 没有数据可以加载了
      }
    },

    // 下拉刷新
    async onRefresh () {
      // setTimeout(() => {
      //   const arr = Array.from(Array(10), (value, index) => {
      //     return '刷新' + (index + 1) // 返回数组1~10  在添加之后原有的数字基础上 继续添加
      //   })
      //   // console.log(this)
      //   this.articles.unshift(...arr)
      //   this.refreshSuccessText = `加载了${arr.length}条数据`
      //   this.downLoading = false // 关闭刷新的状态
      // }, 1000)
      await this.$sleep(500)
      let res = await getArticles({ channel_id: this.channel_id, timestamp: Date.now() })
      this.downLoading = false
      // 对下拉加载回来的请求数据进行判断 看是否为空
      console.log('下拉刷新得到的数据', res)
      if (res.results.length) {
        this.articles = res.results // 将article里面的数据全部覆盖
        this.finished = false //  将上拉加载打开
        this.timestamp = res.pre_timestamp // 将后台给与的时间戳保存到timestamp里面
        this.refreshSuccessText = `共加载了${res.results.length}条数据`
      } else {
        this.refreshSuccessText = '暂无数据'
      }
    }
  },
  created () {
    eventBus.$on('delArticle', (articleId, channelId) => {
      if (this.channel_id === channelId) {
        // 代表该列表就是当前激活的列表，因为列表是map遍历循环生成的，所以只有遍历到与传进来的列表id相同时，才会进入到循环中
        let index = this.articles.findIndex(item => item.art_id.toString() === articleId)
        // 通过比对art_id来对article中的数据进行筛选，当与传入的id一致时，把此时的索引导出
        if (index > -1) {
          this.articles.splice(index, 1)// 根据不喜欢文章的索引，在article中，直接将它删除
        }
      }
    })
  }
}
</script>

<style lang="less" scoped>
.article_item{
  h3{
    font-weight: normal;
    line-height: 2;
  }
  .img_box{
    display: flex;
    justify-content: space-between;
    .w33{
      width: 33%;
      height: 90px;
    }
    .w100{
      width: 100%;
      height: 180px;
    }
  }
  .info_box{
    color: #999;
    line-height: 2;
    position: relative;
    font-size: 12px;
    span{
      padding-right: 10px;
      &.close{
        border: 1px solid #ddd;
        border-radius: 2px;
        line-height: 15px;
        height: 12px;
        width: 16px;
        text-align: center;
        padding-right: 0;
        font-size: 8px;
        position: absolute;
        right: 0;
        top: 7px;
      }
    }
  }
}
</style>
