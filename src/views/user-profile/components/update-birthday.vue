<template>
<div class='update-birthday'>
  <!-- <van-picker
    title="生日"
    show-toolbar
    :columns="columns"
    :default-index="localGender"
    @confirm="onConfirm"
    @cancel="$emit('close')"
    @change="onChange"
  /> -->
  <van-datetime-picker
    v-model="currentDate"
    type="date"
    title="选择年月日"
    :min-date="minDate"
    :max-date="maxDate"
    @confirm="onConfirm"
    @cancel="$emit('close')"
  />
</div>
</template>

<script>
import { updateUserProfile } from '@/api/user'
import dayjs from 'dayjs'
export default {
  name: 'UpdateBirthday',
  components: {},
  props: {
    value: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      // localGender: this.value, // 性别数字 0男 1女
      minDate: new Date(2000, 0, 1),
      maxDate: new Date(),
      currentDate: new Date(this.value)
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    async onConfirm () {
      this.$toast.loading({
        message: '保存中...',
        forbidClick: true, // 禁止背景点击
        duration: 0
      })
      try {
        const currentDate = dayjs(this.currentDate).format('YYYY-MM-DD')
        await updateUserProfile({
          birthday: currentDate
        })

        // 更新视图
        this.$emit('input', currentDate)
        //  关闭弹窗
        this.$emit('close')
        // 提示成功
        this.$toast.success('性别修改成功!')
      } catch (err) {
        this.$toast.fail('性别修改失败,请重试!')
      }
    },
    onChange (picker, value, index) {
      // console.log(`当前值：${value}, 当前索引：${index}`)
      this.localGender = index
    }
  }
}
</script>

<style scoped lang="less">
  .update-name{
    .field-warp{
      padding: 20px;
    }
  }
</style>
