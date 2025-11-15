<template>
    <div>
        <Row>
            <Col span="6">
                &nbsp;
            </Col>
            <Col span="12">
                <Card>
                    <p slot="title">菜单管理</p>
                    <Button slot="extra" @click="append()" type="primary">添加顶级菜单</Button>
                    <Tree :data="data5" :render="renderContent" class="demo-tree-render"></Tree>
               </Card>
            </Col>
            <Col span="6">
                
            </Col>
        </Row>

        <Drawer
            title="编辑菜单"
            v-model="showEdit"
            width="720"
            :mask-closable="false"
        >
            <Form ref="formValidate" :model="menuInfo" :rules="ruleValidate" :label-width="120">
                <FormItem label="上级菜单" prop="titleTop">
                    <Input v-model="menuInfo.titleTop" placeholder="上级菜单" disabled ></Input>
                </FormItem>
                <FormItem label="权限名称" prop="title">
                    <Input v-model="menuInfo.title" placeholder="权限名称"></Input>
                </FormItem>
                <FormItem label="路由名称" prop="name">
                    <Input v-model="menuInfo.name" placeholder="路由名称"></Input>
                </FormItem>
                <FormItem label="是否菜单隐藏">
                    <RadioGroup v-model="menuInfo.type">
                        <Radio label="1">菜单权限</Radio>
                        <Radio label="2">按钮显示</Radio>
                        <Radio label="3">访问控制</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="是否关闭">
                    
                    <i-switch v-model="menuInfo.is_del" size="large">
                        <span slot="open">显示</span>
                        <span slot="close">关闭</span>
                    </i-switch>
                </FormItem>
                <FormItem label="组件地址" prop="component" >
                    <Input v-model="menuInfo.component" placeholder="组件地址"></Input>
                </FormItem>
                <FormItem label="菜单icon" prop="icon" v-if="menuInfo.type == 1">
                    <Input v-model="menuInfo.icon" placeholder="菜单icon"></Input>
                </FormItem>
                <FormItem label="菜单排序" prop="sort" v-if="menuInfo.type == 1">
                    <Input v-model="menuInfo.sort" placeholder="菜单排序"></Input>
                </FormItem>
            </Form>
            <div class="demo-drawer-footer">
                <Button type="primary" style="margin-right: 8px" @click="toEdit">确认</Button>
                <Button  @click="showEdit = false">取消</Button>
            </div>
        </Drawer>
    </div>
    

 

</template>
<script>
    import { editMenu, getMenuList,delMenu,getMenuInfo } from "@/api/system/role";
    export default {
        data () {
            return {
                data5: [
                    
                ],
                buttonProps: {
                    type: 'default',
                    size: 'small',
                },
                showEdit:false,
                menuInfo:{
                    id:0,
                    pid:0,
                    titleTop:'顶级菜单',
                    is_hide_menu:true,
                    is_hide_bread:true,
                    is_del:true,
                    type:"1",
                    level:1
                },
                ruleValidate:{}
            }
        },
        methods: {
            renderContent (h, { root, node, data }) {
                console.log(data);
                if(data.level <2){
                    return h('span', {
                    style: {
                        display: 'inline-block',
                        width: '100%'
                    }
                    }, [
                        h('span', [
                            h('Icon', {
                                props: {
                                    type: 'ios-paper-outline'
                                },
                                style: {
                                    marginRight: '8px'
                                }
                            }),
                            h('span', data.title)
                        ]),
                        h('span', {
                            style: {
                                display: 'inline-block',
                                float: 'right',
                                marginRight: '32px'
                            }
                        }, [
                            h('Button', {
                                props: Object.assign({}, this.buttonProps, {
                                    icon: 'ios-add'
                                }),
                                style: {
                                    marginRight: '8px'
                                },
                                on: {
                                    click: () => { this.append(data) }
                                }
                            }),
                            h('Button', {
                                props: Object.assign({}, this.buttonProps, {
                                    icon: 'md-brush'
                                }),
                                on: {
                                    click: () => { this.remove(root, node, data) }
                                }
                            })
                        ])
                    ]);
                }else{
                    return h('span', {
                    style: {
                        display: 'inline-block',
                        width: '100%'
                    }
                    }, [
                        h('span', [
                            h('Icon', {
                                props: {
                                    type: 'ios-paper-outline'
                                },
                                style: {
                                    marginRight: '8px'
                                }
                            }),
                            h('span', data.title)
                        ]),
                        h('span', {
                            style: {
                                display: 'inline-block',
                                float: 'right',
                                marginRight: '32px'
                            }
                        }, [
                          
                            h('Button', {
                                props: Object.assign({}, this.buttonProps, {
                                    icon: 'md-brush'
                                }),
                                on: {
                                    click: () => { this.remove(root, node, data) }
                                }
                            })
                        ])
                    ]);
                }
            
                
            },
            /**
             * 修改
             */
             toEdit(){
                console.log(this.menuInfo);
                let data = {
                    id:this.menuInfo.id,
                    pid:this.menuInfo.pid,
                    is_del:this.menuInfo.is_del ? 0:1,
                    title:this.menuInfo.title,
                    name:this.menuInfo.name,
                    component:this.menuInfo.component,
                    icon:this.menuInfo.icon,
                    sort:this.menuInfo.sort,
                    type:this.menuInfo.type,
                    level:this.menuInfo.level
                };
                editMenu(data).then(result=>{
                    this.$Message.success('更新成功');
                    this.showEdit = false;
                    this.queryMenuList()
                })
                // httpPost('/admin_product_cityhome/Menu/toEdit',data).then(result=>{
                //     this.$Message.success('更新成功');
                //     //执行返回
                //     backHistoryUrl();
                // })
            },

            append (data) {
                // 弹出添加页面
                this.showEdit = true;
                if(data){
                    this.menuInfo = {
                        id:0,
                        pid:data.id,
                        titleTop:data.title,
                        is_hide_menu:true,
                        is_hide_bread:true,
                        is_del:true,
                        type:"1",
                        level:data.level + 1
                    };
                }else{
                    this.menuInfo = {
                        id:0,
                        pid:0,
                        titleTop:'顶级菜单',
                        is_hide_menu:true,
                        is_hide_bread:true,
                        is_del:true,
                        type:"1",
                        level:1
                    };
                }

                // const children = data.children || [];
                // children.push({
                //     title: 'appended node',
                //     expand: true
                // });
                // this.$set(data, 'children', children);
            },
             /**
             * 查询类目详情
             * @param id
             * @param type
             */
             getMenuInfo(id,type){
                httpPost('/admin_product_cityhome/Menu/getMenuInfo',{id:id}).then(result=>{
                    if(type == 'id'){
                        const parentTitle = this.menuInfo.titleTop;
                        this.menuInfo = result;
                        this.menuInfo.titleTop = parentTitle;
                        this.menuInfo.is_hide_menu = this.menuInfo.is_hide_menu == 1 ? false:true;
                        this.menuInfo.is_hide_bread = this.menuInfo.is_hide_bread == 1 ? true:false;
                        this.menuInfo.is_del = this.menuInfo.is_del == 1 ? false:true;
                        this.menuInfo.type = this.menuInfo.type+'';
                        console.log(this.menuInfo);
                    }else{
                        if(result){
                            this.menuInfo.pid = result.id;
                            this.menuInfo.titleTop = result.title;
                        }
                    }
                })
            },
            remove (root, node, data) {
                getMenuInfo({id:data.id}).then(result=>{
                    result.is_del = result.is_del == 1 ? false:true;
                    this.menuInfo = result;
                    this.showEdit = true;
                })
                // const parentKey = root.find(el => el === node).parent;
                // const parent = root.find(el => el.nodeKey === parentKey).node;
                // const index = parent.children.indexOf(data);
                // parent.children.splice(index, 1);
            },

            queryMenuList(){
                getMenuList({}).then(result=>{
                    let menuList = result.tree;
                    // 更新列表
                    let data = this.makeData(menuList);
                    this.data5 = data;
                })
            },

            makeData(list){
                let data = [];
                for (let index = 0; index < list.length; index++) {
                    const element = list[index];
                    if(element.children){
                        let child = this.makeData(element.children);
                        let item = {
                            id:element.id,
                            pid:element.pid,
                            title:element.meta.title,
                            children:child,
                            level:element.level
                        }
                        data.push(item)
                    }else{
                        let item = {
                            id:element.id,
                            pid:element.pid,
                            title:element.meta.title,
                            level:element.level
                        }
                        data.push(item)
                    }
                }
                return data;
            }
        },
        created(){
            // 查询菜单
            this.queryMenuList();
        }
    }
</script>
<style>
    .demo-tree-render .ivu-tree-title{
        width: 100%;
    }
    .demo-drawer-footer{
        width: 100%;
        position: absolute;
        bottom: 0;
        left: 0;
        border-top: 1px solid #e8e8e8;
        padding: 10px 16px;
        text-align: right;
        background: #fff;
    }
</style>
