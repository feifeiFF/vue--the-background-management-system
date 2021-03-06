<template>
  <div id="role">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/Home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加角色 -->
    <el-button round size="mini" plain type="success" @click="showAddRoleDig">添加角色</el-button>
    <!-- 角色展示列表 -->
    <el-table ref="roleTable" :data="roleData" highlight-current-row style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="{row}">
          <span v-if="row.children.length === 0">暂无数据</span>
          <el-row v-else v-for="l1 in row.children" :key="l1.id" class="l1">
            <el-col :span="5">
              <el-tag closable @close="delRights(row,l1.id)">{{ l1.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="19">
              <el-row v-for="l2 in l1.children" :key="l2.id" class="l2">
                <el-col :span="7">
                  <el-tag type="success" closable @close="delRights(row,l2.id)">{{ l2.authName}}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col :span="17">
                  <el-tag
                    type="warning"
                    v-for="l3 in l2.children"
                    :key="l3.id"
                    closable
                    @close="delRights(row,l3.id)"
                  >{{ l3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column property="roleName" label="角色名称" width="250px"></el-table-column>
      <el-table-column property="roleDesc" label="角色描述" width="250px"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{row}">
          <!-- 编辑按钮 -->
          <el-button
            type="primary"
            icon="el-icon-edit"
            circle
            plain
            size="mini"
            @click="showEditRoleDig(row)"
          ></el-button>
          <!-- 删除按钮 -->
          <el-button
            type="danger"
            icon="el-icon-delete"
            circle
            plain
            size="mini"
            @click="delRole(row)"
          ></el-button>
          <el-button
            type="success"
            icon="el-icon-check"
            round
            plain
            size="mini"
            @click="showAssignRoleDig(row)"
          >分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分配权限 -->
    <el-dialog
      title="分配权限"
      :visible.sync="assignRoleDialogVisible"
      width="50%"
      :before-close="handleClose"
    >
      <el-tree
        ref="tree"
        :data="roleTree"
        :props="defaultProps"
        show-checkbox
        node-key="id"
        default-expand-all
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="assignRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="assignRole">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加角色  v-bind 即 ：就可以访问到 data 中数据-->
    <el-dialog
      :title="addRole.id?'修改角色':'添加角色'"
      :visible.sync="addRoleDialogVisible"
      :before-close="handleClose"
    >
      <el-form
        label-position="labelPosition"
        label-width="100px"
        :model="addRole"
        :rules="rules"
        ref="addRole"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRole.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRole.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelAddRole">取 消</el-button>
        <el-button type="primary" @click="addRoleData">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      roleData: [],
      assignRoleDialogVisible: false,
      roleTree: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      roleId: '',
      addRoleDialogVisible: false,
      addRole: {
        id: '',
        roleName: '',
        roleDesc: ''
      },
      rules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async getRolesList() {
      let res = await this.axios.get('roles')
      if (res.meta.status === 200) {
        this.roleData = res.data
        console.log(res)
      }
    },
    // 显示分配权限对话框
    async showAssignRoleDig(row) {
      //  获取当前用户角色的id值，删除的时候使用
      this.roleId = row.id
      // 显示分配权限对话框
      this.assignRoleDialogVisible = true
      let res = await this.axios.get('rights/tree')
      let {
        meta: { status },
        data
      } = res
      if (status === 200) {
        this.roleTree = data
      }
      let ids = []
      row.children.forEach(l1 => {
        l1.children.forEach(l2 => {
          l2.children.forEach(l3 => {
            ids.push(l3.id)
          })
        })
      })
      this.$refs.tree.setCheckedKeys(ids)
    },
    // 分配权限
    async assignRole() {
      // 获取所有选中的id
      let checkedId = this.$refs.tree.getCheckedKeys()
      let halfCheckedId = this.$refs.tree.getHalfCheckedKeys()
      let rids = checkedId.concat(halfCheckedId).join()
      // 将一半选中的全选的 id 获取到拼接转换为字符串
      let res = await this.axios.post(`roles/${this.roleId}/rights`, {
        rids
      })
      let {
        meta: { status }
      } = res
      if (status === 200) {
        this.getRolesList()
        this.$message.success('分配权限成功')
        this.assignRoleDialogVisible = false
      } else {
        this.$message.error('分配权限失败')
      }
    },
    // 删除权限
    async delRights(row, rightId) {
      // roleId 角色 id    rightId 权限id
      console.log(row.id, rightId)
      let res = await this.axios.delete(`roles/${row.id}/rights/${rightId}`)
      let {
        meta: { status },
        data
      } = res
      if (status === 200) {
        //  更新的时候只需要跟新当亲用户的权限即可，没必要跟新列表所有，所以传参的时候要注意啦
        console.log(data, row)
        // 局部更新只跟新用户权限
        row.children = data
        this.$message.success('删除权限成功')
      } else {
        this.$message.error('删除权限失败')
      }
    },
    // 显示添加角色的对话框
    showAddRoleDig() {
      this.addRoleDialogVisible = true
      // 因为和修改共享数据和模态框，修改回显的数据需要重置
      this.addRole.id = ''
      this.addRole.roleName = ''
      this.addRole.roleDesc = ''
    },
    // 显示编辑角色对话框
    showEditRoleDig(row) {
      // 显示修改对话框
      this.addRoleDialogVisible = true
      // 回显数据
      this.addRole.id = row.id
      this.addRole.roleName = row.roleName
      this.addRole.roleDesc = row.roleDesc
    },
    // 添加角色
    async addRoleData() {
      this.$refs.addRole.validate(async valid => {
        if (!valid) return false
        let res = await this.axios.post('roles', this.addRole)
        if (res.meta.status === 201) {
          this.$message.success('添加角色成功！')
          this.addRoleDialogVisible = false
          this.$refs.addRole.resetFields()
          this.getRolesList()
        } else {
          this.$message.error('添加角色失败 ！')
        }
      })
    },
    // 取消角色弹框消失，重置表单
    cancelAddRole() {
      this.$refs.addRole.resetFields()
      this.addRoleDialogVisible = false
    },
    // 编辑角色
    async editRole() {
      let id = this.editRole.id
      let res = await this.axios.put(`roles/${id}`)
      console.log(res)
    },
    // 删除角色
    async delRole(row) {
      let res = await this.axios.delete(`roles/${row.id}`)
      if (res.meta.status === 200) {
        this.$message.success('删除角色成功！')
        this.getRolesList()
      } else {
        this.$message.error('删除角色失败！')
      }
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    }
  },
  created() {
    this.getRolesList()
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 5px 5px;
}
.l1 {
  margin-bottom: 5px 0;
  border-bottom: 1px dotted #cccccc;
}
</style>
