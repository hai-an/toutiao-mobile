import Vue from 'vue'
import dayjs from 'dayjs' // ES 2015
import relativeTime from 'dayjs/plugin/relativeTime' // ES 2015

import 'dayjs/locale/zh-cn' // 导入本地化语言
dayjs.locale('zh-cn') // 全局使用语言包
// dayjs().locale('zh-cn').format() // 当前实例使用
dayjs.extend(relativeTime)// 配置使用处理相对时间的插件

// dayjs().from(dayjs('1990-01-01')) // 31 年后
// dayjs().from(dayjs('1990-01-01'), true) // 31 年
// dayjs().fromNow()

// dayjs().to(dayjs('1990-01-01')) // 31 年前
Vue.filter('relativeTime', value => {
  return dayjs().to(dayjs(value))
  // return dayjs().toNow()
})
// dayjs().toNow()
