<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
     
      <el-form-item size="mini" prop="permList">
        <el-checkbox-group v-model="permIdList" @change="handleCheckedCitiesChange">
          <el-checkbox v-for="item in permList" :key="item.id" :label="item.id">{{item.name}}</el-checkbox>
        </el-checkbox-group>
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
        dataForm: {
          id: '',
          doorlist: '',
          userid:''
        },
        permList:[],
        permIdList:[]
      }
    },
    methods: {
      init (id) {
        this.dataForm.id = id || 0
        this.$http({
          url: this.$http.adornUrl(`/perm/dmsysuserdoor/doorlist/${this.dataForm.id}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then((data) => {
          if(data && data.code === 200){
            this.permIdList=[]
            this.dataForm.userid=this.dataForm.id
            this.permList =  data.data
            this.permList.forEach(element => {
              if(element.ischoose===1){
                this.permIdList.push(element.id)
              }
            });
          }else{
              this.$message.error(!!data.msg?data.msg:(!!data.message?data.message:'删除发生错误，请刷新界面'))
          }
          console.log(this.permList)
        }).then(() => {
          this.visible = true
          this.$nextTick(() => {
            this.$refs['dataForm'].resetFields()
          })
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/perm/dmsysuserdoor/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'PUT',
              data: this.$http.adornData({
                'doorlist': this.dataForm.doorlist,
                'userid': this.dataForm.userid
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
      },
      handleCheckedCitiesChange(value) {
        let checkedCount = value.length;
        this.dataForm.doorlist=value
        console.log(value)
        // this.checkAll = checkedCount === this.cities.length;
        // this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
      }
    }
  }
</script>
