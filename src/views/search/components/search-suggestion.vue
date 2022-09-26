<template>
 <div class="search-suggestion">
    <van-cell
      v-show="text!==null"
      icon="search"
      v-for="(text,index) in suggestions"
      :key="index"
      @click="$emit('search',text)"
      >
    <span slot="title" v-html="heightlight(text)"></span>
    </van-cell>
  </div>
</template>
<script>
import { getSearchSuggestion } from '@/api/search'

//  按需导入 防抖函数
import { debounce } from 'lodash'
export default {
  name: 'SearchSuggestion',
  components: {},
  props: {
    searchText: {
      type: String, // 类型字符串
      required: true // 是否必须:必须

    }
  },
  data () {
    return {
      suggestions: [] // 联想建议列表
      // htmlStr: 'hell<span class="active">word</span>' // 单独设置高亮标签
    }
  },
  computed: {},
  watch: {
    searchText: {
      // 当 searchText 发生改变的时候就会调用 handler 函数
      // 注意: hander 函数名称是固定的
      // 参数1:改变后的  新值
      // 参数2:改变前的  旧值
      // debounce 函数
      // 参数1: 函数
      // 参数2: 防抖时间
      // 返回值: 防抖之后的函数,和参数1功能一样
      // 3. 模板绑定
      handler: debounce(function (newVal, oldVal) {
        console.log('newVal 和 oldVal:', newVal, oldVal) // 打印变化 新 / 旧 的value值
        this.SearchSuggestionFn(newVal)
      }, 500),
      immediate: true // 该回调将会在侦听开始之后立即调用
    }
  },
  created () {},
  mounted () {},
  methods: {
    async SearchSuggestionFn (q) {
      try {
        // 1.请求获取数据
        const { data } = await getSearchSuggestion(q)
        // console.log(data)
        // 2.将数据添加到组件实例中
        this.suggestions = data.data.options
      } catch (err) {
        this.$toast('获取失败' + err)
      }
    },
    heightlight (searchResText) {
      // 正则表达式中 /searchContent/ 一切的内容都会当做字符串使用
      // 可以使用 new RegExp的方式,参数1:字符串,不需要加 // 参数2:匹配模式,g全局,i忽略大小写
      /*  const highlightStr = `<span class="active"> ${this.searchText} </span>`
      const reg = new RegExp(this.searchText, 'gi')
      return searchResText.replace(reg, highlightStr) // (替换规则,替换的内容) */
      const arr = searchResText.split(`${this.searchText}`)
      return arr.join(`<span class="active">${this.searchText}</span>`)
    }
  }
}
</script>

<style scoped lang="less">
  .search-suggestion{
   /deep/ span.active{
      color:red;
    }
  }

</style>
