<template>
  <div id="Rights">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/Home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 展示用户权限列表 -->
    <el-table :data="rightsList" style="width: 100%">
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="authName" label="权限名称" width="180"></el-table-column>
      <el-table-column prop="path" label="路径" width="180"></el-table-column>
      <el-table-column label="层级">
        <template slot-scope="scope">
          <span v-if="+scope.row.level === 0 ">一级</span>
          <span v-else-if="+scope.row.level === 1 ">二级</span>
          <span v-else>三级</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rightsList: []
    }
  },
  methods: {
    async getRightsList() {
      let res = await this.axios.get('rights/list')
      let { data } = res
      console.log(res)
      this.rightsList = data
    }
  },
  created() {
    this.getRightsList()
  }
}
</script>

<style>
</style>
