<template>
<div class='update-name'>
   <!-- 导航栏 -->
  <van-nav-bar
    title="设置昵称"
    left-text="取消"
    right-text="完成"
    @click-left="$emit('close')"
    @click-right="onConfirm"
  />

  <!-- /导航栏 -->
  <!-- 输入框 -->
  <div class="field-warp">
    <van-field
      v-model.trim="localName"
      rows="2"
      autosize
      type="textarea"
      maxlength="10"
      placeholder="请输入昵称"
      show-word-limit
    />
  </div>
  <!-- /输入框 -->
</div>
</template>

<script>
import { updateUserProfile } from '@/api/user'
export default {
  name: 'UpdateName',
  components: {},
  props: {
    value: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      localName: this.value // 输入框的文本内容
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
        if (!this.localName.length) {
          this.$toast('昵称不能为空!')
        }
        await updateUserProfile({
          name: this.localName
        })

        // 更新视图
        this.$emit('input', this.localName)
        //  关闭弹窗
        this.$emit('close')
        // 提示成功
        this.$toast.success('昵称修改成功!')
      } catch (err) {
        this.$toast.fail('昵称修改失败,请重试!')
      }
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
