<template>
  <van-cell-group>
    <!-- to:
      '/article/'+item.art_id
      `/article/${item.art_id}`
    -->
    <van-cell  class="list-item"
     v-for="(item,ind) in articleItems" :key="ind"
     :to="{
        // 根据路由名称进行跳转
        name:'article',
        // 传递路由动态参数
        params:{
          // 属性名: 路由路径中设计的动态参数名称
          articleId: item.art_id
        }
      }"
     >
      <!-- 左边大盒子--------------------------------------------------- -->
      <div class="left-wrap">
        <!-- 文章标题 -->
        <div slot="title" class="title van-multi-ellipsis--l2">{{item.title}}</div>
        <!-- v-if 三张图片 -->
        <div class="third-avetor" v-if="item.cover.type===3">
        <van-image
        v-for="(img,ind) in item.cover.images"
        :key="ind"
        class="avetor"
        slot="right-icon"
        fit="cover"
        :src="img"
        />
        </div>
        <!-- 左下角 作者名字,评论人数,时间 -->
        <div slot="label" class="label">
            <span>{{item.aut_name}}</span>
            <span>{{item.comm_count}}评论</span>
            <span>{{item.pubdate | relativeTime}}</span>
        </div>
      </div>
      <!-- 右边 大图片 -->
      <!-- else 单张图片------------------------------------------------------------ -->
      <van-image
        v-if="item.cover.type===1"
        class="avetor"
        slot="right-icon"
        fit="cover"
        :src="item.cover.images[0]"
      />
    </van-cell>
  </van-cell-group>
</template>

<script>
export default {
  name: 'ListItem',
  components: {
  },
  props: {
    articleItems: {
      type: Array,
      required: true
    }
  },
  data () {
    return {}
  },
  computed: {},
  watch: {
    articleItems () {
      console.log(this.articleItems)
    }
  },
  created () {},
  mounted () {},
  methods: {}
}
</script>

<style scoped lang="less">
 /deep/ .list-item{
  display: flex;
  .left-wrap{
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-content: space-between;
  }
  .title{
    flex:1;
        font-size: 28px;
        color: #3a3a3a;
      }
    .label{
        span{
          color: #b4b4b4;
          font-size: 12px;
          margin-right: 18px;
        }
    }

    .avetor{
      width: 232px;
      height: 146px;
      padding: 0 20px;
    }
    .third-avetor{
      display: flex;
      justify-content: space-between;
      .avetor{
        width: 33%;
        padding: 12px 0;
      }
    }
  }
</style>
