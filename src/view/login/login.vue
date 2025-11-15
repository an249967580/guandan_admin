

<template>
  <div class="login">
    <Row>
      <Col :xs="24" :sm="24" :lg="24">
        <Row>
          <Col :xs="24" :sm="12" :lg="6">
            <div class="topLogo">
              <img :src="logo" style="width:15rem"/>
            </div>
          </Col>
        </Row>
      </Col>
      <Col :xs="0" :sm="4" :lg="6"> &nbsp; </Col>
      <Col :xs="24" :sm="16" :lg="12" >
        <Row class="rowBack">
          <Col :xs="0" :sm="8" :lg="11" style="height:100%">
            <div class="loginClass"  style="padding-left:10px">
              <img :src="logins" width="100%"/>
            </div>
          </Col>
          <Col span="1"> &nbsp; </Col>
          <Col :xs="22" :sm="15" :lg="11" class="loginClass">
            <Card
              icon="log-in"

              :bordered="false"
              class="cardWidth"
            >
              <div class="form-con">
                <login-form @on-success-valid="handleSubmit"></login-form>
              </div>
            </Card>
          </Col>
        </Row>
      </Col>
      <Col :xs="0" :sm="4" :lg="6"> &nbsp; </Col>
    </Row>
    <div class="bottonText">
       <p>Copyright 2015-2021 河南中懿游 </p>
       <p>All Rights Reserved.</p>
    </div>
  </div>
</template>

<script>
import LoginForm from "_c/login-form";
import { mapActions } from "vuex";
import logo from "@/assets/images/login-logo.png";
import logins from "@/assets/images/logins.png";
import { setToken} from '@/libs/util'
export default {
  data() {
    return {
      logo,
      logins
    };
  },
  components: {
    LoginForm,
  },
  methods: {
    ...mapActions(["handleLogin", "getUserInfo","resetLoginTabNav"]),
    handleSubmit(data) {
      this.handleLogin(data).then((res) => {
        this.resetLoginTabNav();
        this.getUserInfo().then((res) => {
          this.$router.push({
            name: this.$config.homeName,
          });
        });
      });
    },
  },
  mounted(){
      let params = this.$route.query;
      if(params && params.code){
        this.code = params.code;
        let data = {
          code:params.code,
          userType:3,
          userName:"13521212121",
          type:2
        };
        this.handleSubmit(data);
      }

  }
};
</script>

<style>
.topLogo {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 20vh;

  /* width: 20%; */
}
.login {
  height: 100vh;
  /* background-color: gainsboro; */

}
.cardWidth {
  min-width: 200px;

}
.rowBack{
  background-color:#fff;
  border-radius: 20px;
  height: 50vh;
}
.loginClass{
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
.bottonText{
  height: 30vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  padding-bottom: 10px;

}
</style>
