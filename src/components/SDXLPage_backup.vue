<template>

  <el-card>
    <template #header>
      <h2>AI 图像生成</h2>
    </template>
    <div>
      <el-form @submit.prevent="generateImage">
        <el-form-item label="模型">
          <el-select v-model="model">
            <el-option label="Stable Diffusion XL Lightning" value="@cf/bytedance/stable-diffusion-xl-lightning" />
            <el-option label="Stable Diffusion XL Base 1.0" value="@cf/stabilityai/stable-diffusion-xl-base-1.0" />
            <el-option label="Dreamshaper 8 LCM" value="@cf/lykon/dreamshaper-8-lcm" />
          </el-select>
        </el-form-item>
        <el-form-item label="提示词">
          <el-input v-model="prompt" type="textarea" :rows="4" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" native-type="submit" :loading="loading">生成图像</el-button>
        </el-form-item>
      </el-form>
      <div v-if="imageUrl">
        <h3>生成的图像：</h3>
        <el-image :src="imageUrl" fit="contain" :preview-src-list="[imageUrl]" />
      </div>
    </div>
  </el-card>


</template>

<script>
import { ref } from 'vue';
import { ElMessage } from 'element-plus';

export default {
  setup() {
    const WORKER_URL = 'https://late-hat-b591.logty202029.workers.dev';
    const model = ref('@cf/stabilityai/stable-diffusion-xl-base-1.0');
    const prompt = ref('');
    const imageUrl = ref('');
    const loading = ref(false);

    const generateImage = async () => {
      if (!prompt.value) {
        ElMessage.warning('请输入提示词');
        return;
      }

      loading.value = true;
      try {
        const response = await fetch(`${WORKER_URL}/v1/images/generations`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer your_api_key_here' // 替换为实际的 API 密钥
          },
          body: JSON.stringify({
            model: model.value,
            prompt: prompt.value,
            n: 1
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.data && data.data.length > 0) {
          imageUrl.value = data.data[0].url;
          ElMessage.success('图像生成成功');
        } else {
          throw new Error('No image URL in response');
        }
      } catch (error) {
        console.error('Error generating image:', error);
        ElMessage.error(`生成图像失败: ${error.message}`);
      } finally {
        loading.value = false;
      }
    };

    return {
      model,
      prompt,
      imageUrl,
      loading,
      generateImage
    };
  }
};
</script>

<style scoped>


.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: #f5f7fa;
  color: #909399;
  font-size: 14px;
}

.dot {
  animation: dot 1s infinite step-start both;
}

@keyframes dot {
  33% {
    content: '.';
  }
  66% {
    content: '..';
  }
  100% {
    content: '...';
  }
}
</style>