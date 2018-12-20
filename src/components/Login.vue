<template>
  <div id="Login">
    <img src="@/assets/logo.png" alt srcset id="avuter">
    <el-form :model="form" status-icon ref="ruleForm2" label-width="80px" class="demo-ruleForm">
      <el-form-item label="用户名" prop="username">
        <el-input type="text" v-model="form.username" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="passWord">
        <el-input type="password" v-model="form.passWord" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('form')">提交</el-button>
        <el-button @click="resetForm('form')" class="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        username: '',
        passWord: ''
      }
    }
  }
}
</script>
// scoped 的作用是让样式只在当前作用域有效，原理是给每一个元素给了一个唯一的属性值，样式使用了属性选择器
<style lang="less">
#Login {
  width: 400px;
  height: 200px;
  background: snow;
  margin: 200px auto;
  border-radius: 10px;
  padding: 75px 30px 20px 20px;
  position: relative;
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
