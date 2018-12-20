<template>
  <el-container id="home">
    <el-header>
      <div class="logo"></div>
      <div class="title">
        <h1>电商后台管理系统</h1>
      </div>
      <div class="loginOut">
        <span>欢迎登录</span>
        <a href="javascript:;">退出</a>
      </div>
    </el-header>
    <el-container>
      <el-aside width="200px"></el-aside>
      <el-main></el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {}
</script>
<style lang="less" scoped>
#home {
  width: 100%;
  height: 100%;
}
.el-header {
  background-color: #81a1ccda;
  color: #333;
  text-align: center;
  line-height: 60px;
  display: flex;
  .logo {
    width: 180px;
    height: 100;
    background-color: #fff;
  }
  .title {
    flex: 1;
  }
  .loginOut {
    width: 180px;
    height: 100%;
  }
}

.el-aside {
  background-color: #142a44c4;
  color: #333;
  text-align: center;
  line-height: 200px;
}

.el-main {
  color: #333;
  text-align: center;
  line-height: 160px;
}

body > .el-container {
  margin-bottom: 40px;
}
</style>
