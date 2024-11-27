<template>
  <div class="container">
    <el-container>
      <el-header>
        <h5>ChatAPI Beta V2@build-11272300 | <el-button @click="refreshUserInfo">刷新数据</el-button></h5>

      </el-header>

      <el-main>
        <el-card>
          <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleClick">
            <el-menu-item index="1">详情页</el-menu-item>
            <el-menu-item index="2">模型信息</el-menu-item>
            <el-menu-item index="3">账号管理</el-menu-item>
            <el-menu-item index="4">額度管理</el-menu-item>
            <el-menu-item index="5">使用技巧&关于</el-menu-item>
            <el-menu-item index="6">工具-Token计算器</el-menu-item>
            <el-menu-item index="7">文生图</el-menu-item>
            <el-menu-item index="9">共享GPT账号</el-menu-item>
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
import { ref, watch } from 'vue'
import { router } from "./route.js";
import { useRoute } from 'vue-router';
import axios from "axios";
import { ElMessage } from "element-plus";
import { GetCtoken, GetUserInfo, RemoveUserInfo, SetCtoken, SetUserInfo } from "./js/data.js";

const token = ref(null);
const userInfoLoaded = ref(false);
const use_route = useRoute();

const handleError = (error) => {
  if (error.response && error.response.status === 400) {
    ElMessage.error('请求无效: ' + error.response.data.msg);
  } else {
    ElMessage.error('操作失败: ' + error.message);
  }
}

const fetchUserInfo = async (apply = false) => {
  RemoveUserInfo();
  if (!token.value) return;

  const oldUserInfo = GetUserInfo();
  if (oldUserInfo && oldUserInfo.api_key.length > 0) {
    userInfoLoaded.value = true;
    return;
  } else {
    RemoveUserInfo();
  }

  try {
    const url = apply
      ? `https://labapi.nloli.xyz/tako_web/gpt_info?apply=true&token=${token.value}`
      : `https://labapi.nloli.xyz/tako_web/gpt_info?token=${token.value}`;
    const response = await axios.get(url);
    const userInfo = response.data;
    if (userInfo && userInfo.api_key.length > 0) {
      SetUserInfo(userInfo);
      ElMessage.success(apply ? '获取成功' : '获取信息成功');
      userInfoLoaded.value = true;
      if (apply) {
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    }
  } catch (error) {
    handleError(error);
  }
}

const refreshUserInfo = async () => {
  await fetchUserInfo();
}

const Apply = async () => {
  await fetchUserInfo(true);
}

const activeIndex = ref('1');

const routeMap = {
  '1': '/',
  '2': '/model',
  '3': '/usage',
  '4': '/recharge',
  '5': '/about',
  '6': '/tiktoken',
  '7': '/sdxl',
  '8': '/flux1',
  '9': 'https://app.nloli.xyz/cld/'
}

const handleClick = (key) => {
  console.log(key);
  if (['1', '2', '3', '4', '5', '6', '7', '8'].includes(key) && !token.value) {
    ElMessage.error('未找到token，请先登录');
    router.push('/');
    return;
  }

  const target = routeMap[key];
  if (target) {
    if (key === '9') {
      window.location.href = target;
    } else {
      router.push(`${target}?token=${token.value}`);
    }
  }
}

watch(() => use_route.query, async (query) => {
  token.value = query.token || GetCtoken();
  if (token.value) {
    SetCtoken(token.value);
    await fetchUserInfo();
  }
}, { immediate: true });

</script>

<style scoped>
/* 可以添加一些全局样式 */
</style>