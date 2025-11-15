<template>
  <div>
    <Tabs value="name1" @on-click="changeTabs">
        <TabPane label="登录" name="name1"></TabPane>
        <!-- <TabPane label="子账户登录" name="name2"></TabPane> -->
    </Tabs>
    <br>
    <Form ref="loginForm" :model="form" :rules="rules" @keydown.enter.native="handleSubmit" style="width:15rem">
        <FormItem prop="userName" >
          <Input v-model="form.userName" placeholder="请输入用户名">
            <span slot="prepend">
              <Icon :size="16" type="ios-person"></Icon>
            </span>
          </Input>
        </FormItem>
        <FormItem prop="code" v-if="loginType == 2">
          <Row>
            <Col span="14">
              <Input  v-model="form.code" placeholder="验证码">
                <span slot="prepend">
                  <Icon :size="14" type="ios-mail-outline"></Icon>
                </span>
              </Input>
            </Col>
            <Col span="10">
              <Button @click="getCode" :disabled="codeStatus" class="buttonStype">{{codeText}}</Button>
            </Col>
          </Row>
        </FormItem>
        <FormItem prop="password" v-if="loginType == 1">
          <Row>
            <Col span="24">
              <Input  v-model="form.password" placeholder="密码" type="password">
                <span slot="prepend">
                  <Icon :size="14" type="ios-mail-outline"></Icon>
                </span>
              </Input>
            </Col>
          </Row>
        </FormItem>
        <FormItem>
          <Button @click="handleSubmit" type="primary" long>登录</Button>
        </FormItem>
        <!--
        <FormItem>
          登录类型：<Icon type="ios-keypad" size="30" :color="colorPassWord" style="margin-left:20px" @click="changeType(1)"/><Icon type="md-phone-portrait" size="30" :color="colorPhone" style="margin-left:20px" @click="changeType(2)"/>
        </FormItem>
        -->
      </Form>
  </div>
  
</template>
<script>
import { getCode } from "@/api/user";
export default {
  name: 'LoginForm',
  props: {
    userNameRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: '账号不能为空', trigger: 'blur' }
        ]
      }
    },
    codeRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: '验证码不能为空', trigger: 'blur' }
        ]
      }
    },
    passwordRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  data () {
    return {
      form: {
        userName: '',
        code: '',
        password:'',
      },
      userType:1,
      codeStatus:false,
      codeText:'获取验证码',
      codeTime:60,
      loginType:1,
      colorPhone:"#C4C4C4",
      colorPassWord:"#2d8cf0"
    }
  },
  computed: {
    rules () {
      return {
        userName: this.userNameRules,
        code: this.codeRules,
        password:this.passwordRules,
      }
    }
  },
  methods: {
    changeTabs(name){
        if(name == 'name1'){
          this.userType = 1;
        }else{
          this.userType = 2;
        }
    },
    handleSubmit () {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.$emit('on-success-valid', {
            ...this.form,
            type:this.loginType,
            userType:this.userType
          })
        }
      })
    },
    getCode(){
      const params = {
        mobile:this.form.userName,
        type:11,
      };
      getCode(params).then(result=>{
        this.$Message.success("发送成功");
        this.codeStatus = true;
        this.codeTime = 60;
        let id = setInterval(() => {
          this.codeText = this.codeTime+"重新发送";
          this.codeTime = this.codeTime - 1;
          if(this.codeTime <= 0){
            this.codeText = '获取验证码';
            this.codeStatus = false;
            clearInterval(id);
          }
        }, 1000);
      })
    },
    changeType(type){
      this.loginType = type;
      if(type == 1){
        this.colorPhone = "	#C4C4C4";
        this.colorPassWord = "#2d8cf0";
      }else{
        this.colorPhone = "#2d8cf0";
        this.colorPassWord = "	#C4C4C4";
      }
      
    }
  }
}
</script>
