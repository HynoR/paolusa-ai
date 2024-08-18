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

onMounted(() => {
  form.token = window.sessionStorage.getItem('ctoken');
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
</script>

<style scoped>
.box-card {
  margin-top: 20px;
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