<template>
  <div class="edit-blog-container">
    <!-- 文章标题 -->
    <div class="block">文章标题</div>
    <div class="blog-title-container">
      <el-input v-model="form.title" placeholder="请输入文章标题"></el-input>
    </div>
    <!-- 文章编辑 -->
    <div class="block">文章编辑</div>
    <Editor
      initialEditType="markdown"
      :initialValue="form.editorText"
      height="500px"
      ref="toastuiEditor"
    ></Editor>
    <!-- 文章描述 -->
    <div class="block">文章描述</div>
    <el-input type="textarea" v-model="form.description" rows="10"></el-input>
    <!-- 文章头图 -->
    <div class="block">文章头图</div>
    <Upload :imgSrc.sync="form.thumb"/>
    <!-- 文章分类 -->
    <div class="block">文章分类</div>
    <el-select v-model="form.categoryId">
      <el-option
        v-for="(item) in blogType"
        :key="item.id"
        :label="item.name"
        :value="item.id"
      ></el-option>
    </el-select>
    <!-- 发布按钮 -->
    <div class="block"></div>
    <el-button type="primary" @click.native="addBlogHandler">确认修改</el-button>
  </div>
</template>

<script>
import { updateBlog, getBlogById, getBlogType } from '@/api/blog'
import '@toast-ui/editor/dist/toastui-editor.css'
import { Editor } from '@toast-ui/vue-editor'
import Upload from '@/components/Upload'

export default {
  data () {
    return {
      form: {
        editorText: '',
        description: '',
        thumb: '',
        categoryId: ''
      },
      blogType: []
    }
  },
  components: {
    Editor,
    Upload
  },
  created () {
    this.fetchBlogById()
    this.fetchBlogType()
  },
  methods: {
    // 根据id获取博客详情
    async fetchBlogById () {
      const res = await getBlogById(this.$route.params.id)
      this.form = res.data
      this.$set(this.form, 'categoryId', res.data.category === null ? '' : res.data.category.id)
      // 将拿到的数据再设置回 富文本编辑器里
      this.$refs.toastuiEditor.invoke('setHTML', this.form.htmlContent)
      console.log(this.form);
    },
    // 获取所有分类
    async fetchBlogType () {
      const res = await getBlogType()
      this.blogType = res.data
    },
    // 修改博客 点击发送
    async addBlogHandler () {
      const htmlContent = this.$refs.toastuiEditor.invoke('getHTML')
      const markdownContent = this.$refs.toastuiEditor.invoke('getMarkdown')
      if (this.form.title && this.form.description && this.form.categoryId) {
        const res = await updateBlog(this.$route.params.id, {
          title: this.form.title,
          description: this.form.description,
          createDate: Date.now(),
          categoryId: this.form.categoryId,
          toc: [],
          htmlContent,
          markdownContent,
          thumb: this.form.thumb
        })
        if (!res.code && res.data) {
          this.$message({
            type: 'success',
            message: '修改成功'
          })
          this.$router.push('/blog/list')
        }
      } else {
        this.$message.error('请输入完整的信息')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .edit-blog-container {
    padding: 20px;
    .block {
      margin: 20px 0;
      font-weight: 100;
    }
  }
</style>
