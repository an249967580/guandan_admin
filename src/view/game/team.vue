<template>
    <div>
        <Card>
            <p slot="title">参与团队</p>
            <div slot="extra">
                <Button type="primary" @click="addInfo">添加</Button>&nbsp;
                <Button type="info" @click="backInfo">返回</Button>
            </div>
        </Card>
        <Row>
            <Col span="24">
                <Card>
                    <div>
                        <Table :columns="column" :data="list">
                            <template slot="makeSlot" slot-scope="{ row, index }">
                                  <Button type="info" @click="delInfo(row)">
                                    删除
                                </Button>
                            </template>
                            <template slot="user_num" slot-scope="{ row, index }">
                                <a
                                    href="javascript:;"
                            
                                    >{{ row.user_num }}</a
                                >
                            </template>
                            <template slot="up_num" slot-scope="{ row, index }">
                                <a
                                    href="javascript:;"
                                    @click="upList(row.id)"
                                    >{{ row.up_num }}</a
                                >
                            </template>
                        </Table>
                    </div>
                    <Page :total="total" @on-change="changePage"></Page>
                </Card>
            </Col>
        </Row>
        <Modal v-model="isShow" title="团队" @on-ok="toEdit" @on-cancel="isShow = false">
            选择团队：
            <Select
                style="width: 200px"
                v-model="info.group_id"
                filterable
                :remote-method="selectGroup"
                :loading="loading1"
            >
                <Option
                    v-for="(option, index) in groupList"
                    :value="option.id"
                    :key="index"
                    >{{ option.label }}</Option
                >
            </Select>
        </Modal>
    </div>
</template>
<script>
import { queryMassGroup, addMassGroup,delMassGroup } from "@/api/match.js";
import { queryList as queryGroupList } from "@/api/group.js";
export default {
    data: () => {
        return {
            loading1: false,
            column: [
                {
                    title: "ID",
                    key: "id",
                    width: 80,
                },
                {
                    title: "团队ID",
                    key: "group_id",
                    width: 80,
                },
                {
                    title: "团队",
                    key: "group_name",
                },
                // {
                //     title: "参与人数",
                //     slot: "user_num",
                // },
                {
                    title: "参与人数",
                    slot: "up_num",
                },
                {
                    title: "操作",
                    slot:"makeSlot",
                },
            ],
            total: 0,
            list: [],
            search: {
                page: 1,
                limit: 10,
                game_id: 0,
            },
            info: {},
            isShow: false,
            groupList:[],
        };
    },
    methods: {
        changePage(date) {
            this.search.page = date;
            this.queryList();
        },
        queryList() {
            let params = {
                ...this.search,
            };
            queryMassGroup(params).then((result) => {
                this.list = result.data;
                this.total = result.total;
            });
        },
        addInfo() {
            this.info = {
                game_id: this.search.game_id,
                group_id: 0,
            };
            this.isShow = true;
        },
        backInfo() {
             this.$router.push({
                name: "mass",
            });
        },
        toEdit(){
            addMassGroup({...this.info}).then(result=>{
                this.queryList();
                this.$Message.success("成功")
            })
        },
        delInfo(row){
            this.$Modal.confirm({
                title: "是否确认删除",
                content: "<p>确认删除后将彻底删除!</p><p>确认删除点击确认</p>",
                onOk: () => {
                    let params = {
                        id: row.id,
                    };
                    delMassGroup(params).then((reset) => {
                        this.queryList();
                        this.$Message.info("已删除");
                    });
                },
                onCancel: () => {},
            });
        },
        selectGroup(query) {
            if (query !== "") {
                this.loading1 = true;
                
                    queryGroupList({
                        group_name: query,
                        page: 1,
                        limit: 50,
                    }).then((result) => {
                        this.loading1 = false;
                        this.groupList = [];
                        console.log(result);
                        for (
                            let index = 0;
                            index < result.data.length;
                            index++
                        ) {
                            const element = result.data[index];
                            this.groupList.push({
                                id: element.group_id,
                                label: element.group_name,
                            });
                        }
                    });
                
            } else {
                this.groupList = [];
            }
        },
        gameUser(id) {
            this.$router.push({
                name: "game_user",
                params: { id: id },
            });
        },
        upList(id){
            this.$router.push({
                name: "massUpList",
                params: { id: id,game_id:this.search.game_id },
            });
        }
    },
    created() {
        let id = this.$route.params.id;
        if (id) {
            this.search.game_id = id;
            this.queryList();
        }
    },
    mounted() {},
};
</script>

