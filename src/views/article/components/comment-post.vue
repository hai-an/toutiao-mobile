<template>
<div class='comment-post'>
  <van-field
    class="post-field"
    v-model.trim="message"
    rows="2"
    autosize
    type="textarea"
    maxlength="50"
    placeholder="请输入留言"
    show-word-limit
  />
  <van-button
    class="post-btn"
    @click="onPost"
    :disabled="!message.length"
  >发布</van-button>
</div>
</template>

<script>
import { addComment } from '@/api/comment'

export default {
  name: 'CommentPost',
  components: {},
  inject: {
    articleId: {
      type: [Number, String],
      default: null
    }
  },
  props: {
    target: {
      type: [Number, String],
      required: true
    }
  },
  data () {
    return {
      message: '' // 发布的评论的内容
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    async onPost () {
      try {
        // 1.展示发布中
        this.$toast.loading({
          message: '发布中...',
          forbidClick: 'true'
        })
        const { data } = await addComment({
          target: this.target, // 评论文章即为文章id,对评论进行 回复评论id
          content: this.message, // 评论内容
          art_id: this.articleId // 对文章进行评论,不需要传;对评论内容发表回复时,需要传递此参数,所属文章id
        })
        console.log(data)
        // 关闭弹出层(父)
        // 将发布内容显示到列表顶部(父)
        // 清空文本框
        this.message = ''
        this.$emit('post-success', data.data)
        console.log(data.data)
        this.$toast.success('发布成功!')
      } catch (err) {
        this.$toast.fail('发布失败!')
      }
    }
  }
}
</script>

<style scoped lang="less">
  .comment-post{
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-height:250px;
    height: auto;
    .post-btn{
      color: skyblue;
      .van-button__content{
      width: 60px;
    }
    }
    .post-field{
      border: 1px solid rgb(199, 197, 197);
    }
  }
</style>
