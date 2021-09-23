<template>
  <div class="mine-container">
    <div class="block">关于我</div>
    <el-input v-model="url" :disabled="disabled"></el-input>
    <el-button
      type="primary"
      style="margin-top:20px"
      @click.native="handleEditURL"
    >{{ disabled ? '编辑' : '完成' }}</el-button>
  </div>
</template>

<script>
import { getURL, setURL } from '@/api/mine'

export default {
  data () {
    return {
      url: '',
      disabled: true
    }
  },
  created () {
    this.fetchURL()
  },
  methods: {
    // 获取url地址
    async fetchURL () {
      const res = await getURL()
      this.url = res.data
    },
    // 修改URL地址
    async handleEditURL () {
      if (this.disabled) {
        // 说明点击了编辑
        this.disabled = false
      } else {
        // 说明点击了完成
        const res = await setURL({
          url: this.url
        })
        if (!res.code && res.data) {
          this.$message({
            type: 'success',
            message: '修改成功'
          })
          this.disabled = true
        }
      }
      
    }
  }
}
</script>

<style lang="scss" scoped>
  .mine-container {
    padding: 20px;
    .block {
      margin-bottom: 20px;
    }
  }
</style>
