<template>
  <div class="blog-list-container">
    <el-table
      :data="blogData"
      border
      style="width: 100%">
      <el-table-column
        label="序号"
        width="80"
        align="center">
        <template slot-scope="scope">
          {{ (scope.$index + 1) + (page - 1) * limit }}
        </template>
      </el-table-column>
      <el-table-column
        label="文章名称"
        align="center"
        prop="title"
      >
        <template slot-scope="scope">
          <el-popover
            placement="top-start"
            title="博客预览图"
            trigger="hover"
            >
            <el-image
              :src="scope.row.thumb"
              style="width:200px"
              :preview-src-list="srcList"></el-image>
            <a slot="reference" href="#" target="_blank" @click.prevent="goToTitle(scope.row)">{{ scope.row.title }}</a>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        prop="description"
        label="文章描述"
        align="center">
      </el-table-column>
       <el-table-column
        prop="scanNumber"
        label="浏览数"
        width="100"
        align="center">
      </el-table-column>
       <el-table-column
        prop="commentNumber"
        label="评论量"
        width="100"
        align="center">
      </el-table-column>
       <el-table-column
        prop="category.name"
        label="所属分类"
        width="100"
        align="center">
      </el-table-column>
       <el-table-column
        label="创建日期"
        align="center">
        <template slot-scope="scope">
          {{ scope.row.createDate | formatDate('YYYY-MM-DD HH:mm:ss dddd')}}
        </template>
      </el-table-column>
       <el-table-column
        label="操作"
        width="130"
        align="center">
        <template slot-scope="scope">
          <div class="icon-wrapper">
            <el-tooltip class="item" effect="dark" content="编辑" placement="bottom">
              <i class="el-icon-edit icon-style orange" @click="editBlogHandler(scope.row)"></i>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="bottom">
              <i class="el-icon-delete icon-style red" @click="deleteBlogHandler(scope.row)"></i>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <el-pagination
      class="pagination"
      layout="prev, pager, next, ->, sizes, jumper"
      :total="total"
      :page-size="limit"
      background
      @current-change="handleCurrentChange"
      @prev-click="handleCurrentChange"
      @next-click="handleCurrentChange"
      @size-change="handleSizeChange"
      :page-sizes="pageSizes">
    </el-pagination>
  </div>
</template>

<script>
import { getBlogByPage, deleteBlog } from '@/api/blog'
import { baseURL, frontEnd } from '@/urlConfig'

export default {
  created () {
    this.fetchBlogByPage()
  },
  data () {
    return {
      page: 1,
      limit: 5, // 每页的数据量
      keyword: '',
      category: -1,
      blogData: [],
      srcList: [], // 图片预览的数组
      total: 0, // 总共的数据量
      totalPage: 0, // 总页数
      pageSizes: [5, 10, 15, 20], // 可选每页的数据量
    }
  },
  methods: {
    async fetchBlogByPage () {
      const res = await getBlogByPage({
        page: this.page,
        limit: this.limit,
        keyword: this.keyword,
        category: this.category
      })
      this.blogData = res.data.rows
      this.total = res.data.total
      this.totalPage = Math.ceil(this.total / this.limit)
      if (this.page > this.totalPage) {
        this.page = this.totalPage
      }
      for (let i = 0; i < this.blogData.length; i++) {
        this.blogData[i].thumb = baseURL + this.blogData[i].thumb
        this.srcList.push(this.blogData[i].thumb)
      }
      console.log(res);
    },
    // 页面跳转
    goToTitle (data) {
      window.open(`${frontEnd}/article/${data.id}`)
    },
    // 删除博客
    deleteBlogHandler (data) {
      this.$confirm(`删除该文章后，该文章相关的所有评论也会一并删除，是否继续?`, '是否删除此篇文章', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const res = await deleteBlog(data.id)
          if (!res.code && res.data) {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.fetchBlogByPage()
          } 
        }).catch(() => {});
      
    },
    // 分页切换
    handleCurrentChange (currentPage) {
      if (currentPage > this.totalPage) {
        this.$message({
          type: 'info',
          message: '已经没有数据了'
        })
        return
      }
      this.page = currentPage
      this.fetchBlogByPage()
    },
    // 切换每页数据量
    handleSizeChange (pageSize) {
      this.limit = pageSize
      this.page = 1
      this.fetchBlogByPage()
    },
    // 点击编辑按钮 跳转到编辑页面
    editBlogHandler (data) {
      this.$router.push({
        name: 'editBlog',
        params: {
          id: data.id
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .blog-list-container {
    padding: 20px;
  }
  .icon-style {
    border-radius: 50%;
    border: 1px solid transparent;
    padding: 5px;
    color: #fff;
    cursor: pointer;
  }
  .orange {
    background-color: #E6A23C;
  }
  .red {
    background-color: #F56C6C;
  }
  .icon-wrapper {
    display: flex;
    justify-content: space-around;
  }
  .pagination {
    margin-top: 30px;
  }
</style>
