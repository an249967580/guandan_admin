<template>
    <Card style="width:80%">
        <p slot="title">游戏配置</p>
        <Form :model="info" :label-width="200">
            <FormItem label="兑换开关（非1就是关闭）">
                <Input v-model="info.key" placeholder="KEY" style="width:400px"></Input>
            </FormItem>
             <!-- <FormItem label="CLIENTID">
                <Input v-model="info.clientid" placeholder="CLIENTID" style="width:400px"></Input>
            </FormItem> -->
            <!-- <FormItem label="SECRET">
                <Input v-model="info.secret" placeholder="SECRET" style="width:400px"></Input>
            </FormItem> -->
            <!-- <FormItem label="简介">
                <Input v-model="info.share_des" placeholder="简介" style="width:400px"></Input>
            </FormItem> -->

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
                    key: '',
                    clientid:"",
                    secret: '',
                },
                groupName: 'sdkgame',
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
                    this.img = result.share_img;
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
                this.info.share_img = url.url;
            },
        },
        created() {
            this.queryConfigList();
        }
    }
</script>