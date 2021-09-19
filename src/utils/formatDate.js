import 'dayjs/locale/zh-cn'
import dayjs from 'dayjs'
import Vue from 'vue'

dayjs.locale('zh-cn')
Vue.filter('formatDate', (value, format = 'YYYY-MM-DD HH:mm:ss') => {
  return dayjs(value).format(format)
})
