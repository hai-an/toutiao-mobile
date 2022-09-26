<template>
<div class='comment-reply'>
  <van-nav-bar
    :title="comment.reply_count > 0 ? `${comment.reply_count}条回复` : '暂无回复'"
  >
  <!-- 关闭图标 -->
    <van-icon
      slot="left"
      name="cross"
      @click="$emit('close')"
    />
  <!-- /关闭图标 -->

</van-nav-bar>
 <div id="sroll-wrap">
    <!-- 当前回复 -->
    <CommentItem
    :comment="comment"
    />
    <!-- /当前回复 -->

    <!-- 全部回复评论 -->
    <van-cell title="全部评论" />
    <!-- /全部回复评论 -->

    <!-- 评论的回复列表 -->
    <CommentList
      :type="'c'"
      :source="comment.com_id"
      @comment-list="updateCommentList"
    />
    <!-- <CommentList
      :type="'c'"
      :source="comment.com_id"
      :list="commentList"
      @comment-list="updateCommentList"
    /> -->
    <!-- /评论的回复列表 -->
 </div>

  <!-- 底部区域 -->
  <div id="post-warp">
    <van-button
      id="post-btn"
      size="small"
      round
      @click="isPostShow = true"
    >写评论</van-button>
    <!-- /底部区域 -->

    <!--回复评论 弹出层 -->
    <van-popup v-model="isPostShow" position="bottom">
      <CommentPost
      :target="comment.com_id"
      @post-success="onPostSuccess"
      />
    </van-popup>
    <!-- /回复评论 弹出层 -->

  </div>

</div>
</template>

<script>
import CommentItem from './comment-item.vue'
import CommentList from './comment-list.vue'
import CommentPost from './comment-post.vue'

export default {
  name: 'CommentReply',
  components: {
    CommentItem,
    CommentList,
    CommentPost
  },
  props: {
    comment: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      commentList: [], // 发布评论列表
      isPostShow: false
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    updateCommentList (val) {
      this.commentList = val
    },
    onPostSuccess (data) {
      console.log(data)
      // 更新回复的数量
      // this.comment.reply_count++
      this.$emit('udpate-reply_count', this.comment.reply_count)
      // 关闭弹层
      this.isPostShow = false
      // 将最新回复的内容展示到列表的顶部
      this.commentList.unshift(data.new_obj)
    }
  }
}
</script>

<style scoped lang="less">
   /deep/ #sroll-wrap{
    position: fixed;
    top: 92px;
    left: 0;
    right: 0;
    bottom: 88px;
    overflow-y: auto;
  }
  /deep/ #post-warp {
    position: fixed;
    width: 750px;
    bottom: 0;
    left: 0;
    right: 0;
    height: 88px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #ffffff;
    border-top: 1px solid #d8d8d8;
    /deep/ #post-btn{
      width: 60%;
    }
  }
</style>
