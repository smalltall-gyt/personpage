<template>
  <div class="comment-container">
    <el-table
      :data="tableData"
      border
      style="width: 100%">
      <el-table-column
        label="序号"
        align="center"
        width="80">
        <template slot-scope="scope">{{scope.$index + 1 + (currentPage - 1) * pageSize}}</template>
      </el-table-column>
      <el-table-column
        prop="avatar2"
        label="头像"
        align="center"
        width="100">
        <template slot-scope="scope">
          <el-avatar size="small" :src="scope.row.avatar2"></el-avatar>
        </template>
      </el-table-column>
      <el-table-column
        prop="nickname"
        label="昵称"
        align="center"
        width="200">
      </el-table-column>
      <el-table-column
        prop="content"
        align="center"
        label="评论内容">
      </el-table-column>
      <el-table-column
        prop="createDate"
        label="评论日期"
        align="center"
        width="240"
      >
        <template slot-scope="scope">{{ scope.row.createDate | formatDate('YYYY-MM-DD HH:mm:ss dddd')}}</template>
      </el-table-column>
      <el-table-column label="操作" width="100" align="center">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="删除" placement="bottom">
            <el-button type="danger" icon="el-icon-delete" circle size="mini" @click="handleDelete(scope.row)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <el-pagination
      background
      class="pagination"
      layout="prev, pager, next, ->, sizes, jumper"
      :page-size="pageSize"
      :page-sizes="pageSizes"
      :current-page.sync="currentPage"
      @prev-click="handlePageChange"
      @next-click="handlePageChange"
      @current-change="handlePageChange"
      @size-change="handleSizeChange"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
import { getComment, deleteComment } from '@/api/comment'
import { baseURL } from '@/urlConfig'

export default {
  data () {
    return {
      tableData: [], // 评论数据
      total: 0, // 评论总数
      pageSize: 5, // 每页的数据量
      currentPage: 1, // 当前页
      blogId: -1, // 获取哪篇博客的评论
      keyword: '', // 搜索关键字
      totalPage: 0, // 总页数
      pageSizes: [5, 10, 15, 20], // 可选的每页数据量
    }
  },
  created () {
    this.fetchComment()
  },
  methods: {
    // 获取评论数据
    async fetchComment () {
      const res = await getComment({
        page: this.currentPage,
        limit: this.pageSize,
        blogId: this.blogId,
        keyword: this.keyword
      })
      this.tableData = res.data.rows
      this.total = res.data.total
      this.totalPage = Math.ceil(this.total / this.pageSize)
      if (this.currentPage > this.totalPage) {
        this.currentPage = this.totalPage
      }
      for (let i = 0; i < this.tableData.length; i++) {
        this.$set(this.tableData[i], 'avatar2', baseURL + this.tableData[i].avatar)
      }
      console.log(res);
    },
    // 当页码切换时触发
    handlePageChange (curPage) {
      this.currentPage = curPage
      this.fetchComment()
    },
    // 删除评论
    handleDelete (data) {
      console.log(data);
      this.$confirm('此操作将永久删除该评论, 是否继续?', '是否删除该评论', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await deleteComment(data.id)
        if (!res.code && res.data) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          if (this.tableData.length === 1) {
            this.currentPage--
            if (this.currentPage < 1) {
              this.currentPage = 1
            }
          }
          this.fetchComment()
        }
      }).catch(() => {});
    },
    // 当每页数据量发生改变时触发
    handleSizeChange (pageSize) {
      this.currentPage = 1
      this.pageSize = pageSize
      this.fetchComment()
    }
  }
}
</script>

<style lang="scss" scoped>
  .comment-container {
    padding: 20px;
  }
  .pagination {
    margin-top: 30px;
  }
</style>
