<template>
    <div>
        <Card>
            <p slot="title">合伙人列表</p>

            <Input v-model="search.user_id" placeholder="用户id" clearable style="width: 200px" />
            &nbsp;
            <Button type="primary" @click="queryPartnerList(true)">搜索</Button>
            <!-- <Button type="primary" slot="extra" @click="addInfo">发布</Button> -->
        </Card>
        <Row>
            <Col span="24">
            <Card>
                <div>
                    <Table :columns="column" :data="formattedList">
                        <!-- <template slot="makeSlot" slot-scope="{ row , index}">
                                <Button type="primary" @click="editInfo(row)"> 修改 </Button>&nbsp;&nbsp;
                                <Button type="info" @click="delInfo(row)"> 删除 </Button>
                            </template> -->
                        <template #scoreSlot="{ row }">
                            <span>{{ row.gold }}</span>
                        </template>
                    </Table>
                </div>
                <Page :total="total" @on-change="changePage" show-elevator></Page>
            </Card>

            </Col>
        </Row>
    </div>

</template>
<script>
import { queryPartnerList } from "@/api/group.js";
export default {
    data: () => {
        return {
            list: [],
            total: 0,
            search: {
                user_id: '',
                page: 1,
                limit: 10,
            },
            column: [
                {
                    title: '用户ID',
                    key: 'user_id',
                },
                {
                    title: "昵称",
                    key: 'name'
                },
                {
                    title: "今日邀请数量",
                    key: 'today_invited_count'
                },
                {
                    title: "当前积分",
                    slot: 'scoreSlot',
                    key: 'gold'
                },
                {
                    title: "总邀请数量",
                    key: 'invited_count'
                },
                {
                    title: "最后登录时间",
                    key: 'last_time'
                },
                {
                    title: "注册时间",
                    key: 'create_time'
                },
            ],
            isShow: false,
        }
    },
    methods: {
        changePage(page) {
            this.search.page = page;
            this.queryPartnerList();
        },
        async queryPartnerList(isSearch = false) {
            if (isSearch) this.search.page = 1; // ✅ 搜索重置页码

            const hasUserId = this.search.user_id && this.search.user_id.trim() !== "";

            // ✅ 如果输入了 user_id，就前端筛选（拉全量数据）
            const params = {
                ...this.search,
                page: hasUserId ? 1 : this.search.page,
                limit: hasUserId ? 99999 : this.search.limit, // 拉大一点，保证能全量查
            };

            const result = await queryPartnerList(params);
            let data = result.data || [];

            // ✅ 如果输入了 user_id，则前端过滤
            if (hasUserId) {
                const keyword = this.search.user_id.trim();
                data = data.filter(u => String(u.user_id).includes(keyword));
                // 本地分页（可选）
                const start = (this.search.page - 1) * this.search.limit;
                const end = start + this.search.limit;
                this.list = data.slice(start, end);
                this.total = data.length;
            } else {
                // 后端分页
                this.list = data;
                this.total = result.total || this.list.length;
            }
        },

        delInfo(row) {
            this.$Modal.confirm({
                title: '是否确认删除',
                content: '<p>确认删除后将彻底删除!</p><p>确认删除点击确认</p>',
                onOk: () => {
                    let params = {
                        id: row.id,
                    }
                    delNotice(params).then(reset => {
                        this.queryPartnerList();
                        this.$Message.info('已删除');
                    })
                },
                onCancel: () => {

                }
            });

        },
        toEdit() {
            let params = {
                ...this.extend
            }

            editNotice(params).then(reset => {
                this.queryPartnerList();
                this.isShow = false;
            })
        },
    },
    created() {
        this.queryPartnerList();
    },
    computed: {
        // ✅ 格式化积分（/100 保留 1 位）
        formattedList() {
            return this.list.map((item) => {
                const gold = (item.gold / 100).toFixed(1);
                return { ...item, gold };
            });
        },
    },
}
</script>
