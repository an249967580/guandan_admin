<template>
    <div>
        <Card>
            <p slot="title">海选赛列表</p>
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
                                <Button type="primary" @click="team(row)"> 团队 </Button>&nbsp;&nbsp;
                                <Button type="info" @click="delInfo(row)">
                                    删除
                                </Button>
                            </template>
                            <!-- <template
                                slot="user_num"
                                slot-scope="{ row, index }"
                            >
                                <a
                                    href="javascript:;"
                                    @click="gameUser(row.id)"
                                    >{{ row.user_num }}</a
                                >
                            </template> -->
                            <template
                                slot="rank_type"
                                slot-scope="{ row, index }"
                            >
                                <div v-if="row.rank_type == 1"> 平均值</div>
                                <div v-if="row.rank_type == 2"> 总积分</div>
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
                <FormItem label="开始时间">
                    <DatePicker
                        type="date"
                        v-model="extend.start_time"
                        placeholder="开始时间"
                        style="width: 200px"
                        @on-change="changeStartTime"
                    />
                </FormItem>
                <FormItem label="结束时间">
                    <DatePicker
                        type="date"
                        v-model="extend.end_time"
                        placeholder="结束时间"
                        style="width: 200px"
                        @on-change="changeEndTime"
                    />
                </FormItem>
                 <FormItem label="每日开始时间">
                    <TimePicker  v-model="extend.start_hour" type="time" placeholder="每日开始时间" style="width: 168px" format="HH:mm" />
                </FormItem>
                <FormItem label="每日结束时间">
                    <TimePicker  v-model="extend.end_hour" type="time" placeholder="每日结束时间" style="width: 168px" format="HH:mm" />
                </FormItem>
                <FormItem label="晋级人数">
                   <Input
                        v-model="extend.up_num"
                        placeholder="晋级人数"
                        style="width: 200px"
                    ></Input>
                </FormItem>
                <FormItem label="最小对战次数">
                   <Input
                        v-model="extend.max_num"
                        placeholder="最小对战次数"
                        style="width: 200px"
                    ></Input>
                </FormItem>
                <FormItem label="排行规则">
                     <Select v-model="extend.rank_type" style="width:200px">
                        <Option value="1">平均值</Option>
                        <Option value="2">总积分</Option>
                    </Select>
                    
                </FormItem>
                <FormItem label="第一名分数">
                    <Input
                        v-model="extend.first_gold"
                        placeholder="第一名分数"
                        style="width: 200px"
                    ></Input>
                </FormItem>
                <FormItem label="第二名分数">
                    <Input
                        v-model="extend.second_gold"
                        placeholder="第二名分数"
                        style="width: 200px"
                    ></Input>
                </FormItem>
                <FormItem label="第三名分数">
                    <Input
                        v-model="extend.three_gold"
                        placeholder="第三名分数"
                        style="width: 200px"
                    ></Input>
                </FormItem>
                <FormItem label="第四名分数">
                    <Input
                        v-model="extend.four_gold"
                        placeholder="第四名分数"
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
import { queryMassList, editMatchMass, delMatch } from "@/api/match.js";

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
                    title: "比赛名称",
                    key: "game_title",
                    minWidth: 120,
                    tooltip: true,
                    align: "center",
                },
                {
                    title: "开始时间",
                    key: "start_time",
                    minWidth: 180,
                    tooltip: true,
                    align: "center",
                },
                {
                    title: "结束时间",
                    key: "end_time",
                    minWidth: 180,
                    tooltip: true,
                    align: "center",
                },
                {
                    title: "每日开始时间",
                    key: "start_hour",
                    minWidth: 100,
                    tooltip: true,
                    align: "center",
                },
                {
                    title: "每日结束时间",
                    key: "end_hour",
                    minWidth: 100,
                    tooltip: true,
                    align: "center",
                },
                {
                    title: "晋级人数",
                    key: "up_num",
             
                    minWidth: 100,
                    tooltip: true,
                    align: "center",
                },
                {
                    title: "最小对战次数",
                    key: "max_num",
                    minWidth: 100,
                    tooltip: true,
                    align: "center",
                },
                
                {
                    title: "排行规则",
                    slot: "rank_type",
                    minWidth: 80,
                    tooltip: true,
                    align: "center",
                },
                
                {
                    title: "第一名分数",
                    key: "first_gold",
                    minWidth: 100,
                    tooltip: true,
                    align: "center",
                },
                 {
                    title: "第二名分数",
                    key: "second_gold",
                    minWidth: 100,
                    tooltip: true,
                    align: "center",
                },
                 {
                    title: "第三名分数",
                    key: "three_gold",
                    minWidth: 100,
                    tooltip: true,
                    align: "center",
                },
                 {
                    title: "第四名分数",
                    key: "four_gold",
                    minWidth: 100,
                    tooltip: true,
                    align: "center",
                },
                {
                    title: "创建时间",
                    key: "create_time",
                    minWidth: 180,
                    tooltip: true,
                    align: "center",
                },
                {
                    title: "操作",
                    width: 200,
                    slot: "makeSlot",
                    fixed: 'right',
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
            queryMassList(params).then((result) => {
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
                time:"",


                max_num: "",
                // user_num: "",
                start_hour: "",
                end_hour: "",
                up_num: "",
                rank_type:'',
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

            editMatchMass(params).then((reset) => {
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
        team(row){
            this.$router.push({
                name: "team",
                params: { id: row.id},
            });
        }
    },
    created() {
        this.queryList();
    },
};
</script>

