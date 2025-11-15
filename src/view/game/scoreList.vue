<template>
    <div>
        <Card>
            <p slot="title">积分排行</p>
            <div slot="extra">
                <Button type="info" @click="exportData">导出</Button>&nbsp;
                <Button type="primary" @click="addInfo">返回</Button>
            </div>
        </Card>
        <Tabs type="card" v-model="name" @on-click="changeName">
            <TabPane label="个人排名" name="1">
                <Row>
                    <Col span="24">
                        <Card>
                            <div>
                                <Table :columns="column" :data="list" ref="table"> </Table>
                            </div>
                            <!-- <Page :total="total" @on-change="changePage"></Page> -->
                        </Card>
                    </Col>
                </Row>
            </TabPane>
            <TabPane label="团队排名" name="2">
                <Row>
                    <Col span="24">
                        <Card>
                            <div>
                                <Table :columns="column2" :data="list2" ref="table2"> </Table>
                            </div>
                            <!-- <Page :total="total" @on-change="changePage2"></Page> -->
                        </Card>
                    </Col>
                </Row>
            </TabPane>
        </Tabs>
    </div>
</template>
<script>
import { scoreUserList,scoreGroupList } from "@/api/match.js";

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
                    title: "用户ID",
                    key: "user_id",
                    width: 80,
                },
                {
                    title: "用户",
                    key: "nick_name",
                },
                {
                    title: "积分",
                    key: "score",
                    width: 80,
                },
            ],
            column2: [
                {
                    title: "团队ID",
                    key: "group_id",
                    width: 80,
                },
                {
                    title: "团队名称",
                    key: "group_name",
                },
                 {
                    title: "积分",
                    key: "score",
                    width: 80,
                },
            ],
            total: 0,
            list: [],
            list2: [],
            search: {
                page: 1,
                limit: 10,
                game_id: 0,
            },
            search2: {
                page: 1,
                limit: 1000,
                game_id: 0,
            },
            name:"1",
        };
    },
    methods: {
        changePage(date) {
            this.search.page = date;
            this.queryList();
        },
        changePage2(date) {
            this.search2.page = date;
            this.queryList2();
        },
        queryList() {
            let params = {
                ...this.search,
            };
            scoreUserList(params).then((result) => {
                this.list = result.data;
                this.total = result.total;
            });
        },
        queryList2() {
            let params = {
                ...this.search,
            };
            scoreGroupList(params).then((result) => {
                this.list2 = result;
            });
        },
        addInfo() {
            this.$router.go(-1);
        },
        exportData(){
            if(this.name == 1){
                this.$refs.table.exportCsv({
                    filename: '个人排名'
                });
            }else{
                this.$refs.table2.exportCsv({
                    filename: '团队排名'
                });
            }
           
        },
        changeName(name){

        }
    },
    created() {
         let id = this.$route.params.id;
        if (id) {
            this.search.game_id = id;
            this.queryList();
            this.queryList2();
        }
    },
    mounted() {
       
    },
};
</script>

