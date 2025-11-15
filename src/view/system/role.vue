<template>
   <Card>
        <p slot="title">管理列表</p>
        <Button slot="extra" @click="addRole" type="primary">添加角色</Button>
        <Table :columns="columns" :data="list" border>
            <template slot-scope="{ row , index}" slot="memberSlot" >
                <i-button type="primary" size="small" @click="editRole(row)">编辑信息</i-button>
                <i-button type="primary" size="small" @click="editRoleRule(row)" style="margin-left:10px;">规则管理</i-button>
            </template>
        </Table>
        <br>
        <Page :total="searchData.total"></Page>
        <Drawer title="添加管理" :closable="false"  width="40" v-model="showAdd">
            <Form ref="formValidate" :model="roleInfo"  :rules="ruleInline"  :label-width="100">
                <FormItem label="角色名称" prop="role_name">
                    <Input v-model="roleInfo.role_name" placeholder="角色名称"></Input>
                </FormItem>
                <FormItem label="角色状态" prop="role_name">
                    <i-switch v-model="roleInfo.del_status">
                        <span slot="open">开</span>
                        <span slot="close">关</span>
                    </i-switch>
                </FormItem>
                
                <FormItem>
                    <Button type="primary" @click="toEidt">提交</Button>
                </FormItem>
            </Form>
        </Drawer>
        <rule ref="ruleRef"></rule>
   </Card>
</template>

<script>
import { queryRoleList , editRoleInfo ,addRoleInfo } from "@/api/system/role";
import rule from "./rule";
export default {
    data(){
        return {
            // 列表
           columns:[
               {
                   title:'ID',
                   key:'id',
                   minWidth:50,
                   maxWidth:100,
               },
               {
                   title:'角色名称',
                   key:'role_name',
                   minWidth:100,
               },
               {
                   title:'管理',
                   key:'make',
                   slot:'memberSlot',
                   minWidth:100,
               },
           ],
           // 数据
           list:[],
           searchData:{
               page:1,
               limit:10,
               total:0,
           },
           showAdd:false,
           // 管理信息
           roleInfo:{
               id:0,
               role_name:0,
               del_status:0,
           },
           ruleInline:{
                role_name: [
                    { required: true, message: '名称', trigger: 'blur' }
                ],
           },
        }
    },
    components:{
        rule
    },
    methods:{
       /**
        * 查询自己管理角色
        */
       queryRoleList(){
           const param = {
                ...this.searchData
           };
           queryRoleList(param).then(result=>{
               this.list = result.data;
           })
       },
       getRoleName(id){
           for (let index = 0; index < this.roleList.length; index++) {
               const role = this.roleList[index];
               if(role.id == id){
                   return role.role_name;
               }
               
           }
       },
       /**
        * 添加角色
        */
       addRole(){
           this.showAdd = true;
           this.roleInfo = {
               id:0,
               role_name:'',
               del_status:true
           }
       },
       /**
        * 修改角色
        */
       editRole(row){
           this.showAdd = true;
             this.roleInfo = {
               id:row.id,
               role_name:row.role_name,
               del_status:row.del_status == 1 ? false:true,
           }
       },
       /**
        * 去编辑
        */
       toEidt(){
            let params = {
                ...this.roleInfo
            }
            params.del_status = params.del_status ? 0 : 1;
            // 修改
            if(params.id){
                editRoleInfo(params).then(result=>{
                    this.$Message.success('编辑成功');
                    this.showAdd = false;
                    this.queryRoleList();
                })
            }else {
                // 添加
                addRoleInfo(params).then(result=>{
                    this.$Message.success('编辑成功');
                    this.showAdd = false;
                    this.queryRoleList();
                })
            } 
       },
       /**
        * 规则编辑
        */
       editRoleRule(row){
            this.$refs.ruleRef.showRules(row.id);
       }
    },
    created(){
        // 查询自己管理员
        this.queryRoleList();
       
    }
}
</script>

<style>

</style>
