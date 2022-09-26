<template>
  <van-button
    :icon="value ? 'star' : 'star-o'"
    @click="collectFn"
    :class="{collected:value}"
  >
  </van-button>
</template>

<script>
import { addCollect, deleteCollect } from '@/api/article'
export default {
  name: 'CollectArticle',
  // model: {
  //   props: value,
  //   event: true
  // },
  components: {},
  props: {
    value: {
      type: Boolean,
      required: true
    },
    collectId: { // 收藏id
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
    async collectFn () {
      this.loading = true
      try {
        // 已收藏,取消收藏
        if (this.value) {
          await deleteCollect(this.collectId)
        } else {
          // 未收藏,添加收藏
          await addCollect(this.collectId)
        }

        // 更新视图
        this.$emit('input', !this.value)
        // 成功提示
        this.$toast(!this.value ? '收藏成功' : '取消收藏')
      } catch (err) {
        this.$toast('数据加载失败,请重试!')
      }
      this.loading = false
    }
  }
}
</script>

<style scoped lang="less">
.collected{
  .van-icon{
    color:#ffa500;
  }
}
</style>
