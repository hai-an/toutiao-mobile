<template>
  <div class="login-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" title="登录" >
      <template #left>
        <van-icon name="cross" size="18" @click="$router.back()" />
      </template>
    </van-nav-bar>
    <!--/ 导航栏 -->

    <!-- 登录表单 -->
<van-form @submit="onSubmit" ref="loginForm">
  <!-- van-cell-group 仅仅是提供了一个上下外边框，能看到包裹的区域 -->
  <van-cell-group>
  <van-field
  v-model="user.mobile"
    name="手机号"
    label="手机号"
    placeholder="请输入手机号"
    :rules="userFormRules.mobile"
    maxlength="11"
  >
<i slot="left-icon" class="haian haian-shouji"></i>
</van-field>
  <van-field
  v-model="user.code"
    type="number"
    name="验证码"
    label="验证码"
    placeholder="请输入验证码"
    :rules="userFormRules.code"
    maxlength="6"

  >
<i slot="left-icon" class="haian haian-yanzhengma"></i>
  <!-- 默认不显示倒计时 -->
  <van-count-down
  v-if="isCountDownShow" class="send-sms-btn"
   slot="button"
  :time="1000 * 60"
  format="ss s"
  @finish="isCountDownShow = false"
/>
    <van-button
    v-else
    slot="button" class="send-sms-btn" size="small"
    round
    type="primary"
    @click="onSendCode">发送验证码</van-button>
</van-field>
</van-cell-group>
  <div class="login-btn-wrap">
    <van-button class="login-btn" block type="info" native-type="submit">
      登录
    </van-button>
  </div>
</van-form>
    <!--/ 登录表单 -->

  </div>
</template>

<script>
import { loginAPI, sendCode } from '@/api/user'
export default {
  name: 'LoginPage',
  components: {},
  props: {},
  data () {
    return {
      user: {
        mobile: '', /* 手机号 */
        code: '' /* 验证码 */
      },
      isCountDownShow: false, /* 默认不显示倒计时 */
      userFormRules: {
        mobile: [{
          required: true,
          message: '手机号不能为空'
        }, {
          pattern: /^1[3|5|7|8]\d{9}$/,
          message: '手机号格式错误'
        }],
        code: [{
          required: true,
          message: '验证码不能为空'
        }, {
          pattern: /\d{6}/,
          message: '验证码格式错误'
        }]
      }
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {
    // this.$refs.loginForm
  },
  methods: {
    async onSubmit () {
    // 1.获取表单数据
      // const user = this.user
      // 2.TODO 表单验证
      this.$toast.loading({ /* 转圈圈提示  */
        message: '加载中...',
        forbidClick: true/* 禁用背景点击 */
      })
      // 3.提交表单请求登录
      try {
        const { data: { data } } = await loginAPI(this.user)/* 传入必要的两个参数 */
        console.log('登录成功' + data)
        this.$toast.success('登录成功')// 成功提示
        this.$store.commit('getUser', data) /* 保存 token 和 refresh_token */
        // 登录成功后回到原来的界面
        this.$router.back()
      } catch (err) {
        if (err.response.status === 400) {
          // console.log('手机或验证码错误' + err)
          this.$toast.fail('手机或验证码错误')// 失败提示
        } else {
          // console.log('登录失败,请稍后再试' + err)
          this.$toast.fail('登录失败,请稍后再试')
        }
      }

    // 4.根据请求响应结果处理后续操作
    },
    async onSendCode () {
      // 1.效验手机号
      try {
        await this.$refs.loginForm.validate('手机号')
        console.log(this.$refs.loginForm)
      } catch (err) {
        return console.log('验证失败', err)
      }
      // 2.验证通过,显示倒计时
      this.isCountDownShow = true
      // 3.请求发送验证码
      try {
        await sendCode(this.user.mobile)
        this.$toast('发送成功')
      } catch (err) {
        // 发送失败,关闭倒计时
        this.isCountDownShow = false
        if (err.response.status === 429) {
          this.$toast('发送太频繁了，请稍后重试')
        } else {
          this.$toast('发送失败，请稍后重试')
        }
      }
    }
  }
}
</script>
<style scoped lang="less">
  .login-container {
  .haian {
    font-size: 37px;
  }
  .send-sms-btn {
    width: 162px;
    height: 46px;
    line-height: 46px;
    background-color: #ededed;
    font-size: 20px;
    color: #666;
    border: none;
  }
  .login-btn-wrap {
    padding: 53px 33px;
    .login-btn {
      background-color: #6db4fb;
        border: none;
    }
  }
}
</style>
