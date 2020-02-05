module.exports = {
  // 覆盖蓝色主题
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          // 这个就是新设置的主题颜色
          blue: '#3296fa'
        }
      }
    }
  }
}
