<template>
<div class='comment-list'>
  <van-list
  v-model="loading"
  :finished="finished"
  finished-text="没有更多了"
  :error="error"
  error-text="加载失败,请重试!"
  @load="onLoad"
  :immediate-check="false"
>
  <!-- <van-cell
  v-for="(item,index) in list"
   :key="index"
    :title="item" /> -->
    <!-- 评论项 -->
    <CommentItem
      v-for="(item,index) in myList"
      :key="index"
      :comment="item"
      @delete-like_count="item.like_count--"
      @add-like_count="item.like_count++"
      @update-is_liking="item.is_liking = !item.is_liking"
      @reply-click="$emit('reply-click', $event)"
    />
    <!-- /评论项 -->
  </van-list>
</div>
</template>

<script>
import { getComments } from '@/api/comment'
import CommentItem from './comment-item.vue'
export default {
  name: 'CommentList',
  components: { CommentItem },
  props: {
    source: {
      type: [Number, String, Object],
      required: true
    },
    type: {
      type: String,
      // 自定义 Prop 数据验证
      validator (value) {
        return ['a', 'c'].includes(value)
      },
      default: 'a'
    },
    list: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      // list: [],
      myList: [],
      loading: false,
      finished: false,
      offset: null, // 获取下一页数据的标记
      limit: 10, // 获取每页评论数量
      error: false
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loading = true
    this.onLoad()
  },
  mounted () {},
  methods: {
    async onLoad () {
    //  1.请求获取数据
      try {
        const { data } = await getComments({
          type: this.type, // 评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
          source: this.source, // 源id，文章id或评论id
          offset: this.offset, // 获取评论数据的偏移量,值为评论id (获取评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据)
          limit: this.limit //  (获取的评论数据个数，不传表示采用后端服务设定的默认每页数据量)
        })
        console.log(data)
        // 2.将数据添加到列表中
        const { results } = data.data
        console.log(this.list, results)
        this.myList.push(...this.list, ...results)
        // this.list.push(...results)
        // this.list.push(...results)
        // 把文章评论的总数量传递到外部
        this.$emit('onload-success', data.data.total_count)

        // 3.将loading 设置为 false
        this.loading = false
        // 4.判断是否还有数据
        if (results.length) {
          //   有就更新获取下一页的数据页码
          this.offset = data.data.last_id
        } else {
          //  没有就将finished 设置结束
          this.finished = true
        }
      } catch (err) {
        this.error = true
        this.loading = false
      }
      console.log('comment-list-list:', this.list)
      // 传值 评论列表的数据 给父组件
      this.$emit('comment-list', this.myList)
    }
  }
}
</script>

<style scoped></style>
