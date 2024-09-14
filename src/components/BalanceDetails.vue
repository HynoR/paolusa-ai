<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span>详情</span>
      </div>
    </template>

    <el-alert
        title="详情"
        type="info"
        :closable="false"
        show-icon
        class="model-info"
    >
      <template #default>
        <div class="action-buttons">
          <el-button type="success" @click="syncChatKey" :loading="syncLoading">同步ChatKey</el-button>
          <el-button type="danger" disabled>重置ChatKey(开发中...)</el-button>
        </div>
        <p><strong>如需重置key请找客服</strong></p>
        <p><strong>* 如果您未拥有某些新更新的模型的使用权限, 可以点击上方同步按钮同步可用模型</strong></p>
        <p><strong>** 如果您在Paoluz续费了套餐, 请点击同步按钮同步获得额外的免费余额</strong></p>
        <div id="turnstile-container"></div>
        <p>如有其他模型需求、模型失效、无效扣费、面板Bug等，欢迎在<a href="https://t.me/+VgETgSaGDiMxNzhl" target="_blank">群内</a>汇报bug!</p>
      </template>
    </el-alert>
  </el-card>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { ElMessage } from 'element-plus';

const syncLoading = ref(false);

onMounted(() => {
  initTurnstile();
});

function initTurnstile() {
  if (typeof turnstile !== 'undefined') {
    turnstile.render('#turnstile-container', {
      sitekey: '0x4AAAAAAAaF42WXCEpfvcYO',
      callback: function(token) {
        window.sessionStorage.setItem('cloudflare_token', token);
      }
    });
  }
}

async function syncChatKey() {
  const cloudflare_token = window.sessionStorage.getItem('cloudflare_token');
  if (!cloudflare_token) {
    ElMessage.warning('请先完成验证');
    return;
  }
  const ctoken = window.sessionStorage.getItem('ctoken');
  if (!ctoken) {
    ElMessage.error('未找到token，请先登录');
    return;
  }

  syncLoading.value = true;
  try {
    const response = await axios.post('https://labapi.nloli.xyz/tako_web/gpt_reset', { token: ctoken, turn_site_payload: cloudflare_token });
    ElMessage.success(response.data);
  } catch (error) {
    ElMessage.error('同步失败: ' + error.response?.data?.message || error.message);
  } finally {
    syncLoading.value = false;
    window.sessionStorage.removeItem('cloudflare_token');
    if (typeof turnstile !== 'undefined') {
      turnstile.reset();
    }
    window.sessionStorage.removeItem('userInfo')
    setTimeout(() => {
      window.location.reload();
    }, 3000);
  }
}
</script>

<style scoped>
.box-card {
  margin-bottom: 20px;
}
.model-info {
  margin-top: 20px;
}
.action-buttons {
  margin-bottom: 15px;
}
#turnstile-container {
  margin-top: 15px;
  margin-bottom: 15px;
}
</style>