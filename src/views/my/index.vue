<template>
  <div class="my-container">
    <!-- 成功登录状态 -->
    <div v-if="$store.state.user" class="header login">
      <div class="info">
        <div class="left">
               <van-image class="my-header"
                  :src="userInfo.photo"
                  fit="cover"
                  round
                   />
          <span class="name">{{userInfo.name}}</span>
        </div>
      <div class="right">
        <van-button
          round
          color="#fff"
          to="/user/profile"
          >编辑资料</van-button>
      </div>
    </div>
     <div class="data">
      <div class="data-item">
        <span class="count">{{userInfo.art_count}}</span>
        <span class="title">头条</span>
      </div><div class="data-item">
        <span class="count">{{userInfo.follow_count}}</span>
        <span class="title">关注</span>
      </div><div class="data-item">
        <span class="count">{{userInfo.fans_count}}</span>
        <span class="title">粉丝</span>
      </div><div class="data-item">
        <span class="count">{{userInfo.like_count}}</span>
        <span class="title">获赞</span>
      </div>
     </div>
    </div>
    <!-- 未登录状态 -->
    <div v-else class="header not-login" >
      <img src="~@/assets/mobile.png" @click="$router.push('/login')" >
      <span class="text">登录 / 注册</span>
    </div>
    <!-- 导航 -->
    <van-grid :border="false" :column-num="2" clickable>
      <van-grid-item>
        <i slot="icon" class="haian haian-shoucang"></i>
        <span slot="text">收藏</span>
      </van-grid-item>
      <van-grid-item>
        <i slot="icon" class="haian haian-lishi"></i>
        <span slot="text">历史</span>
      </van-grid-item>
    </van-grid>
    <!-- /导航 -->
    <!-- 相同的样式 -->
    <div class="grid-nav" >
    <van-cell title="消息通知" is-link url=""/>
    <van-cell title="实名验证" is-link url=""/>
    <van-cell title="用户反馈" is-link url=""/>
    <van-cell title="小智同学" is-link url=""/>
    <van-cell title="系统设置" class="cell" is-link url=""/>
    <van-cell v-if="$store.state.user" title="退出登录" class="logout-btn" clickable
      @click="onLogout" />
  </div>
  </div>
<!-- 退出 -->
<!-- /退出 -->
</template>

<script>
import { mapState } from 'vuex'
import { getUserInfo } from '@/api/user.js'
export default {
  name: 'MyPage',
  components: {},
  props: {},
  data () {
    return {
      userInfo: {}
    }
  },
  computed: { ...mapState(['user']) },
  watch: {},
  created () {
    // 如果有数据才加载 用户信息
    if (this.user) {
      this.loadUserInfo()
    }
  },
  mounted () {},
  methods: {
    onLogout () {
      this.$dialog.confirm({ title: '确定退出登录吗?' }).then(() => {
        // on confirm 确定执行这里
        // 确认退出:清除登录状态(容器中的 user + 本地存储中的 user)
        this.$store.commit('getUser', null) /* 传入null值相当于无效值 */
      }).catch(() => {
        // on cancel 取消执行这里
        console.log('2222')
      })
    },
    async loadUserInfo () {
      try {
        const { data: { data } } = await getUserInfo()
        console.log(data)
        this.userInfo = data
      } catch (error) {
        this.$toast.fail('获取用户信息失败,请稍后再试' + error)
      }
    }
  }
}
</script>

<style scoped lang="less">
  .my-container{
    background: #f6f7fa;
    .header{
      height: 361px;
      background: url('~@/assets/banner.png');
      background-size: cover;
    }
    .not-login{
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      >img{
        width: 132px;
        height: 132px;
        margin-bottom: 15px;
      }
      >.text{
        font-size: 28px;
        color: #fff;
      }
    }
    .login{
      padding: 81px 32px 0;
      .info{
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 213px;
        .left{
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 213px;
          .my-header{
            width: 132px;
            height: 132px;
            margin-right: 22px;
            border: 4px solid #fff;
          }
          .name{
            font-size: 30px;
            color: #fff;
          }
        }
        .right{
          display: flex;
          align-items: center;
          button.van-button{
            height: 33px;
            width: 165px;
          .van-button__content{
          color: #666;
          font-size: 20px;
          }
        }
        }
      }
      .data{
        height: 130px;
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        .data-item{
          flex:1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color:#FFF;
          .count{
            font-size: 36px;
          }
          .title{
            font-size: 22px;
          }
        }
      }
    }
    // 导航
    .van-grid{
      .van-grid-item{
        i.haian{
          font-size: 45px;
          color:#eb5253;
        }
        span{
          font-size: 28px;
          color:#333;
        }
      }
    }
    // 退出登录按钮
    .logout-btn{
    text-align: center;
    color: #d44848;
    font-size: 30px;
    }
    .cell{
      margin-bottom: 9px;
    }
    .grid-nav{
      margin-top: 9px;
    }
  }
</style>
