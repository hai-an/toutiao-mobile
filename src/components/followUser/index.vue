<template>
      <van-button
           v-if="iSFollowed"
           @click="onFollow"
           :loading="loading"
            type="info"
            color="#3296fa"
            round
            size="small"
            icon="plus"
          >关注</van-button>

          <van-button
            v-else
            @click="onFollow"
            :loading="loading"
            round
            size="small"
          >已关注</van-button>
</template>

<script>
import { addFollow, deleteFollow } from '@/api/user'
export default {
  name: 'FollowUser',
  model: {
    prop: 'iSFollowed',
    event: 'updated_is_Followed'
  },
  props: {
    iSFollowed: {
      type: Boolean,
      required: true
    },
    userId: {
      type: [Number, String],
      required: true
    }
  },
  data () {
    return {
      loading: false
    }
  },
  methods: {
    async onFollow () {
      this.loading = true // 展示关注按钮的 loading 状态
      try {
        if (this.iSFollowed) {
          // 已关注,取消关注
          await deleteFollow(this.userId)
          console.log(this.userId)
        } else {
        // 没有关注,添加关注
          await addFollow(this.userId)
        }
        // 点击关注(更新视图) 取反(子传父)
        // this.iSFollowed = !this.iSFollowed
        this.$emit('updated_is_Followed', !this.iSFollowed)
      } catch (err) {
        console.log(err)

        let message = '操作失败,请重试!'
        if (err.response && err.response.status === 400) {
          message = '你不能关注你自己!'
        }
        this.$toast(message)
      }
      this.loading = false // 关闭关注按钮的 loading 状态
    }
  }
}
</script>

<style>

</style>
