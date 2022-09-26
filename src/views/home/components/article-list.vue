<template>
  <div class="article-list">
    <van-pull-refresh
    v-model="isRefreshLoading"
    :success-text="refreshSuccessText"
    :success-duration="1500"
     @refresh="onRefresh">
    <van-list
    v-model="loading"
    :finished="finished"
    finished-text="没有更多了"
    :error.sync="error"
    error-text="请求失败，点击重新加载"
    @load="onLoad"
    >
      <list-item :articleItems="list"></list-item>
    </van-list>
</van-pull-refresh>
  </div>
</template>

<script>
import { getArticle } from '@/api/article'
import ListItem from '@/components/list-item.vue'
export default {
  name: 'ArticleList',
  components: {
    ListItem

  },
  props: {
    channelsObj: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      list: [], /* 存放接收到的数据 */
      loading: false, /* 控制加载状态 */
      finished: false, /* 控制数据全部加载完成 */
      error: false, /* 是否加载失败 */
      timestamp: null, /* 请求下一页数据的时候 */
      isRefreshLoading: false, /* 下拉刷新时会触发 refresh 事件，在事件的回调函数中可以进行同步或异步操作，操作完成后将 v-model 设置为 false，表示加载完成。 */
      refreshSuccessText: '刷新成功' /* 刷新成功后的顶部提示文案 */
    }
  },
  computed: {},
  watch: {},
  created () {
  },
  mounted: {
  },
  methods: {
    async onLoad () {
      // 异步更新数据
      // 1.请求获取数据

      try {
        const { data: { data } } = await getArticle({
          channel_id: this.channelsObj.id,
          timestamp: this.timestamp || Date.now() // 时间戳,请求新的推荐数据传入当前的时间戳,请求历史推荐指定的时间戳
        })
        console.log(data)
        // console.log(this.channelsObj.id, getArticle.timestamp)
        // 2.把请求结果放到list数组中
        const { results } = data
        this.list.push(...results)
        // 3.本次数据加载完毕之后,要把加载状态设置为结束
        this.loading = false
        // 模拟错误提示
        // if (Math.random() > 0.8) {
        //   JSON.parse('dsiofjso')
        // }
        // 4.判断数据是否全部加载完成
        if (results.length) {
          // 更新获取下一页数据的时间戳
          this.timestamp = data.pre_timestamp
        } else {
          // 没有数据了,设置加载状态结束,不再触发上拉加载更多
          this.finished = true
        }
      } catch (error) {
        console.log('获取文章新闻失败' + error)
        this.loading = false /* 关闭loading效果 */
        this.error = true /* 开启错误提示 */
      }
    },
    async onRefresh () {
      // 异步更新数据
      // 1.请求获取数据
      try {
        const { data: { data } } = await getArticle({
          channel_id: this.channelsObj.id,
          timestamp: Date.now() // 上拉获取最新的文章列表
        })
        console.log(data)
        // console.log(this.channelsObj.id, getArticle.timestamp)
        // 2.把请求结果放到list数组最前面......
        const { results } = data
        this.list.unshift(...results)
        console.log(this.list)

        // 3.关闭下拉刷新的 loading 状态
        this.isRefreshLoading = false

        // 模拟错误提示
        // if (Math.random() > 0.8) {
        //   JSON.parse('dsiofjso')
        // }
        // 4.// 提示成功
        // 提示更新了多少条数据
        this.refreshSuccessText = `加载成功,本次更新了${results.length}条数据`
      } catch (err) {
        console.log(err)
        this.isRefreshLoading = false /* 关闭loading效果 */
        this.refreshSuccessText = '加载失败'
      }
    }
  }
}
</script>

<style scoped lang="less">
.article-list /deep/ {

  height: 79vh;
  overflow-y: auto;
  // .van-pull-refresh {
  //  height: auto;
  //    .van-pull-refresh__track{
  //     height: 79vh;
  //   }
  // }
}
</style>
