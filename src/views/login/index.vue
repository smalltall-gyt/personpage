<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">个人博客后台系统</h3>
      </div>
      <!-- 账号 -->
      <el-form-item prop="loginId">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="loginId"
          v-model="loginForm.loginId"
          placeholder="请输入管理员账号"
          name="loginId"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>
      <!-- 密码 -->
      <el-form-item prop="loginPwd">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="loginPwdType"
          ref="loginPwd"
          v-model="loginForm.loginPwd"
          :type="loginPwdType"
          placeholder="请输入管理员密码"
          name="loginPwd"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="loginPwdType === 'loginPwd' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>
      <!-- 验证码 -->
      <div class="captcha-container">
        <el-form-item prop="captcha" class="captcha-inputer">
          <span class="svg-container">
            <svg-icon icon-class="nested" />
          </span>
          <el-input
            ref="captcha"
            v-model="loginForm.captcha"
            placeholder="请输入验证码"
            name="captcha"
            tabindex="3"
            type="text"
            @keyup.enter.native="handleLogin"
          />
        </el-form-item>
        <div class="captcha" @click="fetchCaptcha" v-html="captchaSvg"></div>
      </div>
      <!-- 7天内免登陆 -->
      <el-checkbox v-model="loginForm.checked" class="check-box">7天内免登陆</el-checkbox>

      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">登录</el-button>

    </el-form>
  </div>
</template>

<script>
import { getCaptcha } from '@/api/login'

export default {
  name: 'Login',
  created () {
    this.fetchCaptcha()
  },
  data() {
    return {
      loginForm: {
        loginId: '',
        loginPwd: '',
        captcha: '',
        checked: false
      },
      // 登录校验规则
      loginRules: {
        loginId: [{ required: true, trigger: 'blur', message: '请输入管理员账号' }],
        loginPwd: [{ required: true, trigger: 'blur', message: '请输入密码' }, {
          min: 6, message: '密码长度必须大于6位', trigger: 'blur'
        }],
        captcha: [{required: true, trigger: 'blur', message: '请输入验证码'}]
      },
      loading: false,
      loginPwdType: 'loginPwd',
      redirect: undefined,
      captchaSvg: ''
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      if (this.loginPwdType === 'loginPwd') {
        this.loginPwdType = ''
      } else {
        this.loginPwdType = 'loginPwd'
      }
      this.$nextTick(() => {
        this.$refs.loginPwd.focus()
      })
    },
    // 登录处理
    handleLogin() {
      this.$refs.loginForm.validate((valid, object) => {
        if (valid) {
          if (this.loginForm.checked) {
            this.loginForm.remember = 7
          }
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm).then((data) => {
            console.log('进入了这里')
            this.$router.push({ path: this.redirect || '/' })
            this.loading = false
          }).catch((res) => {
            if (typeof res === 'object') {
              // 说明是账号密码错误
              this.$message.error('账号密码错误')
            } else {
              // 说明四验证码错误
              this.$message.error('验证码错误')
            }
            // 重新获取验证码
            this.fetchCaptcha()
            this.loading = false
            this.loginForm.captcha = ''
          })
        } else {
          if (object.loginId) {
            this.$message.error(object.loginId[0].message);
          } else if(object.loginPwd) {
            this.$message.error(object.loginPwd[0].message)
          } else if(object.captcha) {
            this.$message.error(object.captcha[0].message)
          }
          return false
        }
      })
    },
    // 获取验证码
    async fetchCaptcha () {
      const res = await getCaptcha()
      this.captchaSvg = res
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
.captcha-container {
  display: flex;
}
.captcha-inputer {
  width: 70%;
}
.captcha {
  cursor: pointer;
  width: 150px;
  height: 50px;
}
.check-box {
  margin-bottom: 22px;
}
</style>
