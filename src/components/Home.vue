<template>
  <el-container id="home">
    <el-header>
      <div class="logo"></div>
      <div class="title">
        <h1>电商后台管理系统</h1>
      </div>
      <div class="loginOut">
        <span>欢迎登录</span>
        <a href="javascript:;" @click="loginout">退出</a>
      </div>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu
          :default-active="$route.path.slice(1)"
          class="el-menu-vertical-demo"
          background-color="#2d434c"
          text-color="#fff"
          active-text-color="#409EFF"
          collapse-transition
          unique-opened
          router
        >
          <!-- default-active 默认让谁高亮
             el-menu 整个菜单
             el-submenu 子菜单
             el-menu-item-goup 菜单分组
          el-menu-item 菜单项-->
          <el-submenu :index="itemsub.path" v-for="itemsub in menu" :key="itemsub.id">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{ itemsub.authName}}</span>
            </template>
            <el-menu-item :index="item.path" v-for="item in itemsub.children" :key="item.id">
              <i class="el-icon-menu"></i>
              <span slot="title">{{ item.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      menu: {}
    }
  },
  methods: {
    // 退化功能：退出之前询问用户事故确定退出，确定退出时销毁token，重新去登录页。
    async loginout() {
      try {
        await this.$confirm('您确定退出当前系统吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        this.$message({
          type: 'success',
          message: '退出成功!'
        })
        localStorage.removeItem('shopToken')
        this.$router.push('Login')
      } catch (e) {
        this.$message({
          type: 'info',
          message: '已取消退出'
        })
      }
    },
    // 动态加载左侧菜单栏
    async getMenu() {
      let res = await this.axios.get('menus')
      let {
        meta: { status },
        data
      } = res
      if (status === 200) {
        this.menu = data
        console.log(res)
      }
    }
  },
  created() {
    this.getMenu()
  }
}
</script>
<style lang="less" scoped>
#home {
  width: 100%;
  height: 100%;
}
.el-header {
  background-color: #2d434c;
  color: #fff;
  text-align: center;
  line-height: 60px;
  display: flex;
  .logo {
    width: 180px;
    height: 100%;
    background: url('../assets/ali2.gif') center no-repeat;
    background-size: contain;
  }
  .title {
    flex: 1;
  }
  .loginOut {
    width: 180px;
    height: 100%;
    a {
      margin-left: 20px;
      text-decoration: none;
      color: rgba(154, 194, 247, 0.171);
    }
  }
}

.el-aside {
  background-color: #2d434c;
  color: #333;
  .el-submenu {
    width: 200px;
  }
}

.el-main {
  color: #333;
  background-color: rgba(231, 204, 221, 0.116);
}

body > .el-container {
  margin-bottom: 40px;
}
</style>
