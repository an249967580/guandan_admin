<template>
    <div>
        <Card>
            <p slot="title">公告管理</p>
            <Button type="primary" slot="extra" @click="addInfo">发布公告</Button>
        </Card>

        <Row>
            <Col span="24">
            <Card>
                <Table :columns="columns" :data="list" border>
                    <template slot="action" slot-scope="{ row }">
                        <Button size="small" type="primary" @click="editInfo(row)">修改</Button>
                        <Button size="small" type="error" class="ml-5" @click="delInfo(row)">删除</Button>
                    </template>
                </Table>

                <div class="mt-10 text-center">
                    <Page :total="total" :page-size="pageSize" @on-change="changePage" />
                </div>
            </Card>
            </Col>
        </Row>

        <!-- 编辑抽屉 -->
        <Drawer title="编辑公告" v-model="isShow" width="600" :closable="true">
            <Form :model="extend" :label-width="80">
                <FormItem label="标题">
                    <Input v-model="extend.title" placeholder="请输入公告标题" />
                </FormItem>
                <FormItem label="内容">
                    <Input v-model="extend.content" type="textarea" :autosize="{ minRows: 4, maxRows: 10 }"
                        placeholder="请输入公告内容" />
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="toEdit">提交</Button>
                </FormItem>
            </Form>
        </Drawer>
    </div>
</template>

<script>
import { queryList, delNotice, editNotice } from "@/api/notice.js";

export default {
    data() {
        return {
            list: [],
            total: 0,
            page: 1,
            pageSize: 10,
            isShow: false,
            extend: {
                id: "",
                title: "",
                content: "",
            },
            columns: [
                { title: "ID", key: "id", width: 80 },
                { title: "标题", key: "title" },
                { title: "内容", key: "content" },
                { title: "操作", slot: "action", width: 160, align: "center" },
            ],
        };
    },
    created() {
        this.queryList();
    },
    methods: {
        // 获取公告列表
        queryList() {
            const params = { page: this.page, limit: this.pageSize };
            queryList(params).then((res) => {
                console.log("📥 接口返回：", res);
                if (res) {
                    const data = res.data || {};
                    this.list = data.list || data || [];
                    this.total = data.total || res.total || 0;
                } else {
                    this.$Message.error(res.msg || "获取列表失败");
                }
            });
        },

        // 翻页
        changePage(page) {
            this.page = page;
            this.queryList();
        },

        // 新增公告
        addInfo() {
            this.extend = { id: "", title: "", content: "" };
            this.isShow = true;
        },

        // 编辑公告
        editInfo(row) {
            this.extend = { id: row.id, title: row.title, content: row.content };
            this.isShow = true;
        },

        // 删除公告
        delInfo(row) {
            this.$Modal.confirm({
                title: "确认删除？",
                content: `<p>确定要删除公告《${row.title}》吗？</p>`,
                onOk: () => {
                    delNotice({ id: row.id }).then((res) => {
                        if (res) {
                            this.$Message.success("删除成功");
                            this.queryList();
                        } else {
                            this.$Message.error(res.msg || "删除失败");
                        }
                    });
                },
            });
        },

        // 提交编辑 / 新增
        toEdit() {
            if (!this.extend.title || !this.extend.content) {
                return this.$Message.warning("请填写完整信息");
            }

            editNotice(this.extend).then((res) => {
                if (res) {
                    this.$Message.success("保存成功");
                    this.isShow = false;
                    this.queryList();
                } else {
                    this.$Message.error(res.msg || "保存失败");
                }
            });
        },
    },
};
</script>

<style scoped>
.mt-10 {
    margin-top: 10px;
}

.ml-5 {
    margin-left: 5px;
}

.text-center {
    text-align: center;
}
</style>
