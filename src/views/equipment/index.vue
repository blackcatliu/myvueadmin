<template>
  <div class="app-container">
    <!-- <el-form :inline="true" :model="dataForm" @keyup.enter.native="getMsg()"> -->
    <el-form :inline="true" :model="dataForm">
      <b class='toptitle'>名称</b>
      <el-form-item>
        <el-input style="border-radius: 4px;width:260px;" v-model="dataForm.device_name" placeholder="请输入名称" clearable></el-input>
      </el-form-item>
      <b class='toptitle'>类型</b>
      <el-select
        v-model="dataForm.type"
        placeholder="请选择类型"
        clearable
        class="filter-item"
        style="border-radius: 4px;width: 260px;"
      >
        <el-option v-for="item in typeList" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
      <b class='toptitle'>厂家</b>
      <el-select
        v-model="dataForm.device_manufacturer"
        placeholder="请选择厂家"
        clearable
        class="filter-item"
        style="border-radius: 4px;width: 260px;"
      >
        <el-option v-for="item in deviceList" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
      <el-form-item>
        <!-- <el-button @click="getMsg()">查询</el-button> -->
        <el-button type="primary" @click="getTypeList()" style="border-radius: 4px;width: 118px;">查询</el-button>
        <el-button @click="addOrUpdateHandle()" style="border-radius: 4px;width: 118px;">添加</el-button>
      </el-form-item>
    </el-form>
    <!-- <el-table :data="dataList" border style="width: 100%;">
      <el-table-column prop="device_manufacturer" header-align="center" align="center" width="80" label="设备厂家"></el-table-column>
      <el-table-column prop="device_name" header-align="center" align="center" label="设备名称"></el-table-column>
      <el-table-column prop="type" header-align="center" align="center" label="设备类型"></el-table-column>
      <el-table-column prop="direction_type" header-align="center" align="center" label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.device_connect === 2" size="small" type="danger">未连接</el-tag>
          <el-tag v-else size="small">已连接</el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="getMsg(scope.row.id)">修改</el-button>
          <el-button type="danger" size="small" @click="getMsg(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>-->
    <div style="margin-bottom:19px;width:1578px">
      <el-row>
        <el-card class="box-card">
          <div class="title_flex">
            <div>
              <span style="fontsize:15px;"><b>依图抓拍机</b></span>
            </div>
            <div class="title_flex" style="color:#A1A1A1;">
              <div class="point green"></div>
              <span>已连接</span>
              <div class="point red"></div>
              <span>未连接</span>
            </div>
          </div>
          <div>
            <el-col v-for = "(value,index) in dataList02" class="text-center"  @mouseenter.native="showmsg(index)" @mouseleave.native="hidemsg()">
              <div class='showbox' v-if="isShow===index">
                <div class="textbutton"><span>详情</span></div>
                <div class="textbutton"><span>编辑</span></div>
                <div class="textbutton"><span>删除</span></div>
              </div>
              <div>
              <div class="pass_icon red"></div>
              <div class="img_box">
                <img
                  src="http://tvax1.sinaimg.cn/crop.0.0.512.512.1024/82e2365cly8fxq439doeqj20e80e8jrs.jpg"
                />
              </div>
              <div class="title-box">
                <span>9号楼面板机</span>
              </div>
              </div>
            </el-col>
            <!-- <el-col :span="3" class="text-center" v-bind:index=2 @mouseenter.native="showmsg($event)" @mouseleave.native="hidemsg()">
              <div class='showbox' v-if="isShow===index">
                <div class="textbutton"><span>详情</span></div>
                <div class="textbutton"><span>编辑</span></div>
                <div class="textbutton"><span>删除</span></div>
              </div>
              <div class="pass_icon red"></div>
              <div class="img_box">
                <img
                  src="http://tvax1.sinaimg.cn/crop.0.0.512.512.1024/82e2365cly8fxq439doeqj20e80e8jrs.jpg"
                />
              </div>
              <div class="title-box">
                <span>9号楼面板机</span>
              </div>
            </el-col> -->
          </div>
          
        </el-card>
        
      </el-row>
    </div>
   
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getMsg"></add-or-update>
  </div>
</template>

<script>
import AddOrUpdate from "./equipment-add-or-update";
export default {
  data() {
    return {
      dataForm: {
        device_name: "",
        id: "",
        ip: "",
        type: "",
        direction_type: "",
        device_manufacturer: "",
        system_name: "boor"
      },
      dataList: [],
      typeList: [],
      deviceList: [],
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      isShow:false,
      index:0,
      dataList02:[{
	    device_name: '实验室东门闸机',
	    id: 1,
	    ip: '219.245.31.215',
      type: 3,
	    direction_type:0,
	    device_manufacturer:1
	},{
	    device_name: '实验室东门闸机',
	    id: 2,
	    ip: '219.245.31.215',
      type: 3,
	    direction_type:0,
	    device_manufacturer:1
	},{
	    device_name: '实验室东门闸机',
	    id: 3,
	    ip: '219.245.31.215',
      type: 3,
	    direction_type:0,
	    device_manufacturer:1
	},{
	    device_name: '实验室东门闸机',
	    id: 4,
	    ip: '219.245.31.215',
      type: 3,
	    direction_type:0,
	    device_manufacturer:1
	}
]
    };
  },
  components: {
    AddOrUpdate
  },
  created() {
    this.getMsg();
    this.getTypeList();
    this.getDeviceList();
  },
  methods: {
    getMsg() {
      var param = { system_name: "boor" };
      this.$http({
        url: "https://cj.nwu.edu.cn:8804/device/get",
        method: "post",
        data: param
      }).then(data => {
        if (data && (data.code === 0 || data.code === 200)) {
          console.log("请求成功");
        } else {
          console.log("请求失败");
        }
      });
    },
    getTypeList() {
      this.$http({
        url: "https://cj.nwu.edu.cn:8804/device/type",
        method: "get",
        params: {}
      }).then(data => {
        if (data && (data.code === 0 || data.code === 200)) {
          this.typeList = data.data;
        } else {
          console.log("请求失败");
        }
      });
    },
    getDeviceList() {
      this.$http({
        url: "https://cj.nwu.edu.cn:8804/device/manufacturer",
        method: "get",
        params: {}
      }).then(data => {
        if (data && (data.code === 0 || data.code === 200)) {
          this.deviceList = data.data;
        } else {
          console.log("请求失败");
        }
      });
    },
    showmsg(index){
      console.log(index)
      this.isShow=index

    },
    hidemsg(){
      this.isShow=false
    },
    // 新增 / 修改
    addOrUpdateHandle(id) {
      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id);
      });
    },
    // 删除
    deleteHandle(id) {
      this.$confirm(`确定对[id=${id}]进行[删除]操作?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl(`/sys/menu/delete/${id}`),
            method: "post",
            data: this.$http.adornData()
          }).then(data => {
            if (data && data.code === 200) {
              this.$message({
                message: "操作成功",
                type: "success",
                duration: 1500,
                onClose: () => {
                  this.getDataList();
                }
              });
            } else {
              this.$message.error(data.msg);
            }
          });
        })
        .catch(() => {});
    }
  }
};
</script>
<style>
.text-center {
  width: 171px;
  height: 179px;
  margin: 10px;

  border: 1px solid #ececec;
  border-radius: 10px;
  position: relative;
}
.img_box {
  width: 171px;
  height: 137px;
  padding: 11px;
}
.title-box {
  width: 171px;
  height: 43px;
  border-top: 1px solid #ececec;
  padding: 10px;
}
.img_box img {
  width: 100px;
  height: 106px;
}
.pass_icon {
  width: 10px;
  height: 10px;
  border-radius: 5px;
  position: absolute;
  left: 13px;
  top: 13px;
}
.red {
  background: #fe6868;
}
.green {
  background: #60ec8e;
}
.point {
  width: 10px;
  height: 10px;
  border-radius: 5px;
  margin: 4px;
}
.title_flex {
  display: flex;
  justify-content: space-between;
}
.textbutton{
  align-self: center;
  width: 73px;
  background: #fff;
  height: 22px;
  border-radius: 4px;
  opacity: 1;
}
.showbox{
    width: 100%;
    height: 100%;
    background: RGBA(234, 234, 234,0.7);
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    text-align: center;
    position: absolute;

}
.textbutton span{
  line-height: 22px;
  color: #6D8DFA;
  font-size: 12px;
}
.toptitle{
  font-size: 14px;
}
input{
  width:260px;
}
</style>
