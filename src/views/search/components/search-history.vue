<template>
  <div class="search-history">
    <van-cell title="搜索历史">
     <div v-if="isDeleteShow">
      <span @click="$emit('clear-search-history')">全部删除</span>
      &nbsp;&nbsp; &nbsp;&nbsp;
      <span @click="isDeleteShow=false">完成</span>
     </div>
      <van-icon v-else name="delete" @click="isDeleteShow=!isDeleteShow" />
    </van-cell>
    <van-cell :title="item"
    v-for="(item, index) in searchHistories"
    :key="index"
    @click="onSearchItemClick(item, index)"
    >
      <van-icon v-if="isDeleteShow" name="close" />
    </van-cell>
  </div>
</template>
<script>
export default {
  name: 'SearchHistory',
  components: {},
  props: {
    searchHistories: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      isDeleteShow: false // 默认非删除 状态
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    onSearchItemClick (item, index) {
      if (this.isDeleteShow) {
        // 删除状态=> 点击删除操作
        // this.searchHistories.splice(index, 1)
        // this.searchHistories.splice(index, 1)
        this.$emit('searchHistories', index)
        // this.$emit('updateSearchHistories', index)
      } else {
        // 非删除状态=> 点击搜索操作
        this.$emit('search', item)
      }
    }
  }
}
</script>

<style scoped lang="less"></style>
