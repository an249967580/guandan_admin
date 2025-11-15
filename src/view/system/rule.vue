<template>
    <Drawer title="权限分配" :closable="false"  width="40" v-model="isShowRule">
        <Tree :data="treeMenu" show-checkbox ref="tree"></Tree>
        <div class="demo-drawer-footer">
            <Button style="margin-right: 8px" @click="isShowRule = false">取消</Button>
            <Button type="primary" @click="editRule">提交</Button>
        </div>
    </Drawer>
</template>
<script>
import { getMenuListByUserRole , getMenuByRoleID , editRoleMenu } from "@/api/system/role";
export default {
    data(){
        return {
            treeMenu:[],
            isShowRule:false,
            roleId:0,
            menuList:[],
            /**
             * 工人原有的菜单id
             */
            roleMenuIds:[],
        }
    },
    methods:{
        /**
         * 查询所有路由
         */
        queryMenuList(){
            getMenuListByUserRole({}).then(result=>{
                this.menuList = result.tree;
            })
        },
        getMenu(result,nameList){
            let list = [];
            for (let index = 0; index < result.length; index++) {
                const item = result[index];
                let isOpen = nameList.includes(item.id);
                let data = {
                    id:item.id,
                    pid:item.pid,
                    title:item.meta.title,
                    expand:true,
                    checked:isOpen,
                };
                if(item.children && item.children.length > 0){
                    let child = this.getMenu(item.children,nameList)
                    data.children = child;
                    data.checked = false;
                }
                list.push(data);
            }
            return list;

        },
        /**
         * 获取权限的ID
         */
        getMenuName(result){
            let list = [];
            for (let index = 0; index < result.length; index++) {
                const item = result[index];
                list.push(item.id);
                if(item.children && item.children.length > 0){
                    let child = this.getMenuName(item.children)
                    list = list.concat(child);
                }
            }
            return list;
        },
        queryRoleMenuList(){
            getMenuByRoleID({roleId:this.roleId}).then(result=>{
                // 获取拥有的所有的权限名称
                let names = this.getMenuName(result);
                this.roleMenuIds = names;
                // 循环展示信息形成树状图
                let menu = this.getMenu(this.menuList,names);
                this.treeMenu = menu;
                this.isShowRule = true;
            })
        },
        /**
         * 显示
         */
        showRules(roleId){
            this.roleId = roleId;
            this.queryRoleMenuList();
        },
        /**
         * 修改规则
         */
        editRule(){
            const list = this.$refs.tree.getCheckedAndIndeterminateNodes();
            // 现有的菜单id
            let ids = [];
            for (let index = 0; index < list.length; index++) {
                const item = list[index];
                ids.push(item.id);
            }
            const params = {
                roleId:this.roleId,
                oldIds:this.roleMenuIds,
                newIds:ids
            };

            editRoleMenu(params).then(result=>{
                // this.getMenuByRoleID(this.roleId);
                this.$Message.success('修改成功');
                this.isShowRule = false;
            })

        }
    },
    created(){
        this.queryMenuList();
    }
}
</script>
<style scoped>
 .demo-drawer-footer{
    width: 100%;
    position: absolute;
    left: 0;
    border-top: 1px solid #e8e8e8;
    padding: 10px 16px;
    text-align: right;
    background: #fff;
}
</style>
