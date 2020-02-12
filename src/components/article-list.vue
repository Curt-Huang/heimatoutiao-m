<template>
  <div class="scroll-wrapper">
    <van-pull-refresh v-model="downLoading" @refresh="onRefresh" :success-text="refreshSuccessText">
      <van-list v-model="upLoading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <!-- load是当滚动条与底部的距离小于offset时触发 默认是300px -->
        <!-- 这里注意 这个div设置了滚动条 目的是 给后面做 阅读记忆 留下伏笔 -->
        <!-- 阅读记忆 => 看文章看到一半 滑到中部 去了别的页面 当你回来时 文章还在你看的位置 -->
        <van-cell v-for="article in articles" :key="article" >
          <div class="article_item">
            <h3 class="van-ellipsis">PullRefresh下拉刷新</h3>
            <div class="img_box">
              <van-image class="w33" fit="cover" src="https://img.yzcdn.cn/vant/cat.jpeg" />
              <van-image class="w33" fit="cover" src="https://img.yzcdn.cn/vant/cat.jpeg" />
              <van-image class="w33" fit="cover" src="https://img.yzcdn.cn/vant/cat.jpeg" />
            </div>
            <div class="img_box">
              <van-image class="w100" fit="cover" src="https://img.yzcdn.cn/vant/cat.jpeg" />
            </div>
            <div class="info_box">
              <span>你像一阵风</span>
              <span>8评论</span>
              <span>10分钟前</span>
              <span class="close">
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
export default {
  name: 'article-list',
  data () {
    return {
      downLoading: false, // 是否开启下拉刷新
      upLoading: false, // 是否开启上拉加载
      finished: false, // 是否已经完成全部的数据加载
      refreshSuccessText: '', // 加载成功提示
      articles: []
    }
  },
  props: {
    channel_id: {
      type: Number,
      default: null,
      required: true
    }
  },
  methods: {
    //   上拉加载
    onLoad () {
      //   console.log('开始刷新')
      setTimeout(() => {
        if (this.articles.length < 50) {
          const arr = Array.from(Array(10), (value, index) => {
            return this.articles.length + index + 1 // 返回数组1~10  在添加之后原有的数字基础上 继续添加
          })
          // console.log(this)
          this.articles.push(...arr)
          this.upLoading = false // 加载完毕之后 关闭加载状态
        } else {
          this.finished = true // 当一共加载五十个后 显示所有数据加载完毕
        }
      }, 1000)
    },
    // 下拉刷新
    onRefresh () {
      setTimeout(() => {
        const arr = Array.from(Array(10), (value, index) => {
          return '刷新' + (index + 1) // 返回数组1~10  在添加之后原有的数字基础上 继续添加
        })
        // console.log(this)
        this.articles.unshift(...arr)
        this.refreshSuccessText = `加载了${arr.length}条数据`
        this.downLoading = false // 关闭刷新的状态
      }, 1000)
    }
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
