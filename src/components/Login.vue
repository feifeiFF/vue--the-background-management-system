<template>
  <div id="Login">
    <!-- eslint-disable no-new  ref 给某个元素添加引用   $refs 每个实例都有 $refs 属性，用来获取元素上所有的实例引用 -->
    <el-form
      :model="form"
      status-icon
      ref="form"
      label-width="80px"
      class="demo-ruleForm"
      :rules="rules"
    >
      <img src="@/assets/logo.png" alt srcset id="avuter">
      <el-form-item label="用户名" prop="username">
        <el-input type="text" v-model="form.username" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          type="password"
          v-model="form.password"
          autocomplete="off"
          @keyup.enter.native="submitForm"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm(form)">提交</el-button>
        <el-button @click="resetForm(form)" class="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// 导入 axios 登录需要发送 ajax 请求
// axios 已经 添加到 vue的原型上了。

export default {
  data() {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 12, message: '长度在 3 到 12个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'change' },
          {
            min: 6,
            max: 12,
            message: '长度在 6 到 12 个字符',
            trigger: 'change'
          }
        ]
      }
    }
  },
  methods: {
    resetForm() {
      this.$refs.form.resetFields()
    },
    submitForm() {
      // validate 当表单校验完成的时候触发
      this.$refs.form.validate(valid => {
        // 校验失败的话 阻止表单提交
        // validate方法参数是一个回调函数，函数参数1是否校验成功 boolean 参数2 错误对象
        if (!valid) {
          this.$message.error('登录失败哦，请重新登录 ~')
        }

        this.axios({
          method: 'post',
          url: 'http://localhost:8888/api/private/v1/login',
          data: this.form
        }).then(res => {
          let { meta, data } = res
          if (meta.status === 200) {
            this.$message({
              showClose: true,
              message: '登录成功',
              type: 'success'
            })
            localStorage.setItem('shopToken', data.token)
            this.$router.push({ path: 'Home' })
          } else {
            this.$message({
              showClose: true,
              message: meta.msg,
              type: 'error'
            })
          }
        })
      })
    }
  }
}
</script>
// scoped 的作用是让样式只在当前作用域有效，原理是给每一个元素给了一个唯一的属性值，样式使用了属性选择器
<style lang="less" scoped>
#Login {
  width: 100%;
  height: 100%;
  background-color: #2d434c;
  overflow: hidden;

  .el-form {
    margin: 200px auto;
    border-radius: 10px;
    width: 400px;
    height: 200px;
    padding: 75px 30px 20px 20px;
    position: relative;
    background-color: #fff;
  }
  #avuter {
    border-radius: 50%;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: -50px;
    width: 100px;
    height: 100px;
  }
  .reset {
    margin-left: 80px;
  }
}
</style>
