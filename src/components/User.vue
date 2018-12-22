<template>
  <div id="user">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/Home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框 -->
    <el-input placeholder="请输入内容" v-model="query" class="input-with-select">
      <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
    </el-input>
    <el-button type="success" plain size="small">添加用户</el-button>
    <!-- 数据显示的表格区域 -->
    <el-table :data="users">
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <!-- 自定义模版 <template slot-scope="scope"></template> -->
      <el-table-column prop="mg_state" label="状态">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.mg_state" plain></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop label="操作">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle plain size="mini"></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            circle
            plain
            size="mini"
            @click="del(scope.row.id)"
          ></el-button>
          <el-button type="success" icon="el-icon-check" round plain size="mini">分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentpage"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  data() {
    return {
      users: [],
      currentpage: 1,
      pagesize: 2,
      query: '',
      total: 0
    }
  },
  methods: {
    getUserList() {
      axios({
        method: 'get',
        url: 'http://localhost:8888/api/private/v1/users',
        params: {
          query: this.query,
          pagenum: this.currentpage,
          pagesize: this.pagesize
        },
        // 除了login页，其余页获取的时候都需要携带token，设置在请求头中携带。
        headers: { Authorization: localStorage.getItem('shopToken') }
      }).then(res => {
        console.log(res.data)
        this.total = res.data.data.total
        this.users = res.data.data.users
      })
    },
    // 操作每页多少条的时候会触发
    handleSizeChange(val) {
      this.pagesize = val
      this.getUserList()
    },
    // 当前页改变的时候会触发
    handleCurrentChange(val) {
      this.currentpage = val
      this.getUserList()
    },
    // 搜索的时候query中就是input中输入的值
    search() {
      // 搜索出的数据从第一页开始显示
      this.currentpage = 1
      this.getUserList()
    },
    // 根据 作用域插槽中 获取的数据的id 值删除某一条数据，除了  ogin 页，其余所做操作，去某一页看都需要携带有效的token
    del(id) {
      this.$confirm('此操作将删除该用户?', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          axios({
            method: 'delete',
            url: `http://localhost:8888/api/private/v1/users/${id}`,
            headers: { Authorization: localStorage.getItem('shopToken') }
          }).then(res => {
            //  删除成功，返回成功的状态码
            if (res.data.meta.status === 200) {
              // 如果当前页的数据被删除完了，当前页减 1 ，如果大于1的就不用减
              if (this.users.length <= 1 && this.currentpage > 1) {
                this.currentpage--
              }
              this.$message({
                type: 'success',
                message: '删除成功!'
              })             
              this.getUserList()
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  },
  created() {
    this.getUserList()
  }
}
</script>

<style scoped lang="less">
.el-breadcrumb {
  padding: 20px 0px;
  background-color: snow;
  margin-bottom: 20px;
}
.el-pagination {
  margin: 20px 0;
}
.input-with-select {
  margin-bottom: 20px;
}
.el-input {
  width: 300px;
}
</style>
