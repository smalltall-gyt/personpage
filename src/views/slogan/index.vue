<template>
  <div class="slogan-container">
    <el-table
      :data="tableData"
      border
      style="width: 100%"
      class="table"
    >
      <el-table-column
        label="序号"
        width="60">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="title"
        label="标题"
        width="150">
      </el-table-column>
      <el-table-column
        prop="description"
        label="描述"
        width="350"
      >
      </el-table-column>
      <el-table-column
        label="中图预览"
      >
        <template slot-scope="scope">
          <el-image
            style="width: 200px; height: 100px"
            :src="scope.row.midImg2"
            fit="contain"></el-image>
        </template>
      </el-table-column>
      <el-table-column
        label="大图预览"
      >
        <template slot-scope="scope">
          <el-image
            style="width: 200px; height: 100px"
            :src="scope.row.bigImg2"
            fit="contain"></el-image>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="100">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top" :hide-after="3000">
            <el-button type="primary" icon="el-icon-edit" circle size="mini" @click.native="editBanner(scope.$index)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹出框 -->
    <el-dialog
      title="请编辑信息"
      :visible.sync="dialogVisible"
      width="50%"
      >
      <el-form ref="form" :model="form" label-width="80px" label-position="top">
        <el-form-item label="标题">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.description"></el-input>
        </el-form-item>
        <div class="uploads">
          <el-form-item label="首页中图" class="form-item-img">
            <Upload :imgSrc.sync="form.midImg"></Upload>
          </el-form-item>
          <el-form-item label="首页大图" class="form-item-img">
            <Upload :imgSrc.sync="form.bigImg"></Upload>
          </el-form-item>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="toEditBanner">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getBanner, updateBanner } from '@/api/banner'
import { baseURL } from '@/urlConfig'
import Upload from '@/components/Upload'

export default {
  components: {
    Upload
  },
  created () {
    this.fetchBanner()
  },
  data () {
    return {
      tableData: [],
      dialogVisible: false,
      form: {
        id: '',
        midImg: '',
        bigImg: '',
        title: '',
        description: ''
      }
    }
  },
  methods: {
    // 获取首页标语信息
    async fetchBanner () {
      const res = await getBanner()
      this.tableData = res.data
      for (const item of this.tableData) {
        this.$set(item, 'midImg2', `${baseURL + item.midImg}`)
        this.$set(item, 'bigImg2', `${baseURL + item.bigImg}`)
      }
      console.log(this.tableData)
    },
    // 编辑首页标语
    editBanner (index) {
      this.form = {...this.tableData[index]}
      console.log(this.form);
      this.dialogVisible = true
    },
    // 发送请求修改首页标语
    async toEditBanner () {
      this.dialogVisible = false
      const arr = [...this.tableData]
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].id === this.form.id) {
          arr[i] = this.form
        }
      }
      await updateBanner(arr)
      this.$message({
        message: '修改成功',
        type: 'success'
      });
      this.fetchBanner()
    }
  }
}
</script>

<style lang="scss" scoped>
  .slogan-container {
    padding: 20px;
    box-sizing: border-box;
    .table {
      ::v-deep .cell {
        text-align: center;
      }
    }
  }
  
  .uploads {
    display: flex;
    margin-top: 50px;
    ::v-deep label {
      margin-right: 30px;
    }
  }
  .form-item-img {
    display: flex;
    margin-right: 50px;
  }
  ::v-deep .el-form-item__content {
    line-height: unset;
  }
  ::v-deep .el-dialog {
    margin-top: 6vh !important;
  }
</style>
