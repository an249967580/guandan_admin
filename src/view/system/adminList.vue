<template>
   <Card>
        <p slot="title">管理列表</p>
        <Button slot="extra" @click="addAdmin" type="primary">添加管理</Button>
        <Table :columns="columns" :data="list" border>
            <template slot-scope="{ row , index}" slot="memberSlot" >
                <i-button type="primary" size="small" @click="editAdmin(row)">编辑</i-button>
            </template>
        </Table>
        <br>
        <Page :total="searchData.total"></Page>
        <Drawer title="添加管理" :closable="false"  width="40" v-model="showAdd">
            <Form ref="formValidate" :model="adminInfo"  :rules="ruleInline"  :label-width="100">
                <FormItem label="管理名称" prop="name">
                    <Input v-model="adminInfo.name" placeholder="管理员名称"></Input>
                </FormItem>
                <FormItem label="联系方式" prop="mobile">
                    <Input v-model="adminInfo.mobile" placeholder="手机号"></Input>
                </FormItem>
                <FormItem label="密码" prop="password">
                    <Input v-model="adminInfo.password" placeholder="登录密码"></Input>
                </FormItem>
                <FormItem label="角色" prop="role_id">
                     <Select v-model="adminInfo.role_id" placeholder="角色">
                        <Option v-for="item in roleList"  :value="item.id" :key="item.id">{{item.role_name}}</Option>
                    </Select>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="addAllianceAdmin()">提交</Button>
                </FormItem>
            </Form>
        </Drawer>
   </Card>
    
</template>

<script>
import { getAdminList , addAdmin } from "@/api/system/admin";
import { queryRoleList } from "@/api/system/role";
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
                   title:'名称',
                   key:'name',
                   minWidth:100,
               },
               {
                   title:'电话',
                   key:'mobile',
                   minWidth:100,
               },
               {
                   title:'角色',
                   key:'role',
                   minWidth:100,
                   render:(h,par)=>{
                       const roleId = par.row.role_id;
                       const text = this.getRoleName(roleId);
                       return h("div",text);
                   }
               },
               {
                   title:'角色管理',
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
           adminInfo:{
               pid:0,
               aid:0,
               name:'',
               password:'',
               role_id:'0',
           },
           ruleInline:{
                name: [
                    { required: true, message: '名称', trigger: 'blur' }
                ],
                mobile: [
                    { required: true, message: '联系方式（登录账户）', trigger: 'blur' },
                ]
           },
           // 角色列表
           roleList:[],
        }
    },
    methods:{
        /**
         * 查询管理员信息
         */
       getAdminList(){
           const data = {
               ...this.searchData
           };
           getAdminList(data).then(result=>{
               this.searchData.total = result.total;
               this.list = result.data;
           })
       },
       /**
        * 添加管理
        */
       addAdmin(){
           this.showAdd = true;
           this.adminInfo = {
               pid:0,
               aid:0,
               name:'',
               password:'',
               role_id:'0',
           }
       },
       /**
        * 编辑管理
        */
       editAdmin(row){
           this.showAdd = true;
           this.adminInfo = {
               id:row.id,
               name:row.name,
               role_id:row.role_id,
               mobile:row.mobile
           }
       },
       /**
        * 编辑管理
        */
       addAllianceAdmin(){
           addAdmin(this.adminInfo).then(result=>{
               this.$Message.success("添加成功");
                this.showAdd = false;
               this.getAdminList();
           })
       },
       /**
        * 查询自己管理角色
        */
       queryRoleList(){
           const param = {
                page:1,
                limit:100
           };
           queryRoleList(param).then(result=>{
               this.roleList = result.data;
           })
       },
       getRoleName(id){
           for (let index = 0; index < this.roleList.length; index++) {
               const role = this.roleList[index];
               if(role.id == id){
                   return role.role_name;
               }
               
           }
       }
       
    },
    created(){
         // 查询自己管理
        this.queryRoleList();
        // 查询自己管理员
        this.getAdminList();
       
    }
}
</script>

<style>

</style>