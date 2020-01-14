<template>
  <div class="split">
    <div  class="split"></div>
    <van-skeleton avatar title :row="3" />
    <div class="split"></div>
    <van-skeleton avatar title :row="3" />
    <div class="split"></div>
    <van-skeleton avatar title :row="3" />
  </div>
</template>

<script>
export default {
}
</script>

<style lang="less" scoped>
.split {
  height: 20px;
}
</style>
