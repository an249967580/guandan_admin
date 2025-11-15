<template>
    <Card style="width:80%">
        <p slot="title">自由玩</p>
        <Form :model="info" :label-width="200" >
            <FormItem label="首游奖励积分" prop="first_gold">
                <Input v-model="info.first_gold" placeholder="首游奖励积分" style="width:400px"></Input>
            </FormItem>
            <FormItem label="二游奖励积分" prop="second_gold">
                <Input v-model="info.second_gold" placeholder="二游奖励积分" style="width:400px"></Input>
            </FormItem>
            <FormItem label="三游奖励积分" prop="three_gold">
                <Input v-model="info.three_gold" placeholder="三游奖励积分" style="width:400px"></Input>
            </FormItem>
            <FormItem label="四游奖励积分" prop="four_gold">
                <Input v-model="info.four_gold" placeholder="四游奖励积分" style="width:400px"></Input>
            </FormItem>
            <FormItem label="开放开始时间">
                <DatePicker type="datetime" placeholder="开始时间" style="width: 200px" v-model="start_time" @on-change="onChangeTime1" />
                <Alert> 开始或结束时间任意一个为空时，将不限制时间，一直开启</Alert>
            </FormItem>
            <FormItem label="开放关闭时间">
                <DatePicker type="datetime" placeholder="关闭时间" style="width: 200px" v-model="end_time" @on-change="onChangeTime2" />
                <br/>
                <br/>
                <Alert> 修改后可能会延迟一分钟后生效</Alert>
            </FormItem>
            <FormItem label="每人每天最多获得积分" prop="max_gold">
                <Input v-model="info.max_gold" placeholder="每人每天最多获得积分" style="width:400px"></Input>
            </FormItem>
            <FormItem label="默认出牌时间" prop="send_time">
                <Input v-model="info.send_time" placeholder="默认出牌时间" style="width:400px"></Input>
            </FormItem>
            <FormItem label="默认头像" prop="default_head">
                <upload text="默认头像" @on-upload="uploadImage" :defaultImag="img" style="width:300px"></upload>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="editConfig">保存</Button>
            </FormItem>
        </Form>
    </Card>   
</template>
<script>
  import { upload } from "_c/custom-components"
import { queryConfigList , editConfig } from "@/api/config.js";
    export default {
         components: {
            upload
        },
        data:()=>{
            return {
                info:{
                    first_gold:0,
                    second_gold:0,
                    three_gold:0,
                    four_gold:0,
                    max_gold:0,
                    send_time:0,
                    default_head:'',
                },
                groupName:'game',
                start_time:'',
                end_time:'',
                img:'',
            }
        },
        methods:{
            queryConfigList(){
                let data = {
                    name:this.groupName,
                };
                queryConfigList(data).then(result=>{
                    this.info = result;
                    this.start_time = result.start_time;
                    this.end_time = result.end_time;
                    this.img = result.default_head;
                })
            },
            uploadImage(url) {
                this.info.default_head = url.url;
            },
            onChangeTime1(date){
                this.start_time = date;
                this.info.start_time = date;
            },
            onChangeTime2(date){
                this.end_time = date;
                this.info.end_time = date;
            },
            editConfig(){
                let params = {
                    ...this.info,
                    name:this.groupName
                };

                if(!params.first_gold || !params.second_gold || !params.three_gold || !params.four_gold || !params.max_gold || !params.send_time){
                    this.$Message.error("积分和时间为必填信息");
                    return false;
                }
    
                if(isNaN(Number.parseInt(params.first_gold))){
                    this.$Message.error("积分为数字");
                    return false;
                }
                   if(isNaN(Number.parseInt(params.second_gold))){
                    this.$Message.error("积分为数字");
                    return false;
                }
                   if(isNaN(Number.parseInt(params.three_gold))){
                    this.$Message.error("积分为数字");
                    return false;
                }
                if(isNaN(Number.parseInt(params.four_gold))){
                    this.$Message.error("积分为数字");
                    return false;
                }
                 if(isNaN(Number.parseInt(params.max_gold))){
                    this.$Message.error("积分为数字");
                    return false;
                }
                 if(isNaN(Number.parseInt(params.send_time))){
                    this.$Message.error("时间为必填");
                    return false;
                }
                if (Number.parseInt(params.send_time) <= 10) {
                    this.$Message.error("时间不能小于11");
                    return false;
                }


                
                editConfig(params).then(result=>{
                    this.$Message.success('编辑成功');
                    this.queryConfigList();
                })
            }
        },
        created(){
            this.queryConfigList();
        }
    }
</script>