<template>
    <Card style="width:80%">
        <p slot="title">小程序配置</p>
        <Form :model="info" :label-width="200">
 
            <FormItem label="开始时间">
                <Input v-model="info.start_time" placeholder="开始时间" style="width:400px"></Input>
            </FormItem>
            <FormItem label="结束时间">
                <Input v-model="info.end_time" placeholder="结束时间" style="width:400px"></Input>
            </FormItem>
            <FormItem label="电话">
                <Input v-model="info.mobile" placeholder="电话" style="width:400px"></Input>
            </FormItem>
                       <FormItem label="二维码">
                <upload text="图片" @on-upload="uploadImage" :defaultImag="img" style="width:300px"></upload>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="editConfig">保存</Button>
            </FormItem>
        </Form>
    </Card>
</template>
<script>
    import { upload } from "_c/custom-components"
    import { queryConfigList, editConfig } from "@/api/config.js";
    export default {
        components: {
            upload
        },
        data: () => {
            return {
                info: {
                    start_time: '',
                    end_time: '',
                    img: '',
                    mobile:"",
                },
                groupName: 'kefu',
                img: ''
            }
        },
        methods: {
            queryConfigList() {
                let data = {
                    name: this.groupName,
                };
                queryConfigList(data).then(result => {
                    this.info = result;
                    this.img = result.img;
                })
            },
            editConfig() {
                let params = {
                    ...this.info,
                    name: this.groupName
                };
                editConfig(params).then(result => {
                    this.$Message.success('编辑成功');
                    this.queryConfigList();
                })
            },
            uploadImage(url) {
                // console.log(url);
                this.info.img = url.url;
            }
        },
        created() {
            this.queryConfigList();
        }
    }
</script>