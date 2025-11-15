<template>
  <div>
    <Upload
      type="drag"
      name="image"
      :show-upload-list="false"
      :action="action_data"
      :format="type == 1 ? ['jpg', 'jpeg', 'png'] : ['mp4']"
      :max-size="maxSize"
      :on-format-error="handleFormatError"
      :on-exceeded-size="handleMaxSize"
      :before-upload="handleBeforeUpload"
      :on-success="handleSuccess"
      v-if="!image"
    >
      <div style="padding: 20px 0">
        <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
        <p>{{text}}</p>
      </div>
    </Upload>
    <div class="imageClass" v-else>
        <div>
            
            <img :src="image" class="imgWidth" v-if="type == 1"/>
            <div v-else>
                <video :src="image" style="width:100%"></video>
            </div>
        </div>
        <div>
            <Icon type="md-close" size="35" style="color: rgb(228, 53, 53)" @click="resetImage"/>
        </div>
    </div>
  </div>
</template>
<script>
import config from "@/config";
const baseUrl = process.env.NODE_ENV === "development"
    ? config.baseUrl.dev
    : config.baseUrl.pro;

export default {
    data(){
        return {
            action_data: baseUrl+"/admin/OpenApi/uploadImg/name/uploadImg", // 上传文件地址
            image:'',
        }
    },
    props:{
        text:{
            type:String,
            default:"上传结业照片"
        },
        maxSize:{
            type:Number,
            default:1024
        },
        defaultImag:{
            type:String,
            default:""
        },
        index:{
            type:Number,
            default:0
        },
        type:{
            type:Number,
            default:1
        },
    },
    methods:{
        handleFormatError(file) {
            this.$Notice.warning({
                title: "文件格式错误",
                desc:
                "文件： " +
                file.name +
                " 格式错误",
            });
        },
        handleMaxSize(file) {
            this.$Notice.warning({
                title: "超出文件大小限制",
                desc: "文件  " + file.name + " 太大了, 最大为 ."+this.maxSize+'kb',
            });
        },
        handleBeforeUpload(file,fileList) {
            if(this.image){
                return false;
            }
            return true;
        },
        handleSuccess(res, file) {
            file.name = "1";
            file.url = baseUrl+res.data;
            this.emitImages(res.data);
        },
        emitImages(url){
            this.image = baseUrl+url;
            this.$emit("on-upload",{
                url:url,
                index:this.index
            })
        },
        resetImage(){
            this.image = '';
            this.$emit("on-upload",{
                url:'',
                index:this.index
            })
        }
    },
    watch:{
        defaultImag(val){
            this.image = baseUrl+val;
            console.log(this.image);
        }
    }
};
</script>
<style scoped>
.imgWidth{
    width: 100%;
}
.imageClass{
    display: flex;
    justify-content: space-between;
}
</style>
