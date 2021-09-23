<template>
  <div class="setting-container">
    <el-form
      ref="form"
      :model="form"
      label-width="80px"
      label-position="top"
      :disabled="disabled"
    >
      <div class="title">网站信息</div>
      <el-form-item label="网站标题">
        <el-input v-model="form.siteTitle" style="width: 500px"></el-input>
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="form.mail" style="width: 500px"></el-input>
      </el-form-item>
      <el-form-item label="备案号" style="width: 500px">
        <el-input v-model="form.icp"></el-input>
      </el-form-item>
      <div class="title">网站头像信息</div>
      <el-form-item>
        <Upload class="avatar-upload" :imgSrc.sync="form.avatar" :imgSize="{width: '100px', height: '100px'}"/>
      </el-form-item>
      <div class="title">网址图标信息</div>
      <el-form-item label="网址图标地址">
        <el-input v-model="form.favicon" style="width: 500px"></el-input>
      </el-form-item>
      <el-form-item label="网址图标预览">
        <Upload :imgSrc.sync="form.favicon" class="avatar-upload" :imgSize="{width: '100px', height: '100px'}"/>
      </el-form-item>
      <div class="title">github信息</div>
      <el-form-item label="github名字">
        <el-input v-model="form.githubName" style="width: 500px"></el-input>
      </el-form-item>
      <el-form-item label="github地址">
        <el-input v-model="form.github" style="width: 500px"></el-input>
      </el-form-item>
      <div class="title">QQ信息</div>
      <el-form-item label="QQ号码">
        <el-input v-model="form.qq" style="width: 500px"></el-input>
      </el-form-item>
      <el-form-item label="QQ二维码图片预览">
        <Upload class="avatar-upload" :imgSrc.sync="form.qqQrCode" :imgSize="{width: '100px', height: '100px'}"/>
      </el-form-item>
      <div class="title">微信信息</div>
      <el-form-item label="微信号">
        <el-input v-model="form.weixin" style="width: 500px"></el-input>
      </el-form-item>
      <el-form-item label="微信二维码图片预览">
        <Upload class="avatar-upload" :imgSrc="form.weixinQrCode" :imgSize="{width: '100px', height: '100px'}"/>
      </el-form-item>
    </el-form>
    <el-button type="primary" @click="toEdit">编辑</el-button>
    <!-- 对话框 -->
    <el-dialog
      title="请编辑网站信息"
      :visible.sync="dialogVisible"
      fullscreen
    >
      <el-form
        ref="form"
        :model="form"
        label-width="80px"
        label-position="top"
      >
        <div class="title">网站信息</div>
        <el-form-item label="网站标题">
          <el-input v-model="form2.siteTitle" style="width: 500px"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="form2.mail" style="width: 500px"></el-input>
        </el-form-item>
        <el-form-item label="备案号" style="width: 500px">
          <el-input v-model="form2.icp"></el-input>
        </el-form-item>
        <div class="title">网站头像信息</div>
        <el-form-item>
          <Upload class="avatar-upload" :imgSrc.sync="form2.avatar" :imgSize="{width: '100px', height: '100px'}"/>
        </el-form-item>
        <div class="title">网址图标信息</div>
        <el-form-item label="网址图标地址">
          <el-input v-model="form2.favicon" style="width: 500px"></el-input>
        </el-form-item>
        <el-form-item label="网址图标预览">
          <Upload :imgSrc.sync="form2.favicon" class="avatar-upload" :imgSize="{width: '100px', height: '100px'}"/>
        </el-form-item>
        <div class="title">github信息</div>
        <el-form-item label="github名字">
          <el-input v-model="form2.githubName" style="width: 500px"></el-input>
        </el-form-item>
        <el-form-item label="github地址">
          <el-input v-model="form2.github" style="width: 500px"></el-input>
        </el-form-item>
        <div class="title">QQ信息</div>
        <el-form-item label="QQ号码">
          <el-input v-model="form.qq" style="width: 500px"></el-input>
        </el-form-item>
        <el-form-item label="QQ二维码图片预览">
          <Upload class="avatar-upload" :imgSrc.sync="form.qqQrCode" :imgSize="{width: '100px', height: '100px'}"/>
        </el-form-item>
        <div class="title">微信信息</div>
        <el-form-item label="微信号">
          <el-input v-model="form2.weixin" style="width: 500px"></el-input>
        </el-form-item>
        <el-form-item label="微信二维码图片预览">
          <Upload class="avatar-upload" :imgSrc="form2.weixinQrCode" :imgSize="{width: '100px', height: '100px'}"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click.native="handleConfirm">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import Upload from '@/components/Upload'
import { getSetting, updateSetting } from '@/api/setting'

export default {
  data () {
    return {
      // 渲染数据时使用
      form: {
        siteTitle: '', // 网站标题
        mail: '', // 网站邮箱
        icp: '', // 网站备案号
        avatar: '', // 头像
        favicon: '', // 网站图标
        githubName: '', // github名字
        github: '', // github地址
        qq: '', // qq账号
        qqQrCode: '', // qq二维码图片
        weixin: '', // 微信账号
        weixinQrCode: '' // 微信二维码图片
      },
      disabled: true, // 设置表单是否禁用
      dialogVisible: false, // 修改的对话框是否显示
      // 编辑数据时使用
      form2: {
        siteTitle: '', // 网站标题
        mail: '', // 网站邮箱
        icp: '', // 网站备案号
        avatar: '', // 头像
        favicon: '', // 网站图标
        githubName: '', // github名字
        github: '', // github地址
        qq: '', // qq账号
        qqQrCode: '', // qq二维码图片
        weixin: '', // 微信账号
        weixinQrCode: '' // 微信二维码图片
      },
    }
  },
  components: {
    Upload
  },
  created () {
    this.fetchSetting()
  },
  methods: {
    // 点击编辑按钮
    toEdit () {
      this.dialogVisible = true
      this.form2 = {...this.form}
      console.log(this.form2);
    },
    // 获取数据
    async fetchSetting () {
      const res = await getSetting()
      console.log(res);
      this.form = res.data
    },
    // 点击确定修改
    async handleConfirm () {
      const res = await updateSetting(this.form2)
      console.log(res);
      if (!res.code && res.data) {
        this.$message({
          type: 'success',
          message: '修改成功'
        })
        this.dialogVisible = false
        this.fetchSetting()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .setting-container {
    padding: 20px;
    .title {
      padding-top: 30px;
      margin-bottom: 20px;
      margin-top: 20px;
      font-size: 20px;
      border-top: 1px solid rgb(224, 224, 224);
    }
    .avatar-upload {
      width: 100px;
      height: 100px;
      ::v-deep .el-icon-plus  {
        width: 100px;
        height: 100px;
        line-height: 100px;
      }
    }
  }

</style>
