<template>
  <div class="app-container">
    <div class="filter-container">
    <el-form :inline="true" :model="listQuery" @keyup.enter.native="getDataList()">
      <el-form-item>
        <!-- <el-input v-model="dataForm.roleName" placeholder="角色名称" clearable></el-input> -->
      <el-input v-model="listQuery.roleName" placeholder="角色名" style="width: 200px;" class="filter-item"
      />
      </el-form-item>   
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button v-if="isAuth('sys:role:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button v-if="isAuth('sys:role:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
      </el-form-item>   
    </el-form>
    </div>

    <el-table :data="rolesList" style="width: 100%;margin-top:30px;" border @selection-change="selectionChangeHandle">
      <el-table-column type="selection" header-align="center" align="center" width="50">
      </el-table-column>
      <el-table-column align="center" label="ID" width="220">
        <template slot-scope="scope">{{ scope.row.roleId }}</template>
      </el-table-column>
      <el-table-column align="center" label="角色名称" width="220">
        <template slot-scope="scope">{{ scope.row.roleName }}</template>
      </el-table-column>
      <el-table-column align="header-center" label="备注">
        <template slot-scope="scope">{{ scope.row.remark }}</template>
      </el-table-column>
      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">{{ scope.row.createTime }}</template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="addOrUpdateHandle(scope.row.roleId)">修改</el-button>
          <el-button type="danger" size="small" @click="deleteHandle(scope.row.roleId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getDataList" />

    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
import path from "path";
import AddOrUpdate from './role-add-or-update'
import { deepClone } from "@/utils"
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import {
  getRoutes,
  getRoles,
  addRole,
  deleteRole,
  updateRole
} from "@/api/mypermission";

const defaultRole = {
  key: "",
  name: "",
  description: "",
  routes: []
};

export default {
  data() {
    return {
      role: Object.assign({}, defaultRole),
      routes: [],
      rolesList: [],
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        roleName: undefined
      },
      dialogVisible: false,
      dialogType: "new",
      checkStrictly: false,
      defaultProps: {
        children: "children",
        label: "title"
      },
      dataList: [],
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false
    };
  },
  components: {
    AddOrUpdate,
    Pagination
  },
  computed: {
    routesData() {
      return this.routes;
    }
  },
  created() {
    // // Mock: get all routes and roles list from server
    // this.getRoutes()    // 菜单授权，后台还未提供接口，暂时注释掉
    this.getDataList();
  },
  methods: {
    // async getRoutes() {
    //   const res = await getRoutes();
    //   this.serviceRoutes = res.data;
    //   this.routes = this.generateRoutes(res.data);
    // },
    async getDataList() {
      const res = await getRoles(this.listQuery);
      this.rolesList = res.data.list;
      this.total = res.data.totalCount
    },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      // 删除
      deleteHandle (id) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.roleId
        })
        if (ids.indexOf(1)!==-1 ){
          this.$message.error('不允许删除管理员！')
          return
        }
        this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/sys/role/delete'),
            method: 'post',
            data: this.$http.adornData(ids, false)
          }).then((data) => {
            if (data && (data.code === 0 || data.code === 200)) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList()
                }
              })
            } else {
              this.$message.error(!!data.msg?data.msg:(!!data.message?data.message:'删除发生错误，请刷新界面'))
            }
          })
        }).catch(() => {})
      }

  }
};
</script>

<style lang="scss" scoped>
.app-container {
  .roles-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>
