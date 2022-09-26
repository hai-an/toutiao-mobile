<template>
  <van-button
    :icon="value === 1 ? 'good-job':'good-job-o'"
    @click="liekedFn"
    :class="{lieked: value === 1}"
  >
  </van-button>
</template>

<script>
import { addLike, deleteLike } from '@/api/article'
export default {
  name: 'LikeArticle',
  // model: {
  //   props: value,
  //   event: true
  // },
  components: {},
  props: {
    value: {
      type: Number,
      required: true
    },
    articleId: { // 收藏id
      type: [Number, String],
      required: true
    }
  },
  data () {
    return {
      loading: false // 加载状态
    }
  },
  computed: {},
  watch: {},
  created: {},
  mounted: {},
  methods: {
    async liekedFn () {
      this.loading = true
      try {
        let status = -1
        // 已点赞,取消点赞
        if (this.value === 1) {
          await deleteLike(this.articleId)
        } else {
          // 未点赞,添加点赞
          await addLike(this.articleId)
          status = 1
        }

        // 更新视图
        this.$emit('input', status)

        // 成功提示
        this.$toast.success(status === 1 ? '点赞成功' : '取消点赞')
      } catch (err) {
        this.$toast('数据加载失败,请重试!')
      }
      this.loading = false
    }
  }
}
</script>

<style scoped lang="less">
.lieked{
  .van-icon{
    color:#f81612;
  }
}
</style>
