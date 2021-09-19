<template>
  <div class="upload-container">
    <el-upload
      class="avatar-uploader"
      :action="`/api/upload`"
      :headers="headers"
      :show-file-list="false"
      :on-success="handleSuccess"
    >
      <img v-if="imageUrl" :src="imageUrl" class="avatar" />
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
  </div>
</template>

<script>
import { baseURL } from '@/urlConfig'

export default {
  props: {
    imgSrc: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      baseURL: baseURL
    }
  },
  computed: {
    imageUrl () {
      if (this.imgSrc) {
        return baseURL + this.imgSrc
      } else {
        return ''
      }
    },
    headers () {
      return {
        Authorization: 'Bearer ' + localStorage.getItem('adminToken')
      }
    }
  },
  methods: {
    handleSuccess (response, file, fileList) {
      if (!response.code && response.data) {
        // 上传成功
        this.$emit('update:imgSrc', response.data)
      }
    }
  }
};
</script>

<style lang="scss" scoped>
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
    text-align: center;
    line-height: 178px;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
  }
  .upload-container {
    width: 180px;
    height: 180px;
  }
  .avatar {
    object-fit: cover;
    width: 180px;
    height: 180px;
    display: block;
  }
</style>
