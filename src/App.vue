<template>
  <div class="container">
    <el-container>
      <el-header>
        <h5>ChatAPI Beta V2@build-10292300 | <el-button @click="refreshUserInfo">刷新数据</el-button></h5>

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
import { onMounted, ref, watch } from 'vue'
import { router } from "./route.js"
import { useRoute } from 'vue-router'
import axios from "axios"
import { ElMessage } from "element-plus"
import { 
  GetCtoken, 
  GetUserInfo, 
  RemoveUserInfo, 
  SetCtoken, 
  SetUserInfo 
} from "./js/data.js"

// 常量配置
const API_BASE_URL = 'https://labapi.nloli.xyz/tako_web'
const ROUTE_CONFIG = {
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

// 响应式状态
const token = ref(null)
const userInfoLoaded = ref(false)
const activeIndex = ref('1')
const route = useRoute()

// 用户信息处理
const handleUserInfoResponse = (userInfo) => {
  if (!userInfo?.api_key) {
    throw new Error('无效的用户信息')
  }
  SetUserInfo(userInfo)
  userInfoLoaded.value = true
  return true
}

// API 请求封装
const fetchUserInfo = async (params = {}) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/gpt_info`, {
      params: {
        token: token.value,
        ...params
      }
    })
    return response.data
  } catch (error) {
    const message = error.response?.status === 400 
      ? `请求无效: ${error.response.data.msg}`
      : `获取信息失败: ${error.message}`
    ElMessage.error(message)
    throw error
  }
}

// 获取用户信息
const getInfo = async () => {
  if (!token.value) return
  
  const cachedInfo = GetUserInfo()
  if (cachedInfo?.api_key) {
    userInfoLoaded.value = true
    return
  }
  
  RemoveUserInfo()
  try {
    const userInfo = await fetchUserInfo()
    if (handleUserInfoResponse(userInfo)) {
      ElMessage.success('获取信息成功')
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)
  }
}

// 刷新用户信息
const refreshUserInfo = async () => {
  RemoveUserInfo()
  await getInfo()
}

// 申请处理
const Apply = async () => {
  try {
    const userInfo = await fetchUserInfo({ apply: true })
    if (handleUserInfoResponse(userInfo)) {
      ElMessage.success('获取成功')
      setTimeout(() => window.location.reload(), 2000)
    }
  } catch (error) {
    console.error('申请处理失败:', error)
  }
}

// 导航处理
const handleClick = (key) => {
  if (key < 6 && !token.value) {
    ElMessage.error('未找到token，请先登录')
    router.push('/')
    return
  }

  const route = ROUTE_CONFIG[key]
  if (!route) return

  if (key === '9') {
    window.location.href = route
  } else {
    router.push(`${route}?token=${token.value}`)
  }
}

// Token 监听
watch(
  () => route.query,
  async (query) => {
    const newToken = query.token || GetCtoken()
    if (newToken) {
      token.value = newToken
      SetCtoken(newToken)
      await getInfo()
    }
  },
  { immediate: true }
)
</script>

<style scoped>
/* 可以添加一些全局样式 */
</style>