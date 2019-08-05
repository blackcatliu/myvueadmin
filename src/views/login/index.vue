<template>
  <div class='login-container site-page--login'>
    <el-form
      ref='loginForm'
      :model='loginForm'
      :rules='loginRules'
      class='login-form'
      autocomplete='on'
      label-position='left'
      @keyup.enter.native="handleLogin()"
    >
      <div class='title-container'>
        <h3 class='title'>门 禁 管 理 系 统</h3>
      </div>

      <el-form-item prop='username'>
        <span class='svg-container'>
          <svg-icon icon-class='user' />
        </span>
        <el-input
          ref='username'
          v-model='loginForm.username'
          placeholder='请输入用户名'
          name='username'
          type='text'
          tabindex='1'
          autocomplete='on'
        />
      </el-form-item>

      <el-tooltip v-model='capsTooltip' content='Caps lock is On' placement='right' manual>
        <el-form-item prop='password'>
          <span class='svg-container'>
            <svg-icon icon-class='password' />
          </span>
          <el-input
            :key='passwordType'
            ref='password'
            v-model='loginForm.password'
            :type='passwordType'
            placeholder='请输入密码'
            name='password'
            tabindex='2'
            autocomplete='on'
            @keyup.native='checkCapslock'
            @blur='capsTooltip = false'
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
      </el-tooltip>

      <el-form-item prop='captcha'>
        <span class='svg-container'>
          <svg-icon icon-class='edit' />
        </span>
        <el-input v-model='loginForm.captcha' placeholder='请输入验证码' tabindex='3'></el-input>
      </el-form-item>

      <img alt='点击刷新' :src='vsCode' @click='changeCodeImg()' id='img_RandomCode' title='点击刷新' />
      <!-- <el-form-item prop='captcha'>
        <span class='svg-container'>
          <svg-icon icon-class='edit' />
        </span>
        <el-input
          ref='username'
          v-model='loginForm.captcha'
          placeholder='请输入验证码'
          name='captcha'
          type='text'
          tabindex='3'
          autocomplete='off'
          @keyup.enter.native='handleLogin'
        />
        <img :src='captchaPath' @click='getCaptcha()' alt />
      </el-form-item>-->

      <el-button
        :loading='loading'
        type='primary'
        style='width:100%;margin-bottom:30px;'
        @click.native.prevent='handleLogin'
      >登录</el-button>
    </el-form>

    <!-- <el-dialog title='Or connect with' :visible.sync='showDialog'>
      Can not be simulated on local, so please combine you own business simulation! ! !
      <br />
      <br />
      <br />
      <social-sign />
    </el-dialog>-->
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate';

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value.length < 1) {
        callback(new Error('用户名不能为空'));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (value.length < 1) {
        callback(new Error('密码不能为空'));
      } else {
        callback();
      }
    };
    const validatecaptcha = (rule, value, callback) => {
      if (value.length < 1) {
        callback(new Error('验证码不能为空'));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        username: '',
        password: '',
        captcha: '',
        uuid: ''
      },
      loginRules: {
        username: [
          { required: true, trigger: 'blur', validator: validateUsername }
        ],
        password: [
          { required: true, trigger: 'blur', validator: validatePassword }
        ],
        captcha: [
          { required: true, trigger: 'blur', validator: validatecaptcha }
        ]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {},
      vsCode: ''
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query;
        if (query) {
          this.redirect = query.redirect;
          this.otherQuery = this.getOtherQuery(query);
        }
      },
      immediate: true
    }
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
    // this.getCaptcha()
    this.CodeImg();
  },
  mounted() {
    if (this.loginForm.username === '') {
      this.$refs.username.focus();
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus();
    } else if (this.loginForm.captcha === '') {
      this.$refs.captcha.focus();
    }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    changeCodeImg() {
      //这里是点击验证码图片的时候会刷新验证码
      this.CodeImg();
    },
    CodeImg() {
    
      //这个是图片验证码的函数
      this.loginForm.uuid ='xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
          return (c === 'x' ? (Math.random() * 16 | 0) : ('r&0x3' | '0x8')).toString(16)
        })
      // this.vsCode = `https://demo.renren.io/security-enterprise-server/captcha?uuid=${this.loginForm.uuid}`
      // this.vsCode = `${process.env.BASE_API}/captcha.jpg?uuid=${this.loginForm.uuid}`
      console.log(`${process.env.BASE_API}`);
      this.vsCode = `http://localhost:8888/doormanage/captcha.jpg?uuid=${this.loginForm.uuid}`;
    },
    checkCapslock({ shiftKey, key } = {}) {
      if (key && key.length === 1) {
        if (
          (shiftKey && (key >= 'a' && key <= 'z')) ||
          (!shiftKey && (key >= 'A' && key <= 'Z'))
        ) {
          this.capsTooltip = true;
        } else {
          this.capsTooltip = false;
        }
      }
      if (key === 'CapsLock' && this.capsTooltip === true) {
        this.capsTooltip = false;
      }
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = '';
      } else {
        this.passwordType = 'password';
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch('user/login', this.loginForm)
            .then((data) => {
                  if (data && (data.code === 200 || data.code=== 0) && (data.msg === 'Success' || data.msg === 'success')) {
                      this.$router.push({
                    path: this.redirect || '/'
                        });
                  } else { 
                    this.$message.error(!!data.msg?data.msg:(!!data.message?data.message:'请重新登录'))
                    this.CodeImg()          
                  }
              this.loading = false;
            })
            .catch((error) => {
            this.loading = false;
            });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }

    // afterQRScan() {
    //   if (e.key === 'x-admin-oauth-code') {
    //     const code = getQueryObject(e.newValue)
    //     const codeMap = {
    //       wechat: 'code',
    //       tencent: 'code'
    //     }
    //     const type = codeMap[this.auth_type]
    //     const codeName = code[type]
    //     if (codeName) {
    //       this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
    //         this.$router.push({ path: this.redirect || '/' })
    //       })
    //     } else {
    //       alert('第三方登录失败')
    //     }
    //   }
    // }
  }
}
</script>

<style lang='scss'>
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang='scss' scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(38, 50, 56, .6);
  &:before {
    position: fixed;
    top: 0;
    left: 0;
    z-index: -1;
    width: 100%;
    height: 100%;
    content: "";
    background: $bg;
    background-size: cover;
    }

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
  .login-captcha {
    overflow: hidden;
    > img {
      width: 100%;
      cursor: pointer;
    }
  }
}
</style>
