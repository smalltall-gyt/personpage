<template>
  <div class="project-container">
    <h3 class="title">请编辑该项目信息</h3>
    <div class="block">项目名称</div>
    <el-input v-model="computedForm.name"></el-input>
    <div class="block">项目描述（每一项描述以英文逗号分隔）</div>
    <el-input v-model="computedForm.description"></el-input>
    <div class="block">项目链接</div>
    <el-input v-model="computedForm.url"></el-input>
    <div class="block">github地址</div>
    <el-input v-model="computedForm.github"></el-input>
    <div class="block">预览图地址</div>
      <Upload :imgSrc.sync="computedForm.thumb"/>
    <div class="block">排序等级</div>
    <el-select v-model="computedForm.order">
      <el-option
        v-for="(item, index) in orderOptions"
        :key="index"
        :value="item"
        :prop="item"
      ></el-option>
    </el-select>
    <div v-if="mode === 'add'">
      <div class="block"></div>
      <el-button type="primary" @click="handleCommit">提交项目</el-button>
    </div>
    <div class="block" v-else>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="handleCommit">确 定</el-button>
      </span>
    </div>
  </div>
</template>

<script>
import { addProject, updateProject } from '@/api/project'
import Upload from '@/components/Upload'

export default {
  props: {
    mode: {
      type: String,
      default: 'add'
    },
    form: {
      type: Object,
      default () {
        return {
          name: '',
          description: '',
          url: '',
          github: '',
          thumb: '',
          order: 1
        }
      }
    }
  },
  data () {
    return {
      orderOptions: [1, 2, 3, 4, 5],
      computedForm: {
        ...this.form,
        description: this.form.description.toString()
      }
    }
  },
  components: {
    Upload
  },
  methods: {
    async handleCommit () {
      if (this.computedForm.name && this.computedForm.description && this.computedForm.url && this.computedForm.order) {
        const data = {
          name: this.computedForm.name,
          url: this.computedForm.url,
          github: this.computedForm.github,
          description: this.computedForm.description.split(','),
          thumb: this.computedForm.thumb,
          order: this.computedForm.order
        }
        if (this.mode === 'add') {
          // 如果是添加 则执行添加操作
          const res = await addProject(data)
          if (!res.code && res.data) {
            this.$message({
              type: 'success',
              message: '提交成功'
            })
            this.$router.push('/project/list')
          }
        } else if(this.mode === 'edit') {
          // 如果是修改 则执行更新操作
          const res = await updateProject(this.computedForm.id, data)
          if (!res.code && res.data) {
            this.$message({
              type: 'success',
              message: '修改成功'
            })
            this.$emit('complete')
            this.$emit('cancel')     
          }
        }
      } else {
        this.$message.error('请输入完整的信息')
      } 
    },
    // 点击取消
    handleCancel () {
      this.$emit('cancel')
    }
  }
}
</script>

<style lang="scss" scoped>
  .project-container {
    padding: 20px;
    .title {
      margin-bottom: 50px;
    }
    .block {
      margin-top: 35px;
      margin-bottom: 10px;
    }
  }
  .avatar-uploader .el-upload {
    
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>