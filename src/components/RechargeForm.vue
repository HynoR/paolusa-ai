<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span>额度充值</span>
      </div>
    </template>
    <el-form :model="form" @submit.prevent="handleSubmit" label-width="120px">
      <el-form-item label="PaoluzKey">
        <el-input v-model="form.token" readonly></el-input>
      </el-form-item>
      <el-form-item label="账户密码">
        <el-input v-model="form.passwd" type="password" placeholder="请输入跑路云账号的密码"></el-input>
      </el-form-item>
      <el-form-item label="充值金额">
        <el-input-number style="width: 50%"
                         v-model="form.amount"
                         :min="0.1"
                         :max="50"
                         :step="0.1"
                         @change="calculateEstimates"
                         placeholder="请输入金额(0.1-50)">
        </el-input-number>
        <span class="description">金额将从跑路云余额中扣除,1元=500kToken,由于上游灵车性质,我们不建议您一次性冲太多金额</span>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" native-type="submit" :loading="loading">提交</el-button>
      </el-form-item>
      <el-alert type="warning" class="estimates">
        <p><small>充值金额相当于(按照消耗均值 3K Token 粗略估计,实际可用次数以使用为准)</small></p>
        <p><small>(热门模型) GPT-4o / Claude 3.5 Sonnet 约{{ estimates.gpt4o }}次 </small></p>
        <p><small>(复杂模型) GPT-4 Turbo / Claude 3 Opus 对话 约{{ estimates.gpt4 }}次</small></p>
        <p><small>(简单模型) GPT-4o mini / Haiku 对话/沉浸式翻译 约{{ estimates.cheap }}次</small></p>
        <p><small>绘图 模型 约{{ estimates.paint }}张 | 文字转语音 约{{ estimates.whisper }}分钟</small></p>
      </el-alert>
    </el-form>
  </el-card>

  <!-- 额度详情 -->
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

  <!-- 最近100次使用详情 -->
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
          <el-popover
              placement="top-start"
              title="计算详情"
              :width="200"
              trigger="hover"
              :content="row.calc_detail"
          >
            <template #reference>
              <span class="quota-amount"> ￥{{ formatQuota(row.quota) }}</span>
            </template>
          </el-popover>
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
  calculateEstimates();
});

const calculateEstimates = () => {
  const amount = form.amount;
  estimates.gpt4o = Math.floor(amount / 0.03103);
  estimates.gpt4 = Math.floor(amount / 0.08229);
  estimates.cheap = Math.floor(amount / 0.000852);
  estimates.paint = Math.floor(amount / 0.15);
  estimates.whisper = Math.floor(amount / 0.009);
};

const handleSubmit = async () => {
  if (!form.passwd || form.amount < 0.1 || form.amount > 50) {
    ElMessage.error('请检查输入是否正确');
    return;
  }

  loading.value = true;
  try {
    const response = await axios.post('https://labapi.nloli.xyz/tako_web/gpt_recharge', JSON.stringify({
      passwd: form.passwd,
      amount: form.amount * 100, // 转换为分
      token: form.token
    }));

    ElMessage.success(response.data);
    emit('recharge', { amount: form.amount });

  } catch (error) {
    ElMessage.error('充值失败: ' + (error.response?.data.msg || error.message));
  } finally {
    loading.value = false;
    window.sessionStorage.removeItem('userInfo')
    setTimeout(() => {
      window.location.reload();
    }, 4000);
  }
};

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
      quota: item.quota,
      calc_detail: item.calc_detail
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

function formatQuota(quota) {
  return (quota * 0.000002).toFixed(6).toLocaleString();
}
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
.quota-amount {
  color: #66ccff;
  cursor: pointer;
}
</style>