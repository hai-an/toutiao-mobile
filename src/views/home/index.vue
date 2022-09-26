<template>
  <div class="home-container" >
    <!-- 顶部搜索导航栏 -->
     <van-nav-bar class="page-nav-bar" id="ellipsis" fixed>
        <van-button slot="title" class="search-btn"
        size="small"
        type="info"
        round
        icon="search"
        overflow="no"
        to="/search" >
          <!-- <van-icon slot="icon" name="search"></van-icon> -->
          搜索
        </van-button>
     </van-nav-bar>
    <!-- /顶部搜索导航栏 -->

<!-- 用户频道列表栏 -->
<!-- vant组件 的自定义属性 cative 绑定索引, swipeable开启滑动,animated动画效果  -->
<!-- vue-for 循环我的频道,通过 索引,绑定index高亮的active -->
<!-- v-model="active" 控制高亮显示的索引位置,active为数字型 -->
<van-tabs class="channel-tabs" v-model="active" swipeable animated >
  <van-tab   v-for="(obj,index ) in channelsArr" :key="index" :title="obj.name">
    <!--频道的 文章内容 组件:实际上是下面的整个内容封装成一个组件,即一个用户频道对应一个文章内容页面(有N条数据)-->
      <activeList :channelsObj="obj"></activeList>
    <!-- /频道的 文章内容 -->
  </van-tab>
  <div slot="nav-right" class="placeholder" ></div>
  <div slot="nav-right" class="hamburger-btn">
    <i class="haian haian-gengduo" @click="isChannelEditShow=true"></i>
  </div>
</van-tabs>
<!-- /频道列表 -->

<!-- 频道编辑弹出层 -->
  <van-popup
  class="edit-channel-popup"
  v-model="isChannelEditShow"
  closeable
  close-icon-position="top-left"
  position="bottom"
  :style="{ height: '100%' }"

>
<!-- 父组件 自定义事件接收参数 -->
<!-- 父传子: 子组件定义proo的变量接收父组件的值 -->
<channelEdit
:active='active'
:userChannels="channelsArr"
@addUserChannels="addUserChannelsFn"
@delUserChannels="delUserChannelsFn">
</channelEdit>
</van-popup>
<!-- /频道编辑弹出层 -->
  </div>
</template>

<script>
// 展示频道列表
/* 思路:
1.找数据接口
2.把接口封装为请求方法
3.在组件中请求获取数据
4.模板绑定
*/
// 导入 获取"我的频道"列表的api,里面封装了 axios.get()方法,作为单独的js文件,方便管理
import { getUserChannels } from '@/api/user.js'
import ActiveList from './components/article-list'
import channelEdit from '@/components/channel-edit'
import { mapState } from 'vuex'
import { getItem } from '@/utils/storage'
export default {
  name: 'HomePage',
  components: {
    ActiveList, /* 注册列表组件 */
    channelEdit /* 注册弹出层组件 */
  },
  props: {},
  data () {
    return {
      active: 0, /* 首页频道列表高亮索引 */
      channelsArr: [], /* 定义空的数组 用户频道列表 */
      isChannelEditShow: false /* 是否显示弹出层 */
    }
  },
  computed: {
    ...mapState(['user']) // 默认用户频道列表...........................
  },
  watch: {},
  created () {
    // 生命周期 开始前调用 异步加载async 和awiat 强行等待  axio的getUserChannels封装的请求函数接收回来的结果
    this.loadChannels()
  },
  mounted () {},
  methods: {
    async loadChannels () { /* 异步加载 加载用户频道列表  里面包含 id(数字0,1,...) 和 name(推荐,html...) */
      try {
        // 设置一个变量存 用户频道列表
        let channels = []
        // 获取首页频道列表数据
        // 是否已登录 -> 是 -> 请求获取用户频道数据
        // 未登录 是否有本地存储 ->
        // 是 -> 获取使用
        // 否 -> 请求获取推荐频道数据
        // const { data: { data: { channels } } } = await getUserChannels()
        if (this.user) {
          // 已登录,请求获取线上频道数据
          const { data } = await getUserChannels()
          channels = data.data.channels
        } else {
          // 未登录--------------获取使用 本地的存储的值 getItem(key)
          const localChannels = getItem('UserChannel_Token')
          if (localChannels) {
            // 有本地频道数据,则使用
            channels = localChannels
          } else {
            // 没有本地数据,则从接口获取默认推荐频道列表
            const { data } = await getUserChannels()
            channels = data.data.channels
          }
        }
        // 将数据更新到组件中
        this.channelsArr = channels
        // console.log(channels)
      } catch (err) {
        // vant 的组件方法
        console.log(err)
        this.$toast('数据获取失败')
      }
    },
    // 子组件传值 更新添加 我的频道列表
    addUserChannelsFn (item) {
      // 执行点击推荐频道添加我的频道,
      // 原理: 子组件里有定义计算属性(自己去看,在computed里)会自动计算 全部频道=我的频道+推荐频道
      return this.channelsArr.push(item)
    },
    // 子组件传值 更新删除 我的频道列表
    delUserChannelsFn (active, index, isChannelEditShow = true) {
      // 2.0 (删除)我的频道并且(更新)推荐频道列表
      // 2.1 接收子组件点击获取的索引值,index,通过splice(删除的位置,删除的数量,[可选插入的值]) 更新数组元素
      // 2.1 判断 点击的索引值是否小于等于当前this.active,
      //      符合: 当前this.active值-1,
      // 编辑状态 index不为假,即更新的是数组操作
      if (index) {
        this.channelsArr.splice(index, 1)
        if (index <= this.active) {
          // 传入的索引 小于等于 当前的高亮的索引,让索引active值自动减一
          this.active = --this.active
        }
      } else {
        // 非编辑状态 active为真,即更新的是active高亮状态
        // 3.0 单击我的频道 对应索引的this.active高亮,并且关闭弹窗
        // 3.1 设计一个布尔变量控制 弹窗的显示状态 isChannelEditShow
        // 3.1 当子组件处于 非编辑状态的时候
        // 通过 $eimit()传入 false 控制弹窗的显示状态
        // 并且设置弹窗的默认显示状态为 true
        // 接收 参数 替换 当前active的高亮的位置
        this.active = active
        // 关闭弹窗
        this.isChannelEditShow = isChannelEditShow
      }
    }
  }

}
</script>

<style scoped lang="less">

.home-container{
  padding: 174px 0 100px;
  // 开启深度 查找
 #ellipsis /deep/ .van-nav-bar__title {
    max-width: unset;
    .search-btn{
    width: 555px;
    height: 64px;
    background-color: #5babfb;
    font-size: 28px;
    border: none;
      .van-icon{
        font-size: 32px;
      }
    }
  }
  // 开启深度 查找
  /deep/ .channel-tabs {
    // position: relative;
    .van-tabs__wrap {
      position: fixed;
      top: 92px;
      z-index:1;
      left: 0;
      right: 0;
      height: 82px;
    }
    .van-tab{
      border-right: 1px solid #edeff3;
      min-width: 200px;
      // height: 80px;
      .van-tab__text{
        font-size: 28px;
        color: #777;
      }
    }
    .van-tab--active .van-tab__text{
        color: #333;
      }
      .van-tabs__line{
        width: 31px;
        height: 6px;
        margin-bottom: 8px;
        background-color:#3296fa;
      }
    .placeholder{
    width: 66px;
    height: 82px;
    flex-shrink: 0;
    }
    .hamburger-btn{
    position: fixed;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 66px;
    height: 82px;
    background-color: #fff;
    opacity: 0.902;
      i.haian-gengduo{
        font-size: 33px;
      }
      &::before {
        content:'';
        position: absolute;
        left: 0;
        width: 2px;
        height: 100%;
        background:linear-gradient(rgba(141, 141, 141, 0.129), rgba(149, 149, 149, 0.529),rgba(190, 188, 188, 0.087)) ;
      }
    }
  }
 .van-tabs__nav--line{
  padding-bottom: 0;
  }
  .edit-channel-popup {
  padding-top: 100px;
  box-sizing: border-box;
  }
}
</style>
