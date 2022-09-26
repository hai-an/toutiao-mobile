<template>
  <div class="layout-container">
    <!-- 子路由出口 -->
<router-view class="padding"></router-view>
<!-- /子路由出口 -->
      <!-- 标签导航栏 -->
<van-tabbar route class="layout-tabbar">
  <van-tabbar-item replace to="/home">
    <i slot="icon" class="haian haian-shouye"></i>
    <span class="text">首页</span>
  </van-tabbar-item>
  <van-tabbar-item replace to="/qa">
    <i slot="icon" class="haian haian-wenda"></i>
    <span class="text">问答</span>
  </van-tabbar-item>
  <van-tabbar-item replace to="/video">
    <i slot="icon" class="haian haian-shipin"></i>
    <span class="text">视频</span>
  </van-tabbar-item>
  <van-tabbar-item replace to="/my">
    <i slot="icon" class="haian haian-wode"></i>
    <span class="text">{{$store.state.user?'我的':'未登录'}}</span>
  </van-tabbar-item>
</van-tabbar>
  <!-- /标签导航栏 -->
  </div>
</template>

<script>
export default {
  name: 'LayoutPage',
  components: {},
  props: {},
  data () {
    return {
      // active: 0
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {}
}
</script>

<style  scoped lang="less">
.layout-container {
  .layout-tabbar {
    i.haian {
      font-size: 40px;
    }
    span.text {
      font-size: 20px;
    }
  }
}
</style>
