<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span>额度充值</span>
      </div>
    </template>
    <el-form :model="form" @submit.prevent="handleSubmit" label-width="120px">
      <!-- Existing form fields... -->
    </el-form>
  </el-card>

  <!-- New section: 额度详情 -->
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
  </el-card>

  <!-- New section: 最近100次使用详情 -->
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span>最近100次使用详情</span>
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
import { ref, reactive, onMounted } from 'vue';
import axios from 'axios';
import { ElMessage } from 'element-plus';

const props = defineProps(['token']);
const emit = defineEmits(['recharge']);

const form = reactive({
  token: '',
  passwd: '',
  amount: 0.1
});

const loading = ref(false);
const estimates = reactive({
  gpt4o: 0,
  gpt4: 0,
  cheap: 0,
  paint: 0,
  whisper: 0
});

const balanceData = ref([]);
const balanceHistory = ref([]);
const models = ref([]);

onMounted(async () => {
  form.token = window.sessionStorage.getItem('ctoken');
  await fetchBalanceInfo();
  await fetchBalanceHistory();
});

// Existing functions...

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
    const data = JSON.parse(data_str);
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
  const date = new Date(dateString * 1000);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function formatAmount(amount) {
  return `${amount.toLocaleString()}`;
}

function formatMoney(amount) {
  return `¥ ${parseFloat(amount) / 500000}`;
}

const QuotaToMoney = 0.000002;
function formatQuota(quota) {
  return `${(quota * QuotaToMoney).toFixed(6).toLocaleString()}`;
}

// ... (rest of the existing functions)
</script>

<style scoped>
.box-card {
  margin-top: 20px;
  margin-bottom: 20px;
}
.description {
  margin-left: 10px;
  color: #909399;
  font-size: 14px;
}
.estimates {
  margin-top: 10px;
  font-size: 16px;
  font-weight: bold;
  color: #606266;
}
</style>