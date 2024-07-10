<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span>额度详情</span>
      </div>
    </template>

    <el-table :data="balanceData" style="width: 100%">
      <el-table-column prop="createdAt" label="创建时间" width="180"></el-table-column>
      <el-table-column prop="expiredAt" label="过期时间" width="180"></el-table-column>
      <el-table-column prop="amountUsed" label="已用Token" width="120"></el-table-column>
      <el-table-column prop="moneyUsed" label="已用金额" width="120"></el-table-column>
      <el-table-column prop="amountRemain" label="剩余Token" width="120"></el-table-column>
      <el-table-column prop="moneyRemain" label="剩余金额" width="120"></el-table-column>
    </el-table>

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
        <p><strong>* 如果您未拥有某些新更新的模型的使用权限, 可以点击上方同步按钮同步可用模型</strong></p>
        <p><strong>** 如果您在Paoluz续费了套餐, 请点击同步按钮同步获得额外的免费余额</strong></p>
        <div id="turnstile-container"></div>
        <p>如有其他模型需求、模型失效、无效扣费、面板Bug等，欢迎在<a href="https://t.me/+VgETgSaGDiMxNzhl" target="_blank">群内</a>汇报bug!</p>
      </template>
    </el-alert>
  </el-card>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span>最近100次使用详情 </span>
      </div>
    </template>

    <el-table :data="balanceHistory" style="width: 100%">
      <el-table-column prop="tokenName" label="用户" width="180"></el-table-column>
      <el-table-column prop="createdAt" label="使用时间" width="180" sortable>
        <template #default="{ row }">
          <span>{{ formatDate(row.createdAt) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="modelName" label="模型名称" width="180" sortable></el-table-column>
      <el-table-column prop="promptTokens" label="输入Token" width="120" sortable></el-table-column>
      <el-table-column prop="completionTokens" label="输出Token" width="120" sortable></el-table-column>
      <el-table-column prop="quota" label="配额" width="120" sortable>
        <template #default="{ row }">
          <span> ￥{{ row.quota }}</span>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script setup>
import {onMounted, ref} from 'vue';
import axios from 'axios';
import {ElMessage} from 'element-plus';

const balanceData = ref([]);
const balanceHistory = ref([]);
const models = ref([]);
const syncLoading = ref(false);

onMounted(async () => {

  await fetchBalanceInfo();
  await fetchBalanceHistory();
  initTurnstile();
});

async function fetchBalanceInfo() {
  const ctoken = window.sessionStorage.getItem('ctoken');
  if (!ctoken) {
    ElMessage.error('未找到token，请先登录');
    return;
  }
  try {

    const data_str = window.sessionStorage.getItem('userInfo');
    if (!data_str) {
      ElMessage.error('未找到用户信息，请先登录');
      return;
    }
    const data =JSON.parse(data_str);
    balanceData.value = [{
      createdAt: formatDate(data.created_at),
      expiredAt: formatDate(data.expired_at),
      amountUsed: formatAmount(data.amount_used),
      amountRemain: formatAmount(data.amount_remain),
      moneyUsed: formatMoney(data.amount_used),
      moneyRemain: formatMoney(data.amount_remain)
    }];
    models.value = data.models || [];
  } catch (error) {
    ElMessage.error('获取余额信息失败: ' + error.message);
  }
}

const QuotaToMoney = 0.000002
function formatQuota(quota) {
  return `${(quota*QuotaToMoney).toFixed(6).toLocaleString()}`;
}

async function fetchBalanceHistory() {
  const ctoken = window.sessionStorage.getItem('ctoken');
  if (!ctoken) {
    ElMessage.error('未找到token，请先登录');
    return;
  }
  try {
    const response = await axios.get('https://labapi.nloli.xyz/tako_web/gpt_history', { params: { token: ctoken } });
    if (!response.data.data) {
      ElMessage.warning('暂无余额历史');
      return;
    }
    balanceHistory.value = response.data.data.map(item => ({
      // {"data":[{"token_name":"10754Pb9de4850","created_at":1719016472,"model_name":"gemini-1.5-flash","prompt_tokens":791,"completion_tokens":140,"quota":242},{"token_name":"10754Pb9de4850","created_at":1719016470,"model_name":"gemini-1.5-flash","prompt_tokens":39,"completion_tokens":713,"quota":436}]}
      tokenName: item.token_name,
      createdAt: item.created_at,
      modelName: item.model_name,
      promptTokens: item.prompt_tokens,
      completionTokens: item.completion_tokens,
      quota: formatQuota(item.quota)


    }));
    ElMessage.success('获取余额历史成功')
  } catch (error) {
    ElMessage.error('获取余额历史失败: ' + error.message);
  }
}


function formatDate(dateString) {
  const date = new Date(dateString*1000);

  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 月份从0开始，所以需要加1
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}



function formatAmount(amount) {
  return   `${amount.toLocaleString()}`;
}

function formatMoney(amount) {
  return `¥ ${parseFloat(amount)/500000}`;
}



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
    const response = await axios.post('https://labapi.nloli.xyz/tako_web/gpt_sync', { token:ctoken, turn_site_payload: cloudflare_token });
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