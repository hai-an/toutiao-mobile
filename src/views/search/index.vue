<template>
  <div class="search-container">
    <!-- 顶部搜索栏 -->
    <form action="/" class="search-form">
      <!-- Tips: 在 van-search 外层增加form 标签,且action 不为空,即可在 iso 输入法中显示搜索按钮 -->
      <van-search
        v-model="searchText"
        show-action
        background="#2A92FF"
        placeholder="请输入搜索关键词"
        @search="onSearch"
        @cancel="onCancel"
        @focus="isResultShow = false"
      />
    </form>
    <!-- /顶部搜索栏 -->
        <!--搜索结果  -->
    <SearchResult
    v-if="isResultShow"
    :searchText="searchText">
    </SearchResult>
    <!--/搜索结果  -->

    <!-- 联想建议 -->
    <SearchSuggestion
    v-else-if="searchText"
    :searchText="searchText"
    @search="onSearch"
    ></SearchSuggestion>
    <!-- /联想建议 -->
    <!-- 搜索历史 -->
    <SearchHistory v-else
    :searchHistories="searchHistories"
    @searchHistories="searchHistoriesFn"
    @clearSearchHistory="searchHistories=[]"
    @search="onSearch"></SearchHistory>
    <!-- /搜索历史 -->

  </div>
</template>

<script>
import SearchHistory from './components/search-history.vue'
import SearchSuggestion from './components/search-suggestion.vue'
import SearchResult from './components/search-result.vue'
import { setItem, getItem } from '@/utils/storage'
// 1.让一个布尔变量控制 搜索历史的显示,另外一个变量控制搜索栏的内容
// 2.开始进入搜索界面 默认显示  搜索历史的显示
// 3.输入框的获得焦点,激活 联想建议 的显示,关闭搜索历史的显示
// 4.回车键搜索后,  关闭 联想建议 的显示, 显示 搜索的结果
export default {
  name: 'SearchPage',
  components: {
    SearchHistory,
    SearchSuggestion,
    SearchResult
  },
  props: {},
  data () {
    return {
      searchText: '', // 搜索框的文
      isResultShow: false, // 控制 搜索结果--> 显示
      searchHistories: getItem('TOUTIAO_SEARCH_HISTORY') || [] // 搜索历史
    }
  },
  computed: {},
  watch: {
    searchHistories (val) {
      setItem('TOUTIAO_SEARCH_HISTORY', val)
    }
  },
  created () {},
  methods: {
    onSearch (val) { // 回车搜索
      // 更新文本框内容
      this.searchText = val

      // 存储搜索历史记录
      // 要求: 不要有重复历史记录,最新的排在最前面
      const index = this.searchHistories.indexOf(val)
      if (index !== -1) {
        this.searchHistories.splice(index, 1)
      }
      this.searchHistories.unshift(val)

      // 显示 搜索结果
      this.isResultShow = true
    },
    onCancel () { // 点击取消键
      this.$router.back()
    },
    onFocus () { // 搜索框获得焦点
      this.isResultShow = false
    },
    searchHistoriesFn (index) {
      this.searchHistories.splice(index, 1)
    }
  }
}
</script>

<style scoped lang="less">
  .search-container{
    padding-top: 120px;
    .van-search__action{
      color:#fff;
    }
    .search-form{
      position: fixed;
      top: 0;
      left: 0;
      z-index: 1;
      width: 100vw;
      // height: ;
    }
  }
</style>
