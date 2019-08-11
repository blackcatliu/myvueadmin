<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
  >
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      label-width="150px"
    >
      <el-form-item label="通行策略名称" prop="userName">
        <el-input v-model="dataForm.userName" placeholder></el-input>
      </el-form-item>
      <el-form-item label="时间段" size="mini" prop="status">
        <el-radio-group v-model="dataForm.status">
          <el-radio :label="0">全时间段</el-radio>
          <el-radio :label="1">指定时间段</el-radio>
          <br />
          <el-time-picker v-model="dataForm.startTime" format="HH:mm:ss" value-format="HH:mm:ss" :picker-options="{
selectableRange:`00:00:00 -${dataForm.endTime ? dataForm.endTime : '23:59:00'}`
}"></el-time-picker>
          <el-time-picker v-model="dataForm.endTime" format="HH:mm:ss" value-format="HH:mm:ss" :picker-options="{
selectableRange:`${dataForm.startTime ? dataForm.startTime : '00:00:00'}-23:59:00`
}"></el-time-picker>
        </el-radio-group>
        <br />
        <el-checkbox>周一</el-checkbox>
        <el-checkbox>周二</el-checkbox>
        <el-checkbox>周三</el-checkbox>
        <el-checkbox>周四</el-checkbox>
        <el-checkbox>周五</el-checkbox>
        <el-checkbox>周六</el-checkbox>
        <el-checkbox>周日</el-checkbox>
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { isEmail, isMobile } from "@/utils/validate";
export default {
  data() {
    var validatePassword = (rule, value, callback) => {
      if (!this.dataForm.id && !/\S/.test(value)) {
        callback(new Error("密码不能为空"));
      } else {
        callback();
      }
    };
    var validateComfirmPassword = (rule, value, callback) => {
      if (!this.dataForm.id && !/\S/.test(value)) {
        callback(new Error("确认密码不能为空"));
      } else if (this.dataForm.password !== value) {
        callback(new Error("确认密码与密码输入不一致"));
      } else {
        callback();
      }
    };
    var validateEmail = (rule, value, callback) => {
      if (!isEmail(value)) {
        callback(new Error("邮箱格式错误"));
      } else {
        callback();
      }
    };
    var validateMobile = (rule, value, callback) => {
      if (!isMobile(value)) {
        callback(new Error("手机号格式错误"));
      } else {
        callback();
      }
    };
    return {
      visible: false,
      roleList: [],
      dataForm: {
        id: 0,
        userName: "",
        password: "",
        comfirmPassword: "",
        salt: "",
        email: "",
        mobile: "",
        roleIdList: [],
        status: 1,
        name:'',
        validWeekday:'',
        startTime:'00:00:00',
        endTime:'23:59:59'
      },
      dataRule: {
        userName: [
          { required: true, message: "用户名不能为空", trigger: "blur" }
        ],
        
        status: [
          { required: true, message: "时间段不能为空", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    init(id) {
      this.dataForm.id = id || 0;
      this.$http({
        url: this.$http.adornUrl("/sys/role/select"),
        method: "get",
        params: this.$http.adornParams()
      })
        .then(data => {
          this.roleList = data && data.code === 200 ? data.data : [];
        })
        .then(() => {
          this.visible = true;
          this.$nextTick(() => {
            this.$refs["dataForm"].resetFields();
          });
        })
        .then(() => {
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/sys/user/info/${this.dataForm.id}`),
              method: "get",
              params: this.$http.adornParams()
            }).then(data => {
              if (data && (data.code === 0 || data.code === 200)) {
                this.dataForm.userName = data.data.username;
                this.dataForm.salt = data.data.salt;
                this.dataForm.email = data.data.email;
                this.dataForm.mobile = data.data.mobile;
                this.dataForm.roleIdList = data.data.roleIdList;
                this.dataForm.status = data.data.status;
              }
            });
          }
        });
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(
              `/sys/user/${!this.dataForm.id ? "save" : "update"}`
            ),
            method: "post",
            data: this.$http.adornData({
              userId: this.dataForm.id || undefined,
              username: this.dataForm.userName,
              password: this.dataForm.password,
              salt: this.dataForm.salt,
              email: this.dataForm.email,
              mobile: this.dataForm.mobile,
              status: this.dataForm.status,
              roleIdList: this.dataForm.roleIdList
            })
          }).then(data => {
            if (data && (data.code === 0 || data.code === 200)) {
              this.$message({
                message: "操作成功",
                type: "success",
                duration: 1500,
                onClose: () => {
                  this.visible = false;
                  this.$emit("refreshDataList");
                }
              });
            } else {
              this.$message.error(
                !!data.msg
                  ? data.msg
                  : !!data.message
                  ? data.message
                  : "删除发生错误，请刷新界面"
              );
            }
          });
        }
      });
    }
  }
};
</script>
