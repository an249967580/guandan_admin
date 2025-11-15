<template>
    <div>
        <Card>
            <p slot="title">用户列表</p>

            <Input v-model="search.user_id" placeholder="用户ID" clearable style="width: 200px" />
            <Input v-model="search.name" placeholder="昵称" clearable style="width: 200px; margin-left: 8px" />
            <Input v-model="search.invite_id" placeholder="邀请人ID" clearable style="width: 200px; margin-left: 8px" />
            <Select v-model="search.is_exception" style="width: 120px; margin-left: 8px">
                <Option :value="-1">全部</Option>
                <Option :value="0">正常</Option>
                <Option :value="1">异常</Option>
            </Select>
            <Select v-model="search.user_status" style="width: 120px; margin-left: 8px">
                <Option :value="-1">全部状态</Option>
                <Option :value="0">正常</Option>
                <Option :value="1">停用中</Option>
            </Select>
            <Select v-model="search.register_type" style="width: 140px; margin-left: 8px">
                <Option :value="-1">注册类型</Option>
                <Option :value="1">手机号注册</Option>
                <Option :value="2">邮箱注册</Option>
            </Select>
            &nbsp;
            <Button type="primary" @click="queryList(true)">搜索</Button>
            <Button type="success" style="margin-left: 8px" @click="exportExcel">导出</Button>
            <Button type="error" style="margin-left: 8px" :disabled="!selectedUsers.length" @click="batchSetBan(1)">
                批量封号
            </Button>
            <Button type="error" style="margin-left: 8px" :disabled="!selectedUsers.length" @click="batchSetBan(0)">
                批量解封
            </Button>
            <Button type="error" style="margin-left: 8px" :disabled="!selectedUsers.length" @click="batchDeleteUsers">
                批量删除
            </Button>
            <!-- <Button type="primary" slot="extra" @click="addInfo">发布</Button> -->
        </Card>
        <Row>
            <Col span="24">
            <Card>
                <div>
                    <Alert type="info" show-icon>
                        <template v-if="selectedUsers.length === 0">
                            当前用户：共 <b style="color:#409EFF;">{{ total }}</b> 位用户，
                            今日注册：<b style="color:#f56c6c;">{{ todayRegisterCount }}</b>，
                            累计积分：<b style="color:#67C23A;">{{ totalGoldAll }}</b>，
                            平均积分：<b style="color:#E6A23C;">{{ avgGoldAll }}</b>
                        </template>
                        <template v-else>
                            已选中 <b style="color:#409EFF;">{{ selectedUsers.length }}</b> 位用户，
                            累计积分：<b style="color:#67C23A;">{{ selectedGold }}</b>，
                            平均积分：<b style="color:#E6A23C;">{{ selectedAvg }}</b>
                        </template>
                    </Alert>

                    <Table :columns="column" :data="formattedList" @on-selection-change="handleSelectionChange"
                        ref="userTable" border>
                        <template #actionSlot="{ row }">
                            <div style="display: flex; align-items: center; gap: 8px; white-space: nowrap;">
                                <Button type="success" size="small" :loading="loadingId === row.user_id"
                                    :disabled="row.role === 'partner'" @click="setPartner(row)">
                                    {{ row.role === 'partner' ? '已是合伙人' : '设置合伙人' }}
                                </Button>

                                <!-- <Button type="error" size="small" :loading="banLoadingId === row.user_id"
                                    @click="toggleBan(row)">
                                    {{ row.user_status === 1 ? '解封' : '封号' }}
                                </Button> -->
                            </div>
                        </template>
                        <template #scoreSlot="{ row }">
                            <span>{{ row.gold }}</span>
                        </template>
                        <!-- <template slot="makeSlot" slot-scope="{ row , index}">
                                <Button type="primary" @click="editInfo(row)"> 修改 </Button>&nbsp;&nbsp;
                                <Button type="info" @click="delInfo(row)"> 删除 </Button>
                            </template> -->
                    </Table>
                </div>

                <Page :total="total" :current="search.page" @on-change="changePage" :page-size="search.limit"
                    show-elevator style="margin-top: 20px;"></Page>
            </Card>

            </Col>
        </Row>
    </div>

</template>
<script>
import { queryList, setRole, setBan, batchSetBan, batchDeleteUsers } from "@/api/users.js";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import user from "../../store/module/user";


export default {
    data: () => {
        return {
            selectedUsers: [],
            loadingId: null, // 控制按钮loading
            banLoadingId: null,  // 封号按钮 loading（这一行是关键）
            search: {
                user_id: '',
                name: '',
                invite_id: '',  // 新增字段
                is_exception: -1, // ✅ 默认-1（不过滤）
                user_status: 0,
                register_type: -1,
                page: 1,
                limit: 10
            },
            totalGoldAll: 0,  // 全部用户积分总和
            avgGoldAll: 0,    // 全部用户平均积分
            selectedGold: 0,   // 选中用户积分总和
            selectedAvg: 0,    // 选中用户平均积分
            todayRegisterCount: 0, // 今日注册人数
            column: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center',
                },
                // {
                //     title:'ID',
                //     key:'id',
                // },
                {
                    title: "用户ID",
                    key: 'user_id'
                },
                {
                    title: "昵称",
                    width: 200,
                    key: 'name'
                },
                {
                    title: "邀请人id",
                    key: 'inviter_id'
                },
                {
                    title: "当前积分",
                    slot: 'scoreSlot',
                    key: 'gold'
                },
                {
                    title: "注册类型",
                    key: "register_type",
                    render: (h, params) => {
                        const u = params.row;
                        let type = "未知";
                        let color = "default";

                        if (u.name) {
                            const value = u.name;
                            if (/@/.test(value)) {
                                type = "邮箱注册";
                                color = "primary";
                            } else if (/^1\d{10}$/.test(value)) {
                                type = "手机号注册";
                                color = "success";
                            } else {
                                type = "其他";
                            }
                        }

                        return h("Tag", { props: { color } }, type);
                    },
                },
                {
                    title: "注册时间",
                    width: 200,
                    key: "create_time"
                },
                {
                    title: "最后登录",
                    width: 200,
                    key: 'last_time'
                },
                {
                    title: "异常状态",
                    key: "is_exception ",
                    render: (h, params) => {
                        const text = params.row.is_exception === 1 ? '异常' : '正常';
                        const color = params.row.is_exception === 1 ? 'error' : 'success';
                        return h('Tag', { props: { color } }, text);
                    }
                },
                {
                    title: "封禁状态",
                    key: "user_status",
                    render: (h, params) => {
                        const text = params.row.user_status === 1 ? '停用中' : '正常';
                        const color = params.row.user_status === 1 ? 'error' : 'success';
                        return h('Tag', { props: { color } }, text);
                    }
                },
                {
                    title: "操作",
                    width: 120,
                    slot: 'actionSlot'
                }
                // {
                //    title:"操作",
                //    width:200,
                //    slot:'makeSlot',
                // },
            ],

            total: 0,
            list: [],
            // search: {
            //     user_id: '',
            //     page: 1,
            //     limit: 20
            // },
            isShow: false,
        }
    },
    methods: {
        batchDeleteUsers() {
            if(this.selectedUsers.length === 0) {
                this.$Message.warning("请先选择要删除的用户");
                return;
            }

            this.$Modal.confirm({
                title: "确认删除选中用户吗？",
                content: `共 ${this.selectedUsers.length} 位用户将被永久删除，不可恢复！`,
                onOk: () => {
                    const params = {
                        user_ids: this.selectedUsers.join(',')
                    };

                    batchDeleteUsers(params)
                    .then(res => {
                        if(res === true || res === '操作成功') {
                            this.$Message.success('删除成功');
                            this.queryList();
                        }
                        else {
                            this.$Message.error(res || '删除失败');
                        }
                        console.log('删除返回的数据', res);
                    })
                    .catch(()=>{
                        this.$Message.error('请求失败');
                    })
                    .finally(()=>{
                        this.selectedUsers = [];
                    })
                }
            })
        },
        
        countAllGold() {
            const params = {
                page: 1,
                limit: 999999, // 拉取全部数据
            };
            queryList(params).then(result => {
                const data = (result.data || []).filter(u => u.role !== "partner");
                const totalGold = data.reduce((sum, u) => sum + (u.gold || 0), 0);
                this.totalGoldAll = (totalGold / 100).toFixed(1); // 转为元
                this.avgGoldAll = data.length ? (this.totalGoldAll / data.length).toFixed(1) : 0;

                // ✅ 计算今日注册人数
                const today = new Date().toISOString().slice(0, 10); // "2025-10-28"
                this.todayRegisterCount = data.filter(
                    u => u.create_time && u.create_time.startsWith(today)
                ).length;
            });
        },
        handleSelectionChange(selection) {
            this.selectedUsers = selection.map(u => u.user_id);

            if (selection.length > 0) {
                const total = selection.reduce((sum, u) => sum + (parseFloat(u.gold) || 0), 0);
                this.selectedGold = total.toFixed(1);
                this.selectedAvg = (total / selection.length).toFixed(1);
            } else {
                // 恢复默认显示（全部统计）
                this.selectedGold = 0;
                this.selectedAvg = 0;
            }
        },
        changePage(page) {
            this.search.page = page;
            this.queryList();
        },
        batchSetBan(status) {
            if (this.selectedUsers.length === 0) {
                this.$Message.warning("请先选择要操作的用户");
                return;
            }

            const actionText = status === 1 ? "封号" : "解封";
            this.$Modal.confirm({
                title: `确认${actionText}选中用户？`,
                content: `共 ${this.selectedUsers.length} 位用户将被${actionText}。`,
                onOk: () => {
                    const params = {
                        user_ids: this.selectedUsers.join(","),
                        status
                    };

                    batchSetBan(params)
                        .then(res => {
                            if (res) {
                                this.$Message.success(`${actionText}成功`);
                                this.queryList();
                            } else {
                                this.$Message.error(res.msg || `${actionText}失败`);
                            }
                        })
                        .catch(() => {
                            this.$Message.error("请求失败");
                        })
                        .finally(() => {
                            this.loadingId = null;
                            this.selectedUsers = []; // 清空选中
                        });
                }
            });
        },
        queryList(isSearch = false) {
            if (isSearch) {
                this.search.page = 1; // ✅ 搜索模式下重置页码
            }
            // const hasInviterSearch = this.search.inviter && this.search.inviter.trim() !== "";
            // const hasuser_statusSearch = this.search.user_status !== -1;
            // const hasuser_register_typeSearch = this.search.register_type !== -1;
            // 如果输入了邀请人关键字，就拉全量数据
            const params = {
                ...this.search,
                page: this.search.page,
                limit: this.search.limit
            };

            queryList(params).then(result => {
                let data = result.data || [];

                // 1️⃣ 去掉合伙人
                data = data.filter(u => u.role !== "partner");

                // if (this.search.register_type !== -1) {
                //     console.log(data);
                //     data = data.filter(u => {
                //         const value = u.name || "";
                //         if (this.search.register_type === 0) {
                //             // 手机号注册
                //             return /^1\d{10}$/.test(value);
                //         } else if (this.search.register_type === 1) {
                //             // 邮箱注册
                //             return /@/.test(value);
                //         }
                //         // return true
                //     });
                //     const start = (this.search.page - 1) * this.search.limit;
                //     const end = start + this.search.limit;
                //     this.list = data.slice(start, end);
                //     this.total = data.length;
                // }

                // else {
                // 后端分页
                this.list = data;
                this.total = result.total;
                // }
            });
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
                        this.queryList();
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
                this.queryList();
                this.isShow = false;
            })
        },
        toggleBan(row) {
            const isBan = row.user_status === 0; // 当前是正常，则要封号
            const actionText = isBan ? '封号' : '解封';
            this.$Modal.confirm({
                title: `确认${actionText}用户？`,
                content: `是否确认${actionText}用户 ${row.name}（ID：${row.user_id}）？`,
                onOk: () => {
                    this.banLoadingId = row.user_id;
                    setBan({ user_id: row.user_id })
                        .then(res => {
                            if (res) {
                                this.$Message.success(`${actionText}成功`);
                                this.queryList(); // 刷新列表
                            } else {
                                this.$Message.error(res.msg || `${actionText}失败`);
                            }
                        })
                        .catch(() => {
                            this.$Message.error('请求失败');
                        })
                        .finally(() => {
                            this.banLoadingId = null;
                        });
                }
            });
        },
        setPartner(row) {
            if (row.role === 'partner') {
                this.$Message.warning('该用户已是合伙人');
                return;
            }

            this.$Modal.confirm({
                title: '确认设置合伙人？',
                content: `将用户 ${row.name}（ID：${row.user_id}）设置为合伙人？`,
                onOk: () => {
                    this.loadingId = row.user_id;
                    const params = { user_id: row.user_id, role: 'partner' };

                    setRole(params)
                        .then(res => {
                            console.log(res);
                            // 依据你们后端返回判断，这里假设 code === 0 表示成功
                            if (res === '操作成功') {
                                this.$Message.success('设置成功');
                                // 方案A：直接刷新列表（推荐，保持与后端一致）
                                this.queryList();

                                // 方案B：不刷新，前端本地更新（可选）
                                // row.role = 'partner';
                                // 同时如果你不想显示合伙人，可以过滤掉：
                                // this.list = this.list.filter(u => u.role !== 'partner');
                            } else {
                                this.$Message.error(res.msg || '设置失败');
                            }
                        })
                        .catch(() => {
                            this.$Message.error('请求失败');
                        })
                        .finally(() => {
                            this.loadingId = null;
                        });
                }
            });
        },
        exportExcel() {
            this.$Message.info("正在导出中，请稍候...");

            // 构造参数：用当前搜索条件，但拉取全部数据
            const params = {
                ...this.search,
                page: 1,
                limit: 99999 // 💡设置一个足够大的值，确保取全量
            };

            // 如果有时间筛选，格式化日期
            // if (this.search.last_time) {
            //     const d = new Date(this.search.last_time);
            //     params.last_time = d.toISOString().slice(0, 10);
            // }

            // 请求全量数据
            queryList(params).then(result => {
                const allData = result.data || [];

                if (allData.length === 0) {
                    this.$Message.warning("没有可导出的数据");
                    return;
                }

                // 过滤合伙人
                const exportData = allData
                    .filter(u => u.role !== "partner")
                    .map(u => ({
                        用户ID: u.user_id,
                        昵称: u.name,
                        邀请人ID: u.inviter_id,
                        邀请人名称: u.group_name,
                        当前积分: u.gold,
                        注册类型: /@/.test(u.name)
                            ? "邮箱注册"
                            : /^1\d{10}$/.test(u.name)
                                ? "手机号注册"
                                : "其他",
                        最后登录: u.last_time,
                        状态: u.user_status === 1 ? "停用中" : "正常",
                        身份: u.role === "partner" ? "合伙人" : "普通用户",
                    }));

                // 生成 Excel
                const worksheet = XLSX.utils.json_to_sheet(exportData);
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, "用户列表");

                const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
                const blob = new Blob([excelBuffer], { type: "application/octet-stream" });

                const date = new Date().toISOString().slice(0, 10);
                saveAs(blob, `用户列表_${date}.xlsx`);

                this.$Message.success(`已导出 ${exportData.length} 条数据`);
            })
                .catch(() => {
                    this.$Message.error("导出失败，请重试");
                });
        }
    },
    created() {
        this.queryList();
        this.countAllGold(); // ✅ 加上这个
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
