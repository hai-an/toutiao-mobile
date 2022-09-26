<template>
<div class='update-gender'>
  <van-picker
    title="性别"
    show-toolbar
    :columns="columns"
    :default-index="localGender"
    @confirm="onConfirm"
    @cancel="$emit('close')"
    @change="onChange"
  />
</div>
</template>

<script>
import { updateUserProfile } from '@/api/user'
export default {
  name: 'UpdateGender',
  components: {},
  props: {
    value: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      localGender: this.value, // 性别数字 0男 1女
      columns: ['男', '女']
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
        await updateUserProfile({
          gender: this.localGender
        })

        // 更新视图
        this.$emit('input', this.localGender)
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
