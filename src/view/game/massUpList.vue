<template>
    <div>
        <Card>
            <p slot="title">晋级名单</p>
            <div slot="extra"><Button type="info"  @click="exportData">导出</Button>&nbsp;<Button type="primary"  @click="addInfo">返回</Button></div>
        </Card>
        <Row>
            <Col span="24">
                <Card>
                    <div>
                        <Table :columns="column" :data="list" ref="table">
                             <template
                                slot="score"
                                slot-scope="{ row, index }"
                            >
                               <div v-if="row.score == 1" style="color:green">晋级</div>
                               <div v-if="row.score == 0" style="color:red">淘汰</div>
                            </template>

                            <template
                                slot="is_up"
                                slot-scope="{ row, index }"
                            >
                               <div v-if="row.is_up == 1" style="color:green">晋级</div>
                               <div v-if="row.is_up == 0" style="color:red">淘汰</div>
                            </template>



                            
                        </Table>
                    </div>
                    <!-- <Page :total="total" @on-change="changePage"></Page> -->
                </Card>
            </Col>
        </Row>
    </div>
</template>
<script>
    import { upUserMassList} from "@/api/match.js";

    
    export default {
        data:()=>{
            return {
                loading1:false,
                column:[
                    {
                        title:'ID',
                        key:'id',
                        width:80,
                    },
                    {
                        title:'用户ID',
                        key:'user_id',
                        width:80,
                    },
                    {
                        title:"用户",
                        key:'nick_name'
                    },
                    {
                        title:"分数",
                        key:'score',
                    },
                    {
                        title:"局数",
                        key:'num',
                    },
                    {
                        title:"状态",
                        key:'up_status',
                        slot:"is_up"
                    },
                ],
                total:0,
                list:[],
                search:{
                    page:1,
                    limit:1000,
                    game_id:0,
                },
                game_id:0,
            }
        },
        methods:{
            changePage(date){
                this.search.page = date;
                this.queryList();
            },
            queryList(){
                let params = {
                    ...this.search
                };
                upUserMassList(params).then(result=>{
                    this.list = result.data;
                    this.total = result.total;
                })
            },
            addInfo(){
                this.$router.push({
                    name: "team",
                    params: { id: this.game_id},
                });
            },
            exportData(){
                this.$refs.table.exportCsv({
                    filename: '海选排名'
                });
            }
        },
        created(){
           let id = this.$route.params.id;
            if (id) {
                this.game_id = this.$route.params.game_id;
                this.search.game_id = id;
                this.queryList();
            }
        },
        mounted() {
           
        },
    }
</script>

