<template>
  <div>
    <div
      class="demo-upload-list"
      v-for="(item, index) in uploadList"
      :key="index"
      :style="imageWidth"
    >
      <template v-if="item.status === 'finished'">
        <img :src="item.url" v-if="uploadType == 1"/>
        <video :src="item.url"  v-if="uploadType == 2"></video>
        <div class="demo-upload-list-cover" >
          <Icon
            type="ios-eye-outline"
            @click.native="handleView(item)"
            :disabled="isEdit"  :style="isEdit?'display: none':''"
          ></Icon>
          <Icon
            type="ios-trash-outline"
            :disabled="isEdit"  :style="isEdit?'display: none':''"
            @click.native="handleRemove(item)"
          ></Icon>
        </div>
      </template>
      <template v-else>
        <Progress
          v-if="item.showProgress"
          :percent="item.percentage"
          hide-info
        ></Progress>
      </template>
    </div>
    <Upload
      ref="upload"
      name="image"
      :show-upload-list="false"
      :default-file-list="defaultList"
      :on-success="handleSuccess"
      :format="format"
      :max-size="maxSize"
      :on-format-error="handleFormatError"
      :on-exceeded-size="handleMaxSize"
      :before-upload="handleBeforeUpload"
      :multiple="isMultiple"
      type="drag"
      :action="action_data"
      :style="styleImg"
      v-if="!isEdit"
    >
      <div :style="styleDiv">
        <Icon type="ios-camera" size="20" :disabled="isEdit"  :style="isEdit?'display: none':''"></Icon>
      </div>
    </Upload>


    <Upload
      ref="upload"
      name="image"
      :show-upload-list="false"
      :default-file-list="defaultList"
      :on-success="handleSuccess"
      :format="format"
      :max-size="maxSize"
      :on-format-error="handleFormatError"
      :on-exceeded-size="handleMaxSize"
      :before-upload="handleBeforeUpload"
      :multiple="isMultiple"
      type="drag"
      :action="action_data"
      v-if="isEdit"
      :disabled="isEdit"  style="display: none"
    >
      <div :style="styleDiv">
        <Icon type="ios-camera" size="20" :disabled="isEdit"  :style="isEdit?'display: none':''"></Icon>
      </div>
    </Upload>

    <Modal title="视频/图片 预览" v-model="visible">
      <img
        :src="url"
        v-if="visible && uploadType == 1"
        style="width: 100%"
      />
      <video :src="url"  v-if="visible && uploadType == 2" style="width: 100%" controls="controls"></video>
    </Modal>
  </div>
</template>
<script>
import config from "@/config";
const baseUrl =
  process.env.NODE_ENV === "development"
    ? config.baseUrl.dev
    : config.baseUrl.pro;
export default {
  data() {
    return {
      defaultList: [],
      imgName: "",
      visible: false,
      uploadList: [],
      action_data: baseUrl+"admin/OpenApi/uploadImg/name/uploadImg", // 上传文件地址
      url:'',
      //
      styleImg:"display: inline-block; width: "+this.imageSize+"px",
      styleDiv:"width: "+this.imageSize+"px; height: "+this.imageSize+"px; line-height: "+this.imageSize+"px",
      imageWidth:"width: "+this.imageSize+"px;height: "+this.imageSize+"px;line-height: "+this.imageSize+"px"
    };
  },
  props:{
    // 单个文件最大大小
    maxSize:{
      type:Number,
      default:1024,
    },
    // 下标 直接回执
    index:{
      type:Number,
      default:1,
    },
    // 是否可以多选 默认不能
    isMultiple:{
      type:Boolean,
      default:false
    },
    // 最多上传图片个数
    maxNumber:{
      type:Number,
      default:1,
    },
    //上传类型 1图片 2视频
    uploadType:{
      type:Number,
      default:1,
    },
    defaultImags:{
      type:Array,
      default:()=>{
        return [];
      }
    },
    format:{
      type:Array,
      default:()=>{
        return [];
      }
    },
    // 删除框大小，和图片大小
    imageSize:{
      type:Number,
      default:150
    },
    // 是否可编辑
    isEdit:{
      type:Boolean,
      defautl:false
    },
  },
  methods: {
    handleView(item) {
      this.imgName = item.name;
      this.url = item.url;
      this.visible = true;
    },
    handleRemove(file) {
      const fileList = this.$refs.upload.fileList;
      this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
      this.emitImages();
    },
    handleSuccess(res, file) {
        file.name = res.data.attachmentName;
        file.url = res.data.url;
        this.emitImages();
    },
    /**
     * 回复文件信息
     */
    emitImages(){
      this.uploadList = this.$refs.upload.fileList;
      let params = this.$refs.upload.fileList;
      this.$emit("getImages",params);
      this.onChange();
    },
    /**
     * 回复图片信息直接数组，带有下标的
     */
    onChange(){
      let params = this.$refs.upload.fileList;
      let url = [];
      for (let index = 0; index < params.length; index++) {
        const item = params[index];
        if(item.status == "uploading"){
          return false;
        }
        url.push(item.url);
      }
      this.$emit("onChange",{
        url:url,
        index:this.index
      })
    },
    handleFormatError(file) {
      let formatString = this.format.join('、');
      console.log(11111111111,formatString);
      this.$Notice.warning({
        title: "文件格式错误",
        desc:
          "文件： " + file.name +
          " 格式错误，请上传 "+formatString+"格式文件",
      });
    },
    handleMaxSize(file) {
      this.$Notice.warning({
        title: "超出文件大小限制",
        desc: "文件  " + file.name + " 太大了, 最大为 ."+this.maxSize+'kb',
      });
    },
    handleBeforeUpload(file,fileList) {
      const check = this.uploadList.length + 1 <= this.maxNumber
      if (!check) {
        this.$Notice.warning({
          title: "上传文件太多了不能上传了.",
        });
      }
      return check;
    },
  },
  mounted() {
    this.uploadList = this.$refs.upload.fileList;
  },
  watch:{
    defaultImags(val){
      let listimage = [];
      for (let index = 0; index < val.length; index++) {
        const element = val[index];
        listimage.push({
          status: "finished",
          name:"",
          url:element
        });
      }
      this.defaultList = listimage;
      this.uploadList = listimage;
    },
  }
};
</script>
<style>
.demo-upload-list {
  display: inline-block;
  text-align: center;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  margin-right: 4px;
}
.demo-upload-list img {
  width: 100%;
  height: 100%;
}
.demo-upload-list-cover {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
}
.demo-upload-list:hover .demo-upload-list-cover {
  display: block;
}
.demo-upload-list-cover i {
  color: #fff;
  font-size: 300%;
  cursor: pointer;
  margin: 0 2px;
}
</style>
