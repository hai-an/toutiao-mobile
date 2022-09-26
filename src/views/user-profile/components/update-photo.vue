<template>
<div class='update-photo'>
  <img :src="img" class="img" ref="img">
  <div class="toolbar">
    <div class="cancel" @click="$emit('close')">取消</div>
    <div class="confirm" @click="onConfirm">完成</div>
  </div>
</div>
</template>

<script>
import { updateUserPhoto } from '@/api/user'
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
export default {
  name: 'UpdatePhoto',
  components: {},
  props: {
    img: {
      type: [String, Object],
      required: true
    }
  },
  data () {
    return {
      cropper: null
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {
    const image = this.$refs.img
    this.cropper = new Cropper(image, {
      viewMode: 1, // 画布模式
      dragMode: 'move', // 背景是否可滚动
      aspectRatio: 1, // 裁切比例
      autoCropArea: 1,
      cropBoxMovable: false, // 截图区是否移动
      cropBoxResizable: true, // 截图区是否缩放
      background: false
    })
  },
  methods: {
    onConfirm () {
      // 基于服务端的裁切使用 getData 方法获取裁切参数
      // console.log(this.cropper.getData())

      // 纯客户端的裁切使用 getCroppedCanvas 获取裁切的文件对象
      this.cropper.getCroppedCanvas().toBlob(blob => {
        // console.log(blob)
        this.updateUserPhotoFn(blob)
      })
    },
    async updateUserPhotoFn (blob) {
      this.$toast.loading({
        message: '保存中...',
        forbidClick: true, // 禁止背景点击
        duration: 0
      })
      try {
        // (1) 如果接口要求 Content-Type 是 application/json
        // 则传递普通 JavaScript 对象
        // updateUserPhoto({
        //   photo: blob
        // })

        // (2) 如果接口要求 Content-type 是 multipart/form-formData
        // 则你必须传递 FormData 对象
        const formData = new FormData()
        formData.append('photo', blob)
        const { data } = await updateUserPhoto(formData)
        console.log(data)
        // 关闭弹出层
        this.$emit('close')
        // 更新视图
        this.$emit('update-user_photo', data.data.photo)
        // 成功提示
        this.$toast.success('头像修改成功')
      } catch (err) {
        this.$toast.fail('头像修改失败!')
      }
    }
  }
}
</script>

<style scoped lang="less">
  .update-photo{
    background-color: #000;
    height: 100%;
    .toolbar{
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      justify-content: space-between;
      .cancel,
      .confirm{
        width: 90px;
        height: 90px;
        line-height: 90px;
        font-size: 36px;
        text-align: center;
        color: #fff;
      }
    }
  }
  .img{
    display: block;
    max-width: 100%;
  }
</style>
