<template>
<div class='user-profile'>
  <!-- 导航栏 -->
  <van-nav-bar
    class="page-nav-bar"
    title="个人信息"
    left-arrow
    @click-left="$router.back()"
  />
  <!-- /导航栏 -->
  <!-- 个人信息 -->
  <input
    type="file"
    hidden
    ref="file"
    @change="onFileChange"
   />
  <van-cell
    title="头像"
    @click="$refs.file.click()"
    is-link
  >
    <van-image
      class="avatar"
      fit="cover"
      round
      :src="user.photo"
    />
  </van-cell>
  <van-cell
    title="昵称"
    :value="user.name"
    @click="isUpdateNameShow = true"
    is-link
    />
  <van-cell
    title="性别"
    :value="user.gender === 0 ? '男' : '女'"
    @click="isUpdateGenderShow = true"
    is-link/>
  <van-cell
    title="生日"
    :value="user.birthday"
    @click="isUpdateBirthdayShow = true"
    is-link/>
  <!-- /个人信息 -->

  <!-- 编辑昵称 -->
  <van-popup
    class="flied-popup"
    v-model="isUpdateNameShow"
    style="height:100%;"
    position="bottom"
  >
    <update-name
        v-if="isUpdateNameShow"
        v-model="user.name"
        @close="isUpdateNameShow = false"
    />
  </van-popup>
  <!-- /编辑昵称 -->

  <!-- 编辑性别 -->
  <van-popup
    class="flied-popup"
    v-model="isUpdateGenderShow"
    position="bottom"
  >
    <update-gender
        v-if="isUpdateGenderShow"
        v-model="user.gender"
        @close="isUpdateGenderShow = false"
    />
  </van-popup>
  <!-- /编辑性别 -->

  <!-- 编辑生日 -->
  <van-popup
    class="flied-popup"
    v-model="isUpdateBirthdayShow"
    position="bottom"
  >
    <update-birthday
        v-if="isUpdateBirthdayShow"
        v-model="user.birthday"
        @close="isUpdateBirthdayShow = false"
    />
  </van-popup>
  <!-- /编辑生日 -->

    <!-- 编辑头像 -->
  <van-popup
    class="flied-popup"
    v-model="isUpdatePhotoShow"
    position="bottom"
    style="height:100%;"
  >
   <update-photo
    :img="img"
    v-if="isUpdatePhotoShow"
    @close="isUpdatePhotoShow = false"
    @update-user_photo="user.photo = $event"
   />
  </van-popup>
  <!-- /编辑头像 -->
</div>
</template>

<script>
import { userProfile } from '@/api/user'
import UpdateName from './components/update-name.vue'
import UpdateGender from './components/update-gender.vue'
import UpdateBirthday from './components/update-birthday.vue'
import UpdatePhoto from './components/update-photo.vue'
export default {
  name: 'UserProfile',
  components: {
    UpdateName,
    UpdateGender,
    UpdateBirthday,
    UpdatePhoto
  },
  props: {},
  data () {
    return {
      user: {}, // 用户资料
      isUpdateNameShow: false, // 控制昵称弹出层
      isUpdateGenderShow: false, // 控制性别弹出层
      isUpdateBirthdayShow: false,
      isUpdatePhotoShow: false,
      img: null // 选中的图片文件
    }
  },
  computed: {},
  watch: {},
  created () {
    this.getUserProfile()
  },
  mounted () {},
  methods: {
    async getUserProfile () {
      try {
        const { data } = await userProfile()
        console.log(data)
        this.user = data.data
      } catch (err) {
        this.$toast('获取用户资料失败,请重试!' + err)
      }
    },
    onFileChange () {
      // 获取文件对象
      const file = this.$refs.file.files[0]
      // console.log(file)
      // 基于文章对象获取 blob 数据
      this.img = window.URL.createObjectURL(file)
      // console.log(data)

      // 选中图片后,再打开 图片预览弹出层
      this.isUpdatePhotoShow = true

      // file-input 如果选了同一个文件不会触发 change 事件
      // 解决办法就是每次使用完毕,把他的 value 清空
      this.$refs.file.value = ''
    }
  }
}
</script>

<style scoped lang="less">
  .user-profile{
    height: 100vh;
    background: #f6f7fa;
    .avatar{
      width: 60px;
      height: 60px;
    }
    .flied-popup{
      background: #f6f7fa;
    }
  }
</style>
