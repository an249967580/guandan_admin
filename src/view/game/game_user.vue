<template>
    <div>
        <Card>
            <p slot="title">报名用户</p>
            <Button type="primary" slot="extra" @click="addInfo">返回</Button>
        </Card>
        <Row>
            <Col span="24">
                <Card>
                    <div>
                        <Table :columns="column" :data="list">
                        </Table>
                    </div>
                    <Page :total="total" @on-change="changePage"></Page>
                </Card>
                
            </Col>
        </Row>
    </div>
</template>
<script>
    import { queryGameUserList} from "@/api/match.js";

    
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
                        key:'nick_name',
                        // min:80,
                    },
                ],
                total:0,
                list:[],
                search:{
                    page:1,
                    limit:10,
                    game_id:0,
                }
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
                queryGameUserList(params).then(result=>{
                    this.list = result.data;
                    this.total = result.total;
                })
            },
            addInfo(){
                this.$router.go(-1);
            }
        },
        created(){
            let id = this.$route.params.id;
            if (id) {
                this.search.game_id = id;
                this.queryList();
            }
        },
        mounted() {
            
        },
    }
</script>

