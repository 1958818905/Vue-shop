<template>
  <div class="login_container">
    <div class="login_box">
      <!--头像-->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt=""/>
      </div>
      <!--登录表单-->
      <el-form
        ref="loginFormRef"
        :model="LoginForm"
        :rules="loginFormRules"
        label-width="0px"
        class="login_form"
      >
        <!--用户名-->
        <el-form-item prop="username">
          <el-input v-model="LoginForm.username" prefix-icon="el-icon-s-custom" p></el-input>
        </el-form-item>
        <!--密码-->
        <el-form-item prop="password">
          <el-input v-model="LoginForm.password" type="password" prefix-icon="el-icon-lock"></el-input>
        </el-form-item>
        <!--按钮-->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 数据绑定
      LoginForm: {
        username: '',
        password: ''
      },
      // 表单验证
      loginFormRules: {
        //  用户名验证
        username: [
          {
            required: true,
            message: '请输入登录名称',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 10,
            message: '长度在3-10位之间',
            trigger: 'blur'
          }
        ],
        // 密码验证
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 12,
            message: '长度在6-12位之间',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    // 点击重置按钮，重置登录表单
    resetLoginForm () {
      // console.log(this);
      this.$refs.loginFormRef.resetFields()
    },
    // 表单预验证
    login () {
      this.$refs.loginFormRef.validate(async (valid) => {
        console.log(valid)
        //  预验证不通过直接返回
        if (!valid) return
        // 调用main里面设置的axios 通过post方法 将输入框的数据上传
        // const { data: res } = this.$http.post('login', this.LoginForm)
        // await 只能用在被async修饰函数中
        const { data: res } = await this.$http.post('login', this.LoginForm)
        // console.log(res)
        // 判断登录（弹窗）
        if (res.meta.status !== 200) {
          return this.$message.error('登录失败！')
        } else {
          this.$message.success('登录成功！')
          console.log(res)
          window.sessionStorage.setItem('token', res.data.token)
          this.$router.push('/home')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}

.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #eee;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;

    img {
      background-color: #eee;
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }
}

.btns {
  display: flex;
  justify-content: flex-end;
}

.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
</style>
