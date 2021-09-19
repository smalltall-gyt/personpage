<template>
  <div class="add-blog-container">
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
    <el-button type="primary" @click.native="addBlogHandler">发布文章</el-button>
  </div>
</template>

<script>
import '@toast-ui/editor/dist/toastui-editor.css'
import { Editor } from '@toast-ui/vue-editor'
import Upload from '@/components/Upload'
import { getBlogType, addBlog } from '@/api/blog'

export default {
  data () {
    return {
      form: {
        title: '', // 文章标题
        editorText: '', // 用户编辑的内容
        description: '', // 文章描述
        categoryId: '', // 分类id
        thumb: '', // 文章头图
      },
      blogType: [], // 存放博客分类
    }
  },
  created () {
    this.fetchBlogType()
  },
  components: {
    Editor,
    Upload
  },
  methods: {
    // 获取文章内容的html内容
    getHTML () {
      return this.$refs.toastuiEditor.invoke('getHTML')
    },
    // 获取文章内容的markdown内容
    getMarkdown () {
      return this.$refs.toastuiEditor.invoke('getMarkdown')
    },
    // 获取博客分类
    async fetchBlogType () {
      const res = await getBlogType()
      this.blogType = res.data
    },
    // 添加博客
    async addBlogHandler () {
      // 首先创建一个当前时间的时间戳
      const htmlContent = this.getHTML()
      const markdownContent = this.getMarkdown()
      // 组装要传递给服务器的数据
      const data = {
        title: this.form.title,
        description: this.form.description,
        createDate: Date.now(),
        categoryId: this.form.categoryId,
        toc: [],
        htmlContent,
        thumb: this.form.thumb,
        markdownContent
      }
      if (!(data.title && data.description && data.categoryId && data.htmlContent)) {
        this.$message.error('请输入完整的内容')
        return
      }
      const res = await addBlog(data)
      if (!res.code && res.data) {
        this.$message({
          type: 'success',
          message: '发布成功'
        })
        this.$router.push('/blog/list')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .add-blog-container {
    padding: 20px;
    .block {
      margin: 20px 0;
      font-weight: 100;
    }
  }
</style>
