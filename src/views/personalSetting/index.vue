<template>
  <div class="personal-setting-container">
    <el-form :model="form" :rules="rules" ref="form" label-width="100px" class="demo-ruleForm">
      <el-form-item label="用户名" prop="name">
        <el-input
          v-model="form.name"
          style="width: 390px"
          placeholder="请输入用户名"
        ></el-input>
      </el-form-item>
      <el-form-item label="旧密码" prop="oldLoginPwd">
        <el-input
          v-model="form.oldLoginPwd"
          style="width: 390px"
          placeholder="请输入旧密码"
          type="password"
        ></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="loginPwd">
        <el-input
          v-model="form.loginPwd"
          style="width: 390px"
          placeholder="请输入与新密码"
          type="password"
        ></el-input>
      </el-form-item>
      <el-form-item label="新密码确认" prop="confirmLoginPwd">
        <el-input
          v-model="form.confirmLoginPwd"
          style="width: 390px"
          placeholder="请确认新密码"
          type="password"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm()">修改</el-button>
        <!-- <el-button @click="resetForm('ruleForm')">重置</el-button> -->
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { updateAdmin } from '@/api/personalSetting'

export default {
  data () {
    // 自定义校验规则 (判断两次密码是否相同)
    var checkConfirmPwd = (rule, value, callback) => {
      if (value !== this.form.loginPwd) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback()
      }
    };
    return {
      form: {
        name: '', // 管理员名称
        loginId: '', // 登录id
        loginPwd: '', // 新密码
        oldLoginPwd: '', // 旧密码
        confirmLoginPwd: '', // 确认新密码
      },
      rules: {
        oldLoginPwd: [
          {required: true, message: '请输入旧密码', trigger: 'blur'}
        ],
        loginPwd: [
          {required: true, message: '请输入新密码', trigger: 'blur'}
        ],
        confirmLoginPwd: [
          {required: true, message: '请输入确认新密码', trigger: 'blur'},
          {validator: checkConfirmPwd, trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    submitForm () {
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          console.log(this.user);
          const res = await updateAdmin({
            loginId: this.user.loginId,
            loginPwd: this.form.loginPwd,
            name: this.form.name,
            oldLoginPwd: this.form.oldLoginPwd
          })
          console.log(res);
          if (!res.code && res.data) {
            this.$message({
              type: 'success',
              message: '修改成功'
            })
            localStorage.removeItem('adminToken')
            await this.$store.dispatch('user/logout')
            this.$router.push('/login')
            
          } else if (typeof res === 'string') {
            const error = JSON.parse(res)
            this.$message.error(error.msg)
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    }
  },
  computed: {
    ...mapState('user', ['user'])
  }
}
</script>

<style lang="scss" scoped>
  .personal-setting-container {
    padding: 20px;
  }
</style>
