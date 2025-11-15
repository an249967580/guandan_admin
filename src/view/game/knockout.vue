<template>
    <div>
        <Card>
            <p slot="title">淘汰赛列表</p>
            <Button type="primary" slot="extra" @click="addInfo"
                >添加赛事</Button
            >
            <Input
                v-model="search.game_title"
                placeholder="赛事名称"
                clearable
                style="width: 200px"
            />
            &nbsp;
            <Button type="primary" @click="queryList">搜索</Button>
        </Card>
        <Row>
            <Col span="24">
                <Card>
                    <div>
                        <Table :columns="column" :data="list">
                            <template
                                slot="makeSlot"
                                slot-scope="{ row, index }"
                            >
                                <!-- <Button type="primary" @click="editInfo(row)"> 修改 </Button>&nbsp;&nbsp; -->
                                <Button type="info" @click="delInfo(row)">
                                    删除
                                </Button>
                            </template>
                            <template
                                slot="user_num"
                                slot-scope="{ row, index }"
                            >
                                <a
                                    href="javascript:;"
                                    @click="gameUser(row.id)"
                                    >{{ row.user_num }}</a
                                >
                            </template>
                            <template
                                slot="up_num"
                                slot-scope="{ row, index }"
                            >
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
        <Drawer title="赛事编辑" :closable="false" v-model="isShow" width="35">
            <Form :model="extend" :label-width="100">
                <FormItem label="赛事名称">
                    <Input
                        v-model="extend.game_title"
                        placeholder="赛事名称"
                        style="width: 200px"
                    ></Input>
                </FormItem>
                <!-- <FormItem label="轮播">
                    <upload text="轮播" :defaultImag="myimg" @on-upload="onUpload" style="width:300px"></upload>
                </FormItem> -->
                <FormItem label="报名截止时间">
                    <!-- <Input v-model="extend.title" placeholder="title" style="width:200px"></Input> -->
                    <DatePicker
                        type="datetime"
                        v-model="extend.end_time"
                        placeholder="报名截止时间"
                        style="width: 200px"
                        @on-change="changeEndTime"
                    />
                </FormItem>
                <FormItem label="开始时间">
                    <DatePicker
                        type="datetime"
                        v-model="extend.start_time"
                        placeholder="开始时间"
                        style="width: 200px"
                        @on-change="changeStartTime"
                    />
                </FormItem>
                <FormItem label="最多报名人数">
                    <Input
                        v-model="extend.max_num"
                        placeholder="最多报名人数"
                        style="width: 200px"
                    ></Input>
                </FormItem>
                <!-- <FormItem label="当前报名人数">
                    <Input v-model="extend.user_num" placeholder="title" style="width:200px"></Input>
                </FormItem> -->
                <FormItem label="比赛团队">
                    <Select
                        style="width: 200px"
                        v-model="extend.group_id"
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
                </FormItem>
                <FormItem label="比赛局数">
                    <Select v-model="extend.max_game_num" style="width: 200px">
                        <Option value="3">三局两胜</Option>
                        <Option value="5">五局三胜</Option>
                    </Select>
                </FormItem>
                <FormItem label="晋级人数">
                    <Input
                        v-model="extend.up_num"
                        placeholder="晋级人数"
                        style="width: 200px"
                    ></Input>
                </FormItem>


                


                <FormItem label="出牌时间">
                    <Input
                        v-model="extend.time"
                        placeholder="出牌时间"
                        style="width: 180px"
                    ></Input>秒
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="toEdit">提交</Button>
                </FormItem>
            </Form>
        </Drawer>
    </div>
</template>
<script>
import { queryOutList, editMatch, delMatch } from "@/api/match.js";
import { queryList as queryGroupList } from "@/api/group.js";

import { upload } from "_c/custom-components";

export default {
    components: {
        upload,
    },
    data: () => {
        return {
            myimg: "",
            loading1: false,
            column: [
                {
                    title: "ID",
                    key: "id",
                    width: 80,
                },
                {
                    title: "比赛类型",
                    key: "game_title",
                    minWidth: 80,
                    tooltip: true,
                    align: "center",
                },
                {
                    title: "报名截止时间",
                    key: "end_time",
                    minWidth: 80,
                    tooltip: true,
                    align: "center",
                },
                {
                    title: "比赛开始时间",
                    key: "start_time",
                    minWidth: 80,
                    tooltip: true,
                    align: "center",
                },
                {
                    title: "游戏局数",
                    key: "max_game_num",
                    minWidth: 80,
                    tooltip: true,
                    align: "center",
                },
                {
                    title: "最大人数",
                    key: "max_num",
                    minWidth: 80,
                    tooltip: true,
                    align: "center",
                },
                {
                    title: "报名人数",
                    key: "user_num",
                    slot: "user_num",
                    minWidth: 80,
                    tooltip: true,
                    align: "center",
                },
                {
                    title: "晋级人数",
                    key: "up_num",
                    slot: "up_num",
                    minWidth: 80,
                    tooltip: true,
                    align: "center",
                },
                {
                    title: "比赛团队",
                    key: "group_name",
                    minWidth: 80,
                    tooltip: true,
                    align: "center",
                },


                {
                    title: "创建时间",
                    key: "create_time",
                    minWidth: 80,
                    tooltip: true,
                    align: "center",
                },
                {
                    title: "操作",
                    width: 100,
                    slot: "makeSlot",
                },
            ],

            total: 0,
            list: [],
            extend: {
                id: "",
                game_title: "",
                end_time: "",
                start_time: "",
                max_num: "",
                user_num: "",
                up_num: "",
                group_id: "",
                max_game_num: "",
                time:"",
            },
            isShow: false,
            groupList: [],
            search: {
                page: 1,
                limit: 10,
                game_title: "",
            },
        };
    },
    methods: {
        changeDatas(date) {
            this.extend.end_time = date;
        },
        onUpload(url) {
            this.extend.img = url.url;
        },
        changePage(page) {
            this.search.page = page;
            this.queryList();
        },
        queryList() {
            let params = {
                ...this.search,
            };
            console.log(params);
            queryOutList(params).then((result) => {
                this.list = result.data;
                this.total = result.total;
            });
        },
        addInfo() {
            (this.extend = {
                id: "",
                game_title: "",
                end_time: "",
                start_time: "",
                max_num: "",
                user_num: "",
                up_num: "",
                group_id: "",
                max_game_num: "",
                time:"",
            }),
                (this.isShow = true);
        },
        editInfo(row) {
            this.extend = {
                id: row.id,
                title: row.title,
                text: row.text,
                img: row.img,
                end_time: row.end_time,
                time:row.time
            };
            this.myimg = row.img;

            this.isShow = true;
        },
        delInfo(row) {
            this.$Modal.confirm({
                title: "是否确认删除",
                content: "<p>确认删除后将彻底删除!</p><p>确认删除点击确认</p>",
                onOk: () => {
                    let params = {
                        id: row.id,
                    };
                    delMatch(params).then((reset) => {
                        this.queryList();
                        this.$Message.info("已删除");
                    });
                },
                onCancel: () => {},
            });
        },
        toEdit() {
            let params = {
                ...this.extend,
            };

            editMatch(params).then((reset) => {
                this.queryList();
                this.isShow = false;
            });
        },
        changeEndTime(time) {
            this.extend.end_time = time;
        },
        changeStartTime(time) {
            this.extend.start_time = time;
        },
        selectGroup(query) {
            if (query !== "") {
                this.loading1 = true;
                if (query.length > 2) {
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
                }
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
                name: "upList",
                params: { id: id,top:"out" },
            });
        }
    },
    created() {
        this.queryList();
    },
};
</script>

