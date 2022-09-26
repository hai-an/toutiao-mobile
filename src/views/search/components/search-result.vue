<template>
  <div class="search-result">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell
       v-for="(obj,index) in list"
       :key="index"
       :title="obj.title" />
    </van-list>
  </div>
</template>
<script>

import { getSearchResult } from '@/api/search'

export default {
  name: 'SearchResult',
  components: {},
  props: {
    searchText: { // 接收父组件的 input 的文本框的值
      type: String,
      required: true
    }
  },
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      page: 1, // 页码一
      perPage: 20 // 请求20条数据
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    async onLoad () {
      // 异步更新数据
      // 1.axios 获取数据
      const { data } = await getSearchResult({
        page: this.page, // 页码
        per_page: this.perPage, // 每页大小数量
        q: this.searchText // 搜索关键字
      })
      // 2.将数据添加到列表中
      const { results } = data.data
      this.list.push(...results)
      // 3.加载状态结束
      this.loading = false

      // 4.判断 数据是否全部加载完成
      if (results.length) {
        this.page++ // 更新下一页数据的页码
      } else {
        this.finished = true // 没有数据,设置加载状态结束,不再onLoad
      }
    }
  }
}
</script>

<style scoped lang="less"></style>
