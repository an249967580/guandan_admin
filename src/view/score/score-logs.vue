<template>
    <div>
        <Card>
            <p slot="title">用户积分流水</p>

            <Input v-model="search.user_id" placeholder="用户ID" clearable style="width: 200px" />
            <DatePicker type="date" v-model="search.create_time" placeholder="选择日期"
                style="width: 160px; margin-left: 8px" @on-change="onDateChange" />
            <!-- <DatePicker type="date" v-model="search.create_time" placeholder="选择日期" style="width: 160px; margin-left: 8px" /> -->
            &nbsp;
            <Button type="primary" @click="onSearch">搜索</Button>
            &nbsp;
            <Alert type="success" show-icon style="margin-top: 20px;">
                今日累计积分：
                <b style="color:#ff4d4f;">{{ todayTotalScore }}</b>
                &nbsp;&nbsp;
                今日兑换积分：
                <b style="color:#E6A23C;">{{ todayExchangeScore }}</b>
                &nbsp;&nbsp;
                今日观看视频积分：
                <b style="color:#409EFF;">{{ todayVideoScore }}</b>
                &nbsp;&nbsp;
                今日签到积分：
                <b style="color:#67C23A;">{{ todaySignScore }}</b>
            </Alert>
        </Card>

        <Row>
            <Col span="24">
            <Card>
                <Table :columns="columns" :data="formattedList" border>
                    <!-- 变动类型 -->
                    <template #typeSlot="{ row }">
                        <Tag :color="row.score_type == 1 ? 'success' : 'error'">
                            {{ row.score_type == 1 ? "增加" : "减少" }}
                        </Tag>
                    </template>

                    <!-- 变动原因 -->
                    <template #reasonSlot="{ row }">
                        <span>{{ reasonText(row.game_type) }}</span>
                    </template>

                    <!-- 当前积分 -->
                    <template #scoreSlot="{ row }">
                        <span>{{ row.score }}</span>
                    </template>

                    <!-- 变动积分（带颜色） -->
                    <template #editSlot="{ row }">
                        <span :style="{
                            color: row.score_type == 1 ? 'green' : 'red',
                            fontWeight: 'bold',
                        }">
                            {{ row.score_type == 1 ? '+' : '-' }}{{ row.edit_score }}
                        </span>
                    </template>
                </Table>

                <div class="mt-10 text-center">
                    <Page :total="total" :current="search.page" :page-size="search.limit" @on-change="changePage"
                        show-elevator />
                </div>
            </Card>
            </Col>
        </Row>
    </div>
</template>

<script>
import { queryScoreList } from "@/api/score.js";

export default {
    data() {
        return {
            list: [],
            total: 0,
            search: {
                user_id: "",
                create_time: '',
                page: 1,
                limit: 10,
            },
            todayTotalScore: 0,
            todayExchangeScore: 0,
            todayVideoScore: 0,
            todaySignScore: 0,
            countJobId: 0,   // 当前统计任务的序号
            isCounting: false, // 是否在统计中（可用于UI提示，非必需）
            columns: [
                { title: "记录ID", key: "id", width: 80 },
                { title: "用户ID", key: "user_id", width: 120 },
                {
                    title: "当前积分",
                    key: "score",
                    slot: "scoreSlot",
                    width: 120,
                },
                {
                    title: "变动类型",
                    key: "score_type",
                    slot: "typeSlot",
                    width: 100,
                },
                {
                    title: "变动积分",
                    key: "edit_score",
                    slot: "editSlot",
                    width: 120,
                },
                {
                    title: "变动原因",
                    key: "game_type",
                    slot: "reasonSlot",
                },
                { title: "时间", key: "create_time", width: 180 },
            ],
        };
    },

    created() {
        this.queryList();
        this.countTodayScore(); // ✅ 新增调用
    },

    computed: {
        // ✅ 格式化积分（/100 保留 1 位）
        formattedList() {
            return this.list.map((item) => {
                const score = (item.score / 100).toFixed(1);
                const edit_score = (item.edit_score / 100).toFixed(1);
                return { ...item, score, edit_score };
            });
        },
    },

    methods: {
        cancelCount() {
            this.countJobId++;   // 递增任务号 -> 让旧任务失效
            this.isCounting = false;
        },
        onSearch() {
            this.cancelCount();      // 立刻中断旧统计
            this.queryList(true);    // 你的原逻辑
            this.countTodayScore();  // 重新开始新统计
        },
        // ✅ 日期变化时自动刷新
        onDateChange(date) {
            if (date) {
                this.search.create_time = new Date(date).toISOString().slice(0, 10);
                this.cancelCount();
                this.queryList(true);
                this.countTodayScore(); // 同步刷新统计
            }
        },
        // ✅ 统计当日积分信息
        async countTodayScore() {
            try {
                const date =
                    this.search.create_time && this.search.create_time.trim() !== ""
                        ? this.search.create_time
                        : new Date().toISOString().slice(0, 10); // "2025-11-03"
                const params = {
                    page: 1,
                    limit: 10,
                    // ...this.search,
                    // page: 1,
                    create_time: date, // 强制设为当天
                };
                console.log("📤 请求统计参数：", params);

                const res = await queryScoreList(params);

                if (!res) {
                    this.$Message.error("接口无返回结果");
                    return;
                }

                console.log("📥 服务器返回：", res);

                // ✅ 兼容两种返回格式
                const data = res || {};
                // 后端直接返回的统计字段（单位：分）
                const total = Number(data.video_score +  data.sign_score|| 0);
                const exchange = Number(data.exchange_score || 0);
                const video = Number(data.video_score || 0);
                const sign = Number(data.sign_score || 0);

                // ✅ 转换成元并更新 UI
                this.todayTotalScore = (total / 100).toFixed(1);
                this.todayExchangeScore = (exchange / 100).toFixed(1);
                this.todayVideoScore = (video / 100).toFixed(1);
                this.todaySignScore = (sign / 100).toFixed(1);

                console.log("✅ 使用服务器统计：", {
                    total: this.todayTotalScore,
                    exchange: this.todayExchangeScore,
                    video: this.todayVideoScore,
                    sign: this.todaySignScore,
                });
            } catch (err) {
                console.error("❌ 获取服务器统计失败:", err);
                this.$Message.error("获取今日积分统计失败");
            }
        },
        // ✅ 映射“变动原因”
        reasonText(type) {
            const map = {
                1: "自由玩",
                2: "积分赛",
                3: "观看视频",
                4: "观看视频邀请人奖励",
                5: "兑换",
                6: "兑换失败退回",
                7: "签到",
                8: "扣除积分获得道具",
                9: "通关奖励"
            };
            return map[type] || "-";
        },

        // ✅ 分页
        changePage(page) {
            this.search.page = page;
            this.queryList();
        },

        // ✅ 查询积分流水
        queryList(isSearch = false) {
            if (isSearch) {
                this.search.page = 1; // ✅ 搜索模式下重置页码
            }
            const hasuser_dateSearch = this.search.create_time !== -1;
            const params = { ...this.search };
            console.log("📤 请求参数：", params);

            queryScoreList(params)
                .then((res) => {
                    console.log("📥 返回数据：", res);

                    if (res) {
                        const data = res.data || {};
                        this.list = data.list || data || [];
                        this.total = data.total || res.total || 0;
                    } else {
                        this.$Message.error(res.msg || "获取积分流水失败");
                    }
                })
                .catch((err) => {
                    console.error("❌ 请求错误：", err);
                    this.$Message.error("请求失败");
                });
        },
    },
};
</script>

<style scoped>
.mt-10 {
    margin-top: 10px;
}

.text-center {
    text-align: center;
}
</style>
