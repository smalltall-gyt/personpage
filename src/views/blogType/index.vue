<template>
  <div class="blog-type-container">
    <!-- 添加分类 -->
    <div class="add-blog-type-container">
      <el-input v-model="typeValue" class="type-value-input" placeholder="请输入要添加的分类，左边选择分类的等级">
        <template slot="prepend">
          <el-select v-model="typeOrder" placeholder='' class="select">
            <el-option
              v-for="item in options"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </template>
      </el-input>
      <el-button type="primary" @click.native="addBlogTypeHandler">添加</el-button>
    </div>
    <!-- 分类列表 -->
    <el-table
      :data="typeList"
      border
      style="width:100%; margin-top:30px"
    >
      <el-table-column label="序号" width="100px" align="center">
        <template slot-scope="scope">{{ scope.$index + 1 }}</template>
      </el-table-column>
      <el-table-column label="博客类别" prop="name" align="center"></el-table-column>
      <el-table-column label="文章数量" prop="articleCount" align="center"></el-table-column>
      <el-table-column label="操作" width="200px" align="center">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="bottom">
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              size="mini"
              @click.native="handleEdit(scope.row)">
            </el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="bottom">
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              circle
              @click.native="handleDelete(scope.row)">
            </el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 修改分类的弹出框 -->
    <el-dialog
      title="请编辑该分类信息"
      :visible.sync="dialogVisible"
      width="30%"
      :close-on-click-modal="false"
      >
      <div class="block">博客分类</div>
      <el-input v-model="form.name" class="inputer"></el-input>
      <span style="margin-right:20px;display:inline-block">排序等级</span>
      <el-select v-model="form.order">
        <el-option
          v-for="(item, index) in options"
          :key="index"
          :value="item"
        >
        </el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { addBlogType, getBlogType, updateBlogType, deleteBlogType, deleteBlog } from '@/api/blog'

export default {
  data () {
    return {
      options: [1, 2, 3, 4, 5],
      typeOrder: 1, // 分类级别
      typeValue: '',  // 分类名称
      typeList: [], // 类别数组
      dialogVisible: false, // 修改博客的对话框是否显示
      form: { // 存储当前编辑分类的数据
        name: '',
        order: 1
      }
    }
  },
  created () {
    this.fetchBlogType()
  },
  methods: {
    // 添加分类
    async addBlogTypeHandler () {
      if (this.typeValue) {
        const res = await addBlogType({
          name: this.typeValue,
          order: this.typeOrder
        })
        if (!res.code && res.data) {
          this.$message({
            type: 'success',
            message: '添加成功'
          })
          this.fetchBlogType()
          this.typeValue = ''
          this.typeOrder = ''
        }
      } else {
        this.$message({
          type: 'warning',
          message: '请输入类别名称'
        })
      }
    },
    // 获取博客分类
    async fetchBlogType () {
      const res = await getBlogType()
      console.log(res);
      this.typeList = res.data
    },
    // 修改博客分类
    handleEdit (data) {
      this.form = {...data}
      // 1. 让对话框显示
      this.dialogVisible = true
      // 2. 数据回填
      // updateBlogType(blogId, )
    },
    // 删除博客分类
    handleDelete (data) {
      this.$confirm('删除该文博客分类后，该博客分类的相关文章将会受到影响，是否继续?', '是否删除该博客分类', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await deleteBlogType(data.id)
        if (!res.code) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.fetchBlogType()
        }
      }).catch(() => {});
    },
    // 点击确定修改博客分类按钮
    async confirm () {
      const res = await updateBlogType(this.form.id, {
        name: this.form.name,
        order: this.form.order
      })
      if (!res.code && res.data) {
        this.$message({
          type: 'success',
          message: '修改成功'
        })
        this.fetchBlogType()
        this.dialogVisible = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .blog-type-container {
    padding: 20px;
    .add-blog-type-container {
      // display: flex;
      .type-value-input {
        width: 400px;
        margin-right: 10px;
      }
    }
    .select {
      width: 60px;
    }
    .block {
      margin-bottom: 10px;
    }
    .inputer {
      margin-bottom: 20px;
    }
  }
</style>
