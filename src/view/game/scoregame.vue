<template>
    <div>
        <Card>
            <p slot="title">积分赛列表</p>
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
                             <a @click="showScore(row.id)" style="color:blue;margin-right:10px" href="javascript:;">排行</a><a @click="delInfo(row)" style="color:red" href="javascript:;">删除</a>
                                <!-- <Button type="primary" @click="showScore(row.id)"> 排行 </Button>
                                <Button type="info" @click="delInfo(row)">
                                    删除
                                </Button> -->
                            </template>
                            <template
                                slot="game_type"
                                slot-scope="{ row, index }"
                            >
                                <span v-if="row.game_type == 1">自由报名</span>
                                <span v-else>
                                    <div v-for="item in row.game_list" :key="item.id" style="color:green">{{item.game_title}}</div>
                                </span>
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
                        </Table>
                    </div>
                    <Page :total="total" @on-change="changePage"></Page>
                </Card>
            </Col>
        </Row>
        <Drawer title="赛事编辑" :closable="false" v-model="isShow" width="40">
            <Form :model="extend" :label-width="100">
                <FormItem label="赛事名称">
                    <Input
                        v-model="extend.game_title"
                        placeholder="赛事名称"
                        style="width: 200px"
                    ></Input>
                </FormItem>
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
                <FormItem label="游戏时长">
                    <Input
                        v-model="extend.game_time"
                        placeholder="游戏时长"
                        style="width: 200px"
                    ></Input
                    >分钟
                </FormItem>
                <FormItem label="头游积分">
                    <Input
                        v-model="extend.first_score"
                        placeholder="头游积分"
                        style="width: 200px"
                    ></Input>
                </FormItem>
                <FormItem label="二游积分">
                    <Input
                        v-model="extend.second_score"
                        placeholder="二游积分"
                        style="width: 200px"
                    ></Input>
                </FormItem>
                <FormItem label="三游积分">
                    <Input
                        v-model="extend.three_score"
                        placeholder="三游积分"
                        style="width: 200px"
                    ></Input>
                </FormItem>
                <FormItem label="末游积分">
                    <Input
                        v-model="extend.four_score"
                        placeholder="末游积分"
                        style="width: 200px"
                    ></Input>
                </FormItem>
                <FormItem label="轮空积分">
                    <Input
                        v-model="extend.null_score"
                        placeholder="轮空积分"
                        style="width: 200px"
                    ></Input>
                </FormItem>
                <FormItem label="报名类型">
                    <Select v-model="extend.game_type" style="width: 200px">
                        <Option value="1">自由报名</Option>
                        <Option value="2">淘汰后积分赛</Option>
                    </Select>
                </FormItem>
                <FormItem label="选择淘汰赛" v-if="extend.game_type == 2">
                    <Tag
                        color="primary"
                        v-for="(item, index) in gameList"
                        :key="index"
                        >{{ item.game_title }}</Tag
                    >
                    <br />
                    <Button @click="showOutGame" type="info">重新选择</Button>
                </FormItem>
                  <FormItem label="出牌时间">
                    <Input
                        v-model="extend.time"
                        placeholder="出牌时间"
                        style="width: 180px"
                    ></Input>秒
                </FormItem>
                <FormItem>
                   
                    <Button type="primary" @click="toEdit">提交</Button>&nbsp;
                    <Button @click="isShow = false">取消</Button>
                </FormItem>
            </Form>
        </Drawer>
        <Drawer title="选择赛事" :closable="false" v-model="showOut" width="40">
            <Input
                v-model="searchout.game_title"
                placeholder="赛事名称"
                clearable
                style="width: 200px"
            />
            &nbsp;
            <Button type="primary" @click="queryList">搜索</Button>
            <br />
            <br />
            <Table
                :columns="outcolumn"
                :data="outlist"
                @on-selection-change="changeSelection"
            >
            </Table>
            <br />
            <Page :total="outtotal" @on-change="changePageOut"></Page>
            <br />
            <Button type="primary" @click="showOut = false">提交</Button>&nbsp;
        </Drawer>
    </div>
</template>
<script>
import {
    queryScoreList,
    queryOutList,
    editMatchScore,
    delMatch,
} from "@/api/match.js";
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
                    minWidth: 80,
                    tooltip: true,
                    align: "center",
                },
                {
                    title: "比赛名称",
                    key: "game_title",
                    minWidth: 80,
                    tooltip: true,
                    align: "center",
                },
                {
                    title: "报名截止时间",
                    key: "end_time",
                    minWidth: 100,
                    tooltip: true,
                    align: "center",
                },
                {
                    title: "比赛开始时间",
                    key: "start_time",
                    minWidth: 100,
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
                    slot:"user_num",
                    minWidth: 80,
                    tooltip: true,
                    align: "center",
                },
                {
                    title: "游戏时长",
                    key: "game_time",
                    minWidth: 80,
                    tooltip: true,
                    align: "center",
                },
                {
                    title: "头游",
                    key: "first_score",
                    minWidth: 50,
                    tooltip: true,
                    align: "center",
                },
                {
                    title: "二游",
                    key: "second_score",
                    minWidth: 50,
                    tooltip: true,
                    align: "center",
                },
                {
                    title: "三游",
                    key: "three_score",
                    minWidth: 50,
                    tooltip: true,
                    align: "center",
                },
                {
                    title: "末游",
                    key: "four_score",
                    minWidth: 50,
                    tooltip: true,
                    align: "center",
                },
                {
                    title: "轮空",
                    key: "null_score",
                    minWidth: 50,
                    tooltip: true,
                    align: "center",
                },
                {
                    title: "比赛",
                    key: "game_type",
                    slot: "game_type",
                    minWidth: 100,
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
                    width: 120,
                    slot: "makeSlot",
                },
            ],

            total: 0,
            outtotal: 0,
            list: [],
            extend: {
                id: "",
                game_title: "",
                end_time: "",
                start_time: "",
                max_num: "",
                game_time: "",
                time:"",
                first_score: "",
                second_score: "",
                three_score: "",
                four_score: "",
                null_score: "",
                game_type: "",
                game_list: "",
            },
            isShow: false,
            groupList: [],
            search: {
                page: 1,
                limit: 10,
                game_title: "",
            },
            searchout: {
                page: 1,
                limit: 10,
                game_title: "",
            },
            showOut: false,

            outlist: [],
            outcolumn: [
                {
                    type: "selection",
                    width: 60,
                    align: "center",
                },
                {
                    title: "ID",
                    key: "id",
                    minWidth: 80,
                    tooltip: true,
                    align: "center",
                },
                {
                    title: "比赛名称",
                    key: "game_title",
                    minWidth: 80,
                    tooltip: true,
                    align: "center",
                },
                {
                    title: "晋级人数",
                    key: "up_num",
                    width: 100,
                },
                {
                    title: "比赛团队",
                    key: "group_name",
                    width: 400,
                },
            ],
            gameList: [],
        };
    },
    methods: {
        changeSelection(game_list) {
            console.log(game_list);
            let list = [];
            let ids = [];
            for (let index = 0; index < game_list.length; index++) {
                const element = game_list[index];
                list.push({ id: element.id, game_title: element.game_title });
                ids.push(element.id);
            }
            this.gameList = list;
            this.extend.game_list = ids.join(",");
        },
        changeDatas(date) {
            this.extend.end_time = date;
        },
        changePage(page) {
            this.search.page = page;
            this.queryList();
        },
        changePageOut(page) {
            this.searchout.page = page;
            this.queryOutGameList();
        },
        onUpload(url) {
            this.extend.img = url.url;
        },
        queryList() {
            let params = {
                ...this.search,
            };
            console.log(params);
            queryScoreList(params).then((result) => {
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
                game_time: "",
                first_score: "",
                second_score: "",
                three_score: "",
                four_score: "",
                null_score: "",
                game_type: "",
                game_list: "",
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

            editMatchScore(params).then((reset) => {
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
        showOutGame() {
            this.showOut = true;
            this.queryOutGameList();
        },
        queryOutGameList() {
            queryOutList({ ...this.searchout }).then((result) => {
                this.outlist = result.data;
                this.outtotal = result.total;
            });
        },
        gameUser(id){
            this.$router.push({
                name: "game_user",
                params: { id: id },
            });
        },
        showScore(id){
            this.$router.push({
                name: "scoreList",
                params: { id: id },
            });
        }
    },
    created() {
        this.queryList();
    },
};
</script>

