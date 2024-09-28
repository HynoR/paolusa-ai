<template>
  <div class="container">
    <el-container>
      <el-header>
        <h5>ChatAPI Beta V2@build-09271801 | <el-button @click="refreshUserInfo">刷新数据</el-button></h5>

      </el-header>

      <el-main>
        <el-card>
          <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleClick">
            <el-menu-item index="1">详情页</el-menu-item>
            <el-menu-item index="2">模型信息</el-menu-item>
            <el-menu-item index="3">Key管理</el-menu-item>
            <el-menu-item index="4">額度管理</el-menu-item>
            <el-menu-item index="5">使用技巧&关于</el-menu-item>
            <el-menu-item index="6">工具-Token计算器</el-menu-item>
            <el-menu-item index="7">文生图</el-menu-item>
            <el-menu-item index="9">共享GPT账号</el-menu-item>

<!--            <el-menu-item index="8">Flux1</el-menu-item>-->

          </el-menu>

        </el-card>
        <router-view v-if="userInfoLoaded"></router-view>
        <div v-else>Loading...（如未加载数据,可尝试点击上方的刷新数据按钮）
        <div>第一次使用？<el-button @click="Apply">点我申请账户</el-button></div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import {onMounted, ref, watch} from 'vue'
import {router} from "./route.js";
import {useRoute} from 'vue-router';
import axios from "axios";
import {ElMessage} from "element-plus";
import {GetCtoken, GetUserInfo, RemoveUserInfo, SetCtoken, SetUserInfo} from "./js/data.js";

const token = ref(null);
const userInfoLoaded = ref(false)
const use_route = useRoute()
onMounted(() => {

})

const refreshUserInfo = async () => {
  RemoveUserInfo()
  await getInfo()
}

const getInfo = async () => {
 if (!token.value) {
   return
}

  const old_userInfo = GetUserInfo()
  if (old_userInfo && old_userInfo.api_key.length > 0) {
    userInfoLoaded.value = true
    return
  } else {
    RemoveUserInfo()
  }

  try {
    const response = await axios.get('https://labapi.nloli.xyz/tako_web/gpt_info?token=' + token.value);
    const userInfo = response.data;
    if (userInfo && userInfo.api_key.length > 0) {
      SetUserInfo(userInfo)
      ElMessage.success('获取信息成功');
      userInfoLoaded.value = true
    }
  } catch (error) {
    if (error.response && error.response.status === 400) {
      ElMessage.error('请求无效: ' + error.response.data.msg);
    } else {
      ElMessage.error('获取信息失败: ' + error.message);
    }}
}

const Apply= async () => {
  try {
    const response = await axios.get('https://labapi.nloli.xyz/tako_web/gpt_info?apply=true&token=' + token.value);
    const userInfo = response.data;
    if (userInfo && userInfo.api_key.length > 0) {
      SetUserInfo(userInfo)
      ElMessage.success('获取成功');
      userInfoLoaded.value = true
      // 等待两秒刷新
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    }
  } catch (error) {
    console.log(error)
    if (error.response && error.response.status === 400) {
      ElMessage.error('请求无效: ' + error.response.data.msg);
    } else {
      ElMessage.error('获取信息失败: ' + error.message);
    }}
}

const activeIndex = ref('1')


const handleClick = (key, keyPath) => {

  // 切换route页面
  console.log(key)
  if (key < 6) {
    if (token.value === null || token.value === undefined || token.value === '') {
      ElMessage.error('未找到token，请先登录');
      router.push('/')
      return;
    }
  }
  switch (key) {
    case '1':
      router.push('/?token=' + token.value)
      break
    case '4':
      router.push('/recharge?token=' + token.value)
      break
    case '2':
      router.push('/model?token=' + token.value)
      break
    case '3':
      router.push('/usage?token=' + token.value)
      break
    case '5':
      router.push('/about?token=' + token.value)
      break
    case '6':
      router.push('/tiktoken?token=' + token.value)
      break
    case '7':
      router.push('/sdxl?token=' + token.value)
      break
    case '8':
      router.push('/flux1?token=' + token.value)
      break
    case '9':
      window.location.href = "https://app.nloli.xyz/cld/";
      break
    default:
      break
  }
}


watch(() => use_route.query, async (query) => {
  token.value = query.token;
  if (token.value) {
    SetCtoken(token.value)
    await getInfo()
  }else{
    if (GetCtoken){
      token.value = GetCtoken()
      await getInfo()
    }
  }

}, {immediate: true});

</script>

<style scoped>
/* 可以添加一些全局样式 */
</style>