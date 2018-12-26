<template>
  <div id="productCate">
    <!-- 添加角色 -->
    <el-button round size="mini" plain type="success" @click="addCateDig">添加分类</el-button>
    <el-table :data="cateList" style="width: 100%" class="mt20">
      <!--  tree-key嵌套解析的id  parent-key 找父节点，否则收缩不了  level-key 设置层级  indentsize设置深度，number类型，所以是数值     -->
      <el-table-tree-column
        prop="cat_name"
        label="分类名称"
        tree-key="cat_id"
        parent-key="cat_pid"
        level-key="cat_level"
        :indent-size="30"
      ></el-table-tree-column>
      <el-table-column prop="cat_deleted" label="是否删除" width="180">
        <template slot-scope="scope">{{ scope.row.cat_deleted?'是':'否'}}</template>
      </el-table-column>
      <el-table-column prop="cat_level" label="排序"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{row}">
          <el-button type="primary" icon="el-icon-edit" circle plain></el-button>
          <el-button type="danger" icon="el-icon-delete" circle plain @click="delCate(row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加分类对话框 -->
    <el-dialog title="添加分类" :visible.sync="showCategoryDig" width="60%">
      <!-- 修改用户的对话框 -->
      <el-form
        status-icon
        ref="addForm"
        label-width="100px"
        class="demo-ruleForm"
        :model="addForm"
        :rules="rules"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级名称" prop="cat_pid">
          <!-- 表单想校验就需要 添加 prop属性 -->
          <!-- addForm.cat_pid 必须为数组   clearable 是否可清空  :optiopns 需要渲染的几级分类  v-model双向绑定的id值 -->
          <el-cascader
            change-on-select
            clearable
            :options="options"
            :props="props"
            v-model="addForm.cat_pid"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showCategoryDig = false">取 消</el-button>
        <el-button type="primary" @click="addCateForm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分页功能 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[4, 6, 8, 10]"
      :page-size="5"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      class="mt20"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pagenum: 1,
      pagesize: 7,
      showCategoryDig: false,
      cateList: [],
      total: 0,
      props: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      addForm: {
        cat_pid: [],
        cat_name: '',
        cat_level: ''
      },
      options: [],
      rules: {
        cat_name: [
          { required: true, message: '亲，请输入分类名称！', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    //  显示添加分类对话框  获取2级 分类 添加到 options 中
    async addCateDig() {
      this.showCategoryDig = true
      // 获取商品的 2 级分类  type wei
      let res = await this.axios.get('categories?type=2')
      this.options = res.data
      console.log(res)
    },
    // 获取商品分类数据
    async getCateList() {
      // axios 的get请求配置项中需要掺入一个 params
      let res = await this.axios.get('categories', {
        params: {
          type: 3,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      })
      let { data, meta } = res
      if (meta.status === 200) {
        this.cateList = data.result
        this.total = data.total
      }
      console.log(data)
    },
    //  添加分类
    addCateForm() {
      this.$refs.addForm.validate(async valid => {
        if (!valid) {
          return false
        }
        // eslint 中不可以使用中横线命名，需要使用 驼峰
        // cat_pid 获取父级元素的id
        // cat_level获取父级元素的长度 就可以知道层级了
        let { cat_name: catName, cat_pid: catPid } = this.addForm
        let res = await this.axios.post('categories', {
          cat_name: catName,
          cat_pid: catPid[catPid.length - 1] || 0,
          cat_level: catPid.length
        })

        let {
          meta: { status },
          data
        } = res
        if (status === 201) {
          this.$message.success('添加成功')
          this.$refs.addForm.resetFields()
          this.showCategoryDig = false
          // 添加完成重新渲染分类列表
          this.getCateList()
        }
      })
    },
    // 删除分类
    async delCate(row) {
      let { cat_id: id } = row
      let res = await this.axios.delete(`categories/${id}`)
      console.log(res)
      let {
        meta: { status },
        data
      } = res
      if (status === 200) {
        this.$message.success('删除分类成功')
        this.getCateList()
      }
    },
    // 分页处理
    handleSizeChange(val) {
      this.pagesize = val
      this.getCateList()
    },
    handleCurrentChange(val) {
      this.pagenum = val
      this.getCateList()
    }
  },
  created() {
    this.getCateList()
  }
}
</script>

<style scoped lang="less">
.mt20 {
  margin-top: 20px;
}
</style>
