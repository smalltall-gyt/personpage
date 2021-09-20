<template>
  <div class="project-list-container">
    <el-table
      :data="tableData"
      border
      v-loading="loading"
      style="width: 100%">
      <el-table-column label="序号" width="80" align="center">
        <template slot-scope="scope">
          {{scope.$index + 1}}
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="项目名称"
        width="180"
        align="center">
        <template slot-scope="scope">
          <a :href="scope.row.url" target="_blank">{{scope.row.name}}</a>
        </template>
      </el-table-column>
      <el-table-column
        prop="description"
        label="项目描述"
        align="center"
        >
        <template slot-scope="scope">
          {{ scope.row.description.toString() }}
        </template>
      </el-table-column>
      <el-table-column
        prop="thumb"
        label="预览图"
        align="center"
        width="200">
        <template slot-scope="scope">
          <el-image
            style="height: 80px"
            :src="scope.row.thumb2"
            :preview-src-list="srcList"
            fit="contain"></el-image>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="180"
        align="center"
        class="column"
      >
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="github地址" placement="bottom">
            <el-button type="info" icon="iconfont icon-github" circle size="mini" @click.native="openGithub(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="编辑" placement="bottom">
            <el-button type="primary" icon="el-icon-edit" circle size="mini" @click.native="handleEditProject(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="bottom">
           <el-button type="danger" icon="el-icon-delete" circle size="mini" @click.native="handleDeleteProject(scope.row)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 编辑对话框 -->
    <el-dialog
      :visible.sync="dialogVisible"
      fullscreen
    >
      <EditProject
        mode="edit"
        @cancel="dialogVisible = false"
        @complete="handleComplete"
        :form="editForm"
      />
     
    </el-dialog>
  </div>
</template>

<script>
import { getProject, deleteProject } from '@/api/project'
import { baseURL } from '@/urlConfig'
import EditProject from '@/components/EditProject'

export default {
  data () {
    return {
      tableData: [], // 表格数据
      loading: false, // 是否处于加载
      srcList: [], // 图片预览数组
      dialogVisible: false, // 编辑对话框是否显示
      editForm: {}
    }
  },
  components: {
    EditProject
  },
  created () {
    this.fetchProject()
  },
  methods: {
    // 获取所有项目内容
    async fetchProject () {
      this.loading = true
      const res = await getProject()
      this.tableData = res.data
      for (let i = 0; i < this.tableData.length; i++) {
        this.$set(this.tableData[i], 'thumb2', baseURL + this.tableData[i].thumb)
        this.srcList.push(this.tableData[i].thumb2)
      }
      this.loading = false
    },
    // 打开github
    openGithub (data) {
      window.open(data.github)
    },
    // 修改项目
    handleEditProject (data) {
      this.dialogVisible = true
      this.editForm = {...data}
    },
    // 删除项目
    handleDeleteProject (data) {
      this.$confirm('此操作将永久删除该项目, 是否继续?', '是否删除该项目', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await deleteProject(data.id)
        if (!res.code && res.data) {
          this.fetchProject()
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        } else {
          this.$message.error('删除失败')
        }
      }).catch(() => {});
    },
    // 完成修改触发
    handleComplete () {
      this.fetchProject()
    }
  },
}
</script>

<style lang="scss" scoped>
  @import '//at.alicdn.com/t/font_2824645_g311rw1q2fh.css';
  .project-list-container {
    padding: 20px;
    ::v-deep .iconfont {
      font-size: 12px !important;
    }
  }
</style>
