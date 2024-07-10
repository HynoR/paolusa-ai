<template>

      <el-card>
        <template #header>
          <h2>AI 图像生成 (Beta)</h2>
        </template>
        <el-form @submit.prevent="generateImage" label-position="top">
          <el-form-item label="选择免费模型">
            <el-select v-model="model" placeholder="请选择模型">
              <el-option label="SDXL Lightning (极速)" value="0" />
              <el-option label="SDXL Base 1.0 (均衡)" value="1" />
              <el-option label="SDXL Dreamshaper 8 （质量)" value="2" />
            </el-select>
          </el-form-item>
          <el-form-item label="提示词">
            <el-input v-model="prompt" placeholder="请输入英文提示词，其他语言不会生成确定内容。" type="textarea"  :rows="3"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" native-type="submit" :loading="loading">
              生成图像
            </el-button>
            <small>一次生成预计需要3-20秒</small>
          </el-form-item>
        </el-form>
      </el-card>

      <el-card v-if="imageUrl" style="margin-top: 20px;">
        <template #header>
          <h3>生成的图像</h3>
        </template>
        <el-image :src="imageUrl" fit="contain" :preview-src-list="[imageUrl]">
          <template #placeholder>
            <div class="image-slot">
              加载中<span class="dot">...</span>
            </div>
          </template>
        </el-image>
      </el-card>

</template>

<script>
import { ref } from 'vue';
import { ElMessage } from 'element-plus';

export default {
  setup() {
    const model = ref('0');
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
        const response = await fetch('https://sd-cf.nloli.xyz/pic?key=114514', {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: model.value,
            prompt: prompt.value,
          }),
        });

        if (response.ok) {
          const blob = await response.blob();
          imageUrl.value = URL.createObjectURL(blob);
          ElMessage.success('图像生成成功');
        } else {
          ElMessage.error('生成图像失败: ' + response.statusText);
        }
      } catch (error) {
        ElMessage.error('发生错误: ' + error.message);
      } finally {
        loading.value = false;
      }
    };

    return {
      model,
      prompt,
      imageUrl,
      loading,
      generateImage,
    };
  },
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