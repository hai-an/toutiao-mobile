<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      left-arrow
      title="黑马头条"
      @click-left="$router.back()"
    >
   </van-nav-bar>
    <!-- /导航栏 -->

    <div class="main-wrap">
      <!-- 加载中 -->
      <div v-if="loading" class="loading-wrap">
        <van-loading
          color="#3296fa"
          vertical
        >加载中</van-loading>
      </div>
      <!-- /加载中 -->

      <!-- 加载完成-文章详情 -->
      <div v-else-if="article.title" class="article-detail">
        <!-- 文章标题 -->
        <h1 class="article-title">{{article.title}}</h1>
        <!-- /文章标题 -->

        <!-- 用户信息 -->
        <van-cell class="user-info" center :border="false">
          <van-image
            class="avatar"
            slot="icon"
            round
            fit="cover"
            :src="article.aut_photo"
          />
          <div slot="title" class="user-name">{{article.aut_name}}</div>
          <div slot="label" class="publish-date">{{article.pubdate | relativeTime}}</div>

          <!-- 用户关注按钮 -->
          <!--
          模板中的 $event 是事件参数
          当我们传递给子组件的数据既要使用还要修改.
          传递: props
            :iSFollowed="article.is_followed"
          修改: 自定义事件
            @updated_is_Followed="article.is_followed = $event"
          简写方式: 在组件上使用 v-model
            value="article.is_followed"
            @input="article.is_followed = $event"
          -->
          <FollowUser
          v-model="article.is_followed"
          :userId="article.aut_id"
          class="follow-btn"

           ></FollowUser>
          <!-- /用户关注按钮 -->

        </van-cell>
          <!-- /用户关注按钮 -->

          <!-- <van-button
           v-if="article.is_followed"
           @click="onFollow"
           :loading="followLoading"
            class="follow-btn"
            type="info"
            color="#3296fa"
            round
            size="small"
            icon="plus"
          >关注</van-button>
          <van-button
            v-else
            @click="onFollow"
            :loading="followLoading"
            class="follow-btn"
            round
            size="small"
          >已关注</van-button> -->

        <!-- /用户信息 -->

        <!-- 文章内容 -->
        <div
         class="article-content markdown-body"
          v-html="article.content"
          ref="article-content"></div>
        <van-divider>正文结束</van-divider>

      <!-- 文章评论列表 -->
        <comment-list
        :source="article.art_id"
        @comment-list="updateList"
        @onload-success="updateCount"
        @reply-click="onReplyClick" />
        <!-- <comment-list
        :source="article.art_id"
        @comment-list="updateList"
        @onload-success="updateCount"
        @reply-click="onReplyClick" /> -->
      <!-- /文章评论列表 -->

      <!-- 底部区域 -->
        <div class="article-bottom">
          <van-button
          class="comment-btn"
          type="default"
          round
          size="small"
          @click="isPostShow = true"
        >写评论</van-button>
          <van-icon
          name="comment-o"
          :info="totalCommentCount"
          class="btn-item"
        />
        <!-- <van-icon
          color="#777"
          name="star-o"
        /> -->

        <!-- 收藏图标------------------------------ -->
        <CollectArticle
        class="btn-item"
        v-model="article.is_collected"
        :collectId="article.art_id"
        ></CollectArticle>
        <!-- /收藏图标 -->

        <!-- <van-icon
          class="btn-item"
          name="good-job-o"
        /> -->
        <!-- 点赞图标 -->
        <LikeArticle
        class="btn-item"
        v-model="article.attitude"
        :articleId="article.art_id"
        ></LikeArticle>
        <!-- /点赞图标 -->

        <van-icon name="share"  class="btn-item"></van-icon>
      </div>
      <!-- /底部区域 -->

      <!--  发布评论  -->
      <van-popup v-model="isPostShow" position="bottom"  >

        <!-- 评论内容 -->
        <CommentPost
        :target="article.art_id"
        @post-success="onPostSuccess"
        />
        <!-- /评论内容 -->

      </van-popup>
      <!--  /发布评论  -->
      </div>
      <!-- /加载完成-文章详情 -->

      <!-- 加载失败：404 -->
      <div v-else-if="errStatus===404" class="error-wrap">
        <van-icon name="failure" />
        <p class="text">该资源不存在或已删除！</p>
      </div>
      <!-- /加载失败：404 -->

      <!-- 加载失败：其它未知错误（例如网络原因或服务端异常） -->
      <div v-else class="error-wrap">
        <van-icon name="failure" />
        <p class="text">内容加载失败！</p>
        <van-button class="retry-btn"
        @click="loadArticle">点击重试</van-button>
      </div>
      <!-- /加载失败：其它未知错误（例如网络原因或服务端异常） -->
    </div>
    <!-- 评论回复 -->
    <van-popup v-model="isRelyShow" position="bottom" style="height:100%"  >
      <CommentReply
        v-if="isRelyShow"
        :comment="currentComment"
        @close="isRelyShow = false"
        @udpate-reply_count="currentComment.reply_count++"
      />
    </van-popup>
  <!-- /评论回复 -->
  </div>
</template>

<script>
import { getArticleById } from '@/api/article'
import { ImagePreview } from 'vant'
// 导入关注用户的功能的 按钮 组件
import FollowUser from '@/components/followUser/index.vue'
import CollectArticle from '@/components/collect-article/index.vue'
import LikeArticle from '@/components/like-article/index.vue'
import CommentList from './components/comment-list.vue'
import CommentPost from './components/comment-post.vue'
import CommentReply from './components/comment-reply.vue'

export default {
  name: 'ArticleIndex',
  components: { FollowUser, CollectArticle, LikeArticle, CommentList, CommentPost, CommentReply },
  props: {
    articleId: {
      type: [Number, String, Object],
      required: true
    }
  },
  // 给所有的后代组件提供数据
  //  注意:不要滥用
  provide: function () {
    return {
      articleId: this.articleId
    }
  },
  data () {
    return {
      article: {}, // 文章详情
      loading: true, // 加载中loading 状态
      errStatus: '', // 失败的状态码
      followLoading: false, // 关注状态
      totalCommentCount: 0, // 评论数量
      isPostShow: false, // 控制评论弹出层显示
      commentList: [], // 评论列表
      isRelyShow: false, // 控制 回复评论 的显示状态
      currentComment: {} // 当前评论回复项
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadArticle()
  },
  mounted () {},
  methods: {
    updateList (val) {
      console.log(val)
      this.commentList = val
    },
    updateCount (val) {
      // this.totalCommentCount=val
      // console.log('here-totalCount:', val)
      this.totalCommentCount = val
    },
    async loadArticle () {
      //  展示 loading 加载中
      this.loading = true
      try {
        const { data } = await getArticleById(this.articleId)
        // console.log(data)
        // 模拟失败
        if (Math.random() > 0.8) {
          JSON.parse('dsiofjso0i0i0ijojojojo')
        }

        // 添加数据到数据article里
        this.article = data.data

        // 初始化图片点击预览
        // this.$nextTick(() => {
        //   console.log(this.$refs['article-content'])
        // })
        setTimeout(() => {
          // console.log(this.$refs['article-content'])
          this.previewImage()
        }, 0)
        // 请求成功,关闭 loading
        // this.loading = false
      } catch (err) {
        if (err.response && err.response.status === 404) {
          this.errStatus = 404
        }
        console.log('获取数据失败', err)
      }
      //  无论成功还是失败,都关闭 loading
      this.loading = false
    },

    previewImage () {
      // 得到所有的 img 节点
      const articleContent = this.$refs['article-content']
      const imgs = articleContent.querySelectorAll('img')
      console.log(imgs)

      // 设置保存 所有图片的 数组
      const images = []

      // 遍历 imgs 数组元素
      imgs.forEach((img, index) => {
        // 添加到 images 数组中
        images.push(img.src)
        // 点击 图片 触发图片预览事件
        img.onclick = () => {
          ImagePreview({
            images, // 预览的图片地址数组
            startPosition: index // 起始位置,从 0 开始
          })
        }
      })
    },
    onPostSuccess (data) { // 评论发布成功
      // 关闭弹出层
      this.isPostShow = false
      // 将发布内容显示到列表顶部(父)
      this.commentList.unshift(data.new_obj)
    },

    onReplyClick (comment) {
      this.currentComment = comment
      // 点击显示 回复弹出层
      this.isRelyShow = true
    }
  }
}
</script>

<style scoped lang="less">
@import './github-markdown.css';
.article-container {
  .main-wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 92px;
    bottom: 88px;
    overflow-y: scroll;
    background-color: #fff;
  }
  .article-detail {
    .article-title {
      font-size: 40px;
      padding: 50px 32px;
      margin: 0;
      color: #3a3a3a;
    }

    .user-info {
      padding: 0 32px;
      .avatar {
        width: 70px;
        height: 70px;
        margin-right: 17px;
      }
      .van-cell__label {
        margin-top: 0;
      }
      .user-name {
        font-size: 24px;
        color: #3a3a3a;
      }
      .publish-date {
        font-size: 23px;
        color: #b7b7b7;
      }
      .follow-btn {
        width: 170px;
        height: 58px;
      }
    }

    .article-content {
      padding: 55px 32px;
      /deep/ p {
        text-align: justify;
      }
    }
  }

  .loading-wrap {
    padding: 200px 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
  }

  .error-wrap {
    padding: 200px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    .van-icon {
      font-size: 122px;
      color: #b4b4b4;
    }
    .text {
      font-size: 30px;
      color: #666666;
      margin: 33px 0 46px;
    }
    .retry-btn {
      width: 280px;
      height: 70px;
      line-height: 70px;
      border: 1px solid #c3c3c3;
      font-size: 30px;
      color: #666666;
    }
  }

  .article-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: 88px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .comment-btn {
      width: 282px;
      height: 46px;
      border: 2px solid #eeeeee;
      font-size: 30px;
      line-height: 46px;
      color: #a7a7a7;
    }
  /deep/  .van-icon {
      font-size: 40px;
      .van-info {
        font-size: 16px;
        background-color: #e22829;
      }
    }
    .btn-item {
      border:none;
      padding: 0;
      height: 40px;
      line-height: 40px;
      color: #777;
    }
    .collect-btn--collected{
      color:#ffa500;
    }
    .collect-btn--liked{
      color:#e5645f;
    }
  }
}
</style>
