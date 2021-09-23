<template>
  <div class="message-container">
    <el-table
      :data="tableData"
      border
      style="width: 100%">
      <el-table-column
        label="序号"
        align="center"
        width="80">
        <template slot-scope="scope">
          {{ scope.$index + 1 + (currentPage - 1) * pageSize }}
        </template>
      </el-table-column>
      <el-table-column
        label="头像"
        align="center"
        width="100"
      >
        <template slot-scope="scope">
          <el-avatar size="small" :src="scope.row.avatar2"></el-avatar>
        </template>
      </el-table-column>
      <el-table-column
        prop="nickname"
        label="昵称"
        align="center"
        width="180">
      </el-table-column>
      <el-table-column
        prop="content"
        align="center"
        label="内容">
      </el-table-column>
      <el-table-column
        prop="createDate"
        label="创建日期"
        align="center"
        width="240"
      >
        <template slot-scope="scope">{{ scope.row.createDate | formatDate('YYYY-MM-DD HH:mm:ss dddd')}}</template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="删除" placement="bottom">
             <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              size="mini"
              @click="hanldeDelete(scope.row)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pagination"
      background
      layout="prev, pager, next, ->, sizes, jumper"
      :page-size="pageSize"
      :current-page.sync="currentPage"
      :page-sizes="pageSizes"
      :total="total"
      @current-change="handleCurrentChange"
      @prev-click="handleCurrentChange"
      @next-click="handleCurrentChange"
      @size-change="handleSizeChange"
    >
    </el-pagination>
  </div>
</template>

<script>
import { addMessage, getMessage, deleteMessage } from '@/api/message'
import { baseURL } from '@/urlConfig'

export default {
  data () {
    return {
      tableData: [], // 存储留言信息
      currentPage: 1, // 当前页
      pageSize: 5, // 每页的数据量
      keyword: '', // 搜索关键字
      total: 0, // 总数据量
      pageSizes: [5, 10, 15, 20], // 每页可选的数据量
      totalPage: 0, // 总页数
    }
  },
  created () {
    this.fetchMessage()
  },
  methods: {
    // 获取留言信息
    async fetchMessage () {
      const res = await getMessage({
        page: this.currentPage,
        limit: this.pageSize,
        keyword: this.keyword
      })
      this.tableData = res.data.rows
      this.total = res.data.total
      this.totalPage = Math.ceil(this.total / this.pageSize)
      if (this.currentPage > this.totalPage) {
        this.currentPage = this.totalPage
      }
      for(let i = 0; i < this.tableData.length; i++) {
        this.$set(this.tableData[i], 'avatar2', baseURL + this.tableData[i].avatar)
      }
    },
    // 修改当前页
    handleCurrentChange (currentPage) {
      this.currentPage = currentPage
      this.fetchMessage()
    },
    // 删除当前留言
    hanldeDelete (data) {
      console.log(data);
      this.$confirm('此操作将永久删除该留言, 是否继续?', '是否删除该留言', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await deleteMessage(data.id)
        if (!res.code && res.data) {
          if (this.tableData.length === 1) {
            this.currentPage--
          }
          this.fetchMessage()
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }
      }).catch(() => {});
    },
    // 每页数据量发生改变的时候触发
    handleSizeChange (pageSize) {
      this.pageSize = pageSize
      this.currentPage = 1
      this.fetchMessage()
    }
  }
}
</script>

<style lang="scss" scoped>
  .message-container {
    padding: 20px;
    .pagination {
      margin-top: 30px;
    }
  }
</style>
