<template>
    <div>
        <!-- //显示默认图片 -->
        <div v-if="imgUrl">
            <div>
                <img :src="imgUrl" style="width:100%">
            </div>
            <div class="rightButton" :disabled="isEdit"  :style="isEdit?'display: none':''">
                <Button type="error" @click="resetImg">重新上传</Button>
            </div>
        </div>
        <div v-if="!imgUrl && !showCropper">
            <Upload
                action=""
                :before-upload="handleUpload"
                type="drag">
                <div style="padding: 20px 0">
                    <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                    <p>选择剪切图片</p>
                </div>
            </Upload>
        </div>

        <Modal
            v-model="showCropper"
            title="图片剪切"
            @on-ok="cutImg"
            @on-cancel="showCropper = false">
            <div style="height: 300px;">
                <vueCropper
                    ref="cropper"
                    :img="option.img"
                    :outputSize="option.size"
                    :outputType="option.outputType"
                    :info="true"
                    :full="option.full"
                    :canMove="option.canMove"
                    :canMoveBox="option.canMoveBox"
                    :original="option.original"
                    :autoCrop="option.autoCrop"
                    :fixed="option.fixed"
                    :fixedNumber="option.fixedNumber"
                    :centerBox="option.centerBox"
                    :infoTrue="option.infoTrue"
                    :fixedBox="option.fixedBox"
                    :autoCropWidth="option.autoCropWidth"
                    :autoCropHeight="option.autoCropHeight"
                ></vueCropper>
                <div></div>
            </div>
        </Modal>
    </div>

</template>
<script>
import { VueCropper } from 'vue-cropper'
import { uploadImgBase64 } from "@/api/user";
export default {
    props:{
        // 默认显示的URL
        imgUrl:{
            type:String,
            default:""
        },
        // 剪切框高度
        heightBox:{
            type:Number,
            default:400
        },
        // 是否固定宽高不可变
        fixedBox:{
            type:Boolean,
            default:false
        },
        // 是否固定宽高比例
        fixedRatio:{
            type:Boolean,
            default:false,
        },
        // 默认剪切框比例
        cutRatio:{
            type:Array,
            default:()=>{
                return [1,1]
            }
        },
        // 剪切框默认大小
        cutSize:{
            type:Object,
            default:()=>{
                return {
                    width:50,
                    height:50
                }
            }
        },
      // 是否可编辑
      isEdit:{
        type:Boolean,
        defautl:false
      },
    },
    components:{
        VueCropper
    },
    model:{
        prop: 'imgUrl',
        event: 'change'
    },
    data(){

        return {
            option: {
                img: '', // 裁剪图片的地址
                info: true, // 裁剪框的大小信息
                outputSize: 0.8, // 裁剪生成图片的质量
                outputType: 'jpeg', // 裁剪生成图片的格式
                canScale: false, // 图片是否允许滚轮缩放
                autoCrop: true, // 是否默认生成截图框
                autoCropWidth: this.cutSize.width, // 默认生成截图框宽度
                autoCropHeight: this.cutSize.height, // 默认生成截图框高度
                fixedBox: false, // 固定截图框大小 不允许改变
                fixed: this.fixedRatio, // 是否开启截图框宽高固定比例
                fixedNumber: this.cutRatio, // 截图框的宽高比例
                full: true, // 是否输出原图比例的截图
                canMoveBox: true, // 截图框能否拖动
                original: false, // 上传图片按照原始比例渲染
                centerBox: false, // 截图框是否被限制在图片里面
                infoTrue: true // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
            },
            showCropper:false,
        }
    },
    methods:{
        resetImg(){
             this.$emit("change",'');
        },
        // 获取上传文件
        handleUpload (file) {
            this.file = file;
            this.getfile();
            return false;
        },
        // 生成剪切图片
        getfile(){
            this.option.img = "";
            const reader = new FileReader();
            reader.onload = e => {
                let data;
                if (typeof e.target.result === 'object') {
                // 把Array Buffer转化为blob 如果是base64不需要
                data = window.URL.createObjectURL(new Blob([e.target.result]));
                } else {
                data = e.target.result;
                }
                this.option.img = data;
            };
            // 转化为blob
            reader.readAsArrayBuffer(this.file);
            this.showCropper = true;
        },
        cutImg(){
            this.$refs.cropper.getCropData(async (data) => {
                let params = {
                    content:data
                }
                uploadImgBase64(params).then(result=>{
                    this.$emit("change",result);
                })
            })
        },
    }
}
</script>
<style>
.rightButton{
    text-align: right;
}
</style>
