<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="设备名称" prop="device_name">
        <el-input v-model="dataForm.device_name" placeholder="登录帐号"></el-input>
      </el-form-item>
      <el-form-item label="设备厂家" prop="device_manufacturer">
        <el-input v-model="dataForm.device_manufacturer" placeholder="设备厂家"></el-input>
      </el-form-item>
      <el-form-item label="设备类型" prop="type">
        <el-input v-model="dataForm.type" placeholder="设备类型"></el-input>
      </el-form-item>
      <el-form-item label="设备ID" prop="id">
        <el-input v-model="dataForm.id" placeholder="id"></el-input>
      </el-form-item>
      <el-form-item label="IP" prop="ip">
        <el-input v-model="dataForm.ip" placeholder="ip"></el-input>
      </el-form-item>
      <el-form-item label="用户名" size="mini" prop="username">       
        <el-input v-model="dataForm.username" placeholder="用户名"></el-input>
      </el-form-item>
      <el-form-item label="密码" size="mini" prop="password">
        <el-input v-model="dataForm.password" type="password" placeholder="密码"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
        roleList: [],
        dataForm: {
          id: '',
          username: '',
          password: '',
          device_manufacturer: '',
          device_name: '',
          ip: '',
          type: ''
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.id = id || 0
        this.$http({
          url: this.$http.adornUrl('https://cj.nwu.edu.cn:8804/device'),
          method: 'post',
          params: this.$http.adornParams()
        }).then((data) => {
          this.roleList = data && data.code === 200 ? data.data : []
        }).then(() => {
          this.visible = true
          this.$nextTick(() => {
            this.$refs['dataForm'].resetFields()
          })
        }).then(() => {
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`https://cj.nwu.edu.cn:8804/device`),
              method: 'put',
              params: this.$http.adornParams()
            }).then((data) => {
            if (data && (data.code === 0 || data.code === 200)) {
                this.dataForm.id = data.data.id
                this.dataForm.username = data.data.username
                this.dataForm.password = data.data.password
                this.dataForm.device_manufacturer = data.data.device_manufacturer
                this.dataForm.device_name = data.data.device_name
                this.dataForm.ip = data.data.ip
                this.dataForm.type = data.data.type
              }
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/sys/user/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id,
                'username': this.dataForm.username,
                'password': this.dataForm.password,
                'device_manufacturer': this.dataForm.device_manufacturer,
                'device_name': this.dataForm.device_name,
                'ip': this.dataForm.ip,
                'type': this.dataForm.type
              })
            }).then((data) => {
            if (data && (data.code === 0 || data.code === 200)) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList')
                  }
                })
              } else {
              this.$message.error(!!data.msg?data.msg:(!!data.message?data.message:'删除发生错误，请刷新界面'))
              }
            })
          }
        })
      }
    }
  }
</script>
