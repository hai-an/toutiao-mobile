<template>
  <div class="channel-edit">
    <van-cell title="我的频道" :border="false">
      <!-- 频道编辑 -->
      <!-- 点击编辑按钮,isEditShow取反,为真 文字是 完成,为假 文字是 编辑 ;开始默认为 false不显示  -->
      <van-button
      type="danger"
      plain round size="mini"
      v-model="isEditShow"
      @click="isEditShow=!isEditShow"
      >{{isEditShow?'完成':'编辑'}}</van-button>
    </van-cell>
    <van-grid :gutter="10" class="myGrid">
      <van-grid-item
        class="channel-item"
        v-for="( channel, index ) in userChannels"
        :key="index"
        @click='onDelChannel(index,channel)'
      >
      <!-- 频道 文字 -->
        <span slot="text"
        class="text-wrappy"
        :class="{active:index===active}"
        >{{channel.name}}</span>
      <!-- x 图标 -->
      <!-- 固定频道 id=0,索引为0的 '"推荐频道"'  -->
      <!-- 通过数组的包含方法 arr.inchludes();
          让v-show的显示条件增加限制,isEditShow=true 并且 不包含   -->
      <van-icon
        slot="icon"
        v-show="isEditShow && !fiexChannels.includes(channel.id)"
        size="14"
        name="close">
      </van-icon>
      </van-grid-item>
    </van-grid>

    <van-cell title="频道推荐" :border="false"></van-cell>
    <van-grid direction="horizontal" :gutter="10" class="editGrid">
      <van-grid-item
        class="channel-item"
        v-for="channel in addRecommendChannelFn"
        :key="channel.id"
        @click="onAddChannel(channel)"
      >
      <van-icon slot="icon" name="plus"></van-icon>
      <van-tag slot="text" name="plus">{{channel.name}}</van-tag>
      </van-grid-item>
    </van-grid>
  </div>
</template>

<script>

// 导入 获取"全部频道"列表的api,里面封装了 axios.get()方法,作为单独的js文件,方便管理
import { getAllChannels, addUserChannel, deleteUserChannel } from '@/api/channel'
import { mapState } from 'vuex'
import { setItem } from '@/utils/storage'
export default {
  name: 'ChannelEdit',
  components: {},
  props: {
    userChannels: { /* 父传子 我的频道列表 */
      type: Array,
      required: true
    },
    active: { /* 这个是子组件的高亮状态,跟父组件的同名,接收父组件的高亮索引值,让对应的我的频道标签高亮显示(字体变红) */
      type: Number,
      required: true
    }
  },
  data () {
    return {
      allChannel: [], /* 全部频道列表 */
      isEditShow: false, /* 控制 编辑状态的 x 号 */
      fiexChannels: [0] /*  固定频道,不允许删除,注意区别 'let arr = new Array(0)此为长度为1的数组'  */
    }
  },
  computed: {
    ...mapState(['user']),
    // 4.定义计算属性把 推荐频道列表 筛选出来->
    // 所有频道 - 我的频道 = 推荐频道
    addRecommendChannelFn () {
      return this.allChannel.filter(channels => {
        // findIndex 返回 -1 === -1 说明没有,添加的新数组里
        return this.userChannels.findIndex(userChannel => {
          // 此函数执行一次,找到就停止,找不到返回-1
          return userChannel.id === channels.id
        }) === -1
      })
    }
  },
  watch: {},
  created () {
    // 1.开始获取 全部频道列表
    this.getAllChannelFn()
  },
  mounted () {},
  methods: {
  // 2.定义获取全部频道列表
    async getAllChannelFn () {
      try {
        const { data: { data } } = await getAllChannels()
        console.log(data)
        // 3.添加到全部全部频道列表
        this.allChannel = data.channels
      } catch (error) {
        console.log(error)
        this.$toast('获取所有频道数据失败')
      }
    },
    // 三,获取用户添加频道的请求方法
    // 三,1 封装添加频道的请求方法
    // 子组件向父组件 传值 更新(添加到)我的频道
    async onAddChannel (channel) { // channel->数组value
      // 向父组件传值,更新数组 我的频道列表
      this.$emit('addUserChannels', channel)
      // 四. 添加 用户频道项 数据持久化--------------------
      // user为null就是未登录状态
      if (this.user) {
        try {
          // 已登录
          await addUserChannel([{
            id: channel.id, // 频道 id
            seq: this.userChannels.length // 频道的序号
          }])
        } catch (err) {
          console.log(err)
          this.$toast('添加频道失败')
        }
      } else {
        // 未登录,数据存储到本地
        setItem('UserChannel_Token', this.userChannels)
      }
    },
    // 子组件向父组件 激活指定高亮,指定删除 频道
    async onDelChannel (index, channel) {
      // 向父组件 传高亮active,传我的频道 channel.id
      if (!this.isEditShow) {
        // 非编辑状态 false 关闭弹窗,
        this.$emit('delUserChannels', index, null, false)
      } else {
        // 编辑状态 true 显示弹窗
        this.$emit('delUserChannels', this.active, index, true)
        // 五.数据持久化- 指定删除用户频道项-----------------
        if (this.user) {
          try {
          // 已登录,将数据存储到线上
            await deleteUserChannel(channel.id)
          } catch (err) {
            console.log(err)
            this.$toast('删除频道失败,请稍后再试')
          }
        } else {
        // 未登录,数据存储到本地
          setItem('UserChannel_Token', this.userChannels)
        }
      }
    }
  }
}
</script>

<style scoped lang="less">
  .channel-edit{
    // height: 86px;
   /deep/ .myGrid{
      .active{
        color:red !important;
      }
        span.text-wrappy{
          font-size: 12px;
      }
      .van-grid-item__icon-wrapper {
        position: absolute;
        top: -30px;
        right: -10px;
        color: #fc5430;
        z-index: 3;
      }
    }
    .van-grid-item__content{
      width: 80px;
      height: 43px;

      background-color: #f5f5f6;
      .van-grid-item__text{
        color: #222;
        font-size: 24px;
      }
    }
   /deep/ .editGrid{
    .van-grid-item__content{
      width: 162px;
      display: flex;
      justify-content: space-between;
       .van-icon-plus {
      font-size: 12px;
      }
      .van-grid-item__text{
        color: #222;
        font-size: 24px;
        margin-left: 10px;
      }
      .van-grid-item__icon-wrapper{
        display: flex;
        margin-right: 5px;
      }
      .van-tag--default {
     background-color: #ffffff;
      color: #222;
      width:388px;
      height: 80px;
      font-size: 12px;
      padding: 0;
      }
    }

    }
  }
</style>
