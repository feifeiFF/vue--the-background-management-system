<template>
  <div id="user">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/Home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框 -->
    <el-input
      placeholder="请输入内容"
      v-model="query"
      class="input-with-select"
      @keyup.enter.native="search"
    >
      <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
    </el-input>
    <el-button type="success" plain size="small" @click="showAddUser">添加用户</el-button>
    <!-- 数据显示的表格区域 -->
    <el-table :data="users">
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <!-- 自定义模版 <template slot-scope="scope"></template> -->
      <el-table-column prop="mg_state" label="状态">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            plain
            @change="changeStatus(scope.row.id,scope.row.mg_state)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            circle
            plain
            size="mini"
            @click="showEdit(scope.row)"
          ></el-button>
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
    <!-- 添加用户的对话框-->
    <el-dialog title="添加用户" :visible.sync="dialogVisible" width="60%" :before-close="handleClose">
      <el-form
        :model="User"
        status-icon
        :rules="rules"
        ref="User"
        label-width="80px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input type="text" v-model="User.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="User.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="User.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="User.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="编辑用户"
      :visible.sync="editdialogVisible"
      width="60%"
      :before-close="handleClose"
    >
      <!-- 修改用户的对话框 -->
      <el-form
        :model="edituser"
        status-icon
        :rules="rules"
        ref="edituser"
        label-width="80px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名">
          <el-tag type="info">{{ edituser.username }}</el-tag>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="edituser.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="edituser.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
// import axios from 'axios'
export default {
  data() {
    return {
      users: [],
      currentpage: 1,
      pagesize: 2,
      query: '',
      total: 0,
      dialogVisible: false,
      editdialogVisible: false,
      User: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      edituser: {
        id: '',
        email: '',
        mobile: '',
        username: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 12,
            message: '密码长度必须在 3 到 12 位',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 12,
            message: '密码长度必须在 3 到 12 位',
            trigger: 'blur'
          }
        ],
        email: [
          { type: 'email', message: '亲！输入合法的邮箱', trigger: 'blur' }
        ],
        mobile: [
          {
            pattern: /^1\d{10}$/,
            message: '亲！输入合法的手机号',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    async getUserList() {
      let res = await this.axios({
        method: 'get',
        url: 'users',
        params: {
          query: this.query,
          pagenum: this.currentpage,
          pagesize: this.pagesize
        }
        // 除了login页，其余页获取的时候都需要携带token，设置在请求头中携带。
        // headers: { Authorization: localStorage.getItem('shopToken') }
        // 设置了 axios的请求拦截器，获取到请求的相关参数后修改了请求头里面的 Authoration 字段
      })
      let {
        meta: { status },
        data: { users, total }
      } = res
      if (status === 200) {
        this.users = users
        this.total = total
      }
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
          this.axios({
            method: 'delete',
            url: `users/${id}`
            // headers: { Authorization: localStorage.getItem('shopToken') }
          }).then(res => {
            let {
              meta: { status }
            } = res
            //  删除成功，返回成功的状态码
            if (status === 200) {
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
    },
    // 改变用户状态
    changeStatus(id, state) {
      this.axios({
        method: 'put',
        url: `users/${id}/state/${state}`
      }).then(res => {
        this.getUserList()
      })
    },
    // 显示添加用户的对话框
    showAddUser() {
      this.dialogVisible = true
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    addUser() {
      this.axios({
        method: 'post',
        url: 'users',
        data: this.User
      }).then(res => {
        let { meta } = res
        if (meta.status === 201) {
          this.$message.success('添加用户成功！')
        }
        // 将添加的算进去之后计算它在第几页
        this.total++
        // 在数据的最后面添加，所以是最后一页
        this.currentpage = Math.ceil(this.total / this.pagesize)
        // 添加完成重新渲染
        this.getUserList()
        // 关闭对话框
        this.dialogVisible = false
        // 重置表单
        this.$refs.User.resetFields()
      })
    },
    showEdit(row) {
      this.editdialogVisible = true
      this.edituser.id = row.id
      this.edituser.username = row.username
      this.edituser.email = row.email
      this.edituser.mobile = row.mobile
    },
    updateUser() {
      this.$refs.edituser.validate(valid => {
        if (!valid) return false
        this.axios({
          method: 'put',
          url: `users/${this.edituser.id}`,
          data: {
            email: this.edituser.email,
            mobile: this.edituser.mobile
          }
        }).then(res => {
          let {
            meta: { status }
          } = res
          if (status === 200) {
            this.$message.success('修改用户成功!')
          }
          this.getUserList()
          this.$refs.edituser.resetFields()
          this.editdialogVisible = false
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

.el-pagination {
  margin: 20px 0;
}
.input-with-select {
  margin-bottom: 20px;
  width: 300px;
}
</style>
