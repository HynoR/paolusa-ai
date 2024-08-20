<template>
  <el-card class="draw-interface">
    <template #header>
      <h2>图像生成接口</h2>
    </template>
    <el-form :model="formData" label-width="120px" @submit.prevent="submitForm">
      <el-form-item label="便利设置">
        <el-slider
            v-model="convenienceLevel"
            :marks="convenienceMarks"
            :min="1"
            :max="6"
            :step="1"
            @change="updateConvenienceSettings"
        ></el-slider>
      </el-form-item>
      <el-form-item label="提示词" required>
        <el-input v-model="formData.prompt" type="textarea" :rows="3" placeholder="描述您想生成的图像"></el-input>
      </el-form-item>
      <el-form-item label="图像尺寸">
        <el-select v-model="formData.image_size">
          <el-option label="方形高清 (Square HD)" value="square_hd"></el-option>
          <el-option label="方形 (Square)" value="square"></el-option>
          <el-option label="竖版 4:3" value="portrait_4_3"></el-option>
          <el-option label="竖版 16:9" value="portrait_16_9"></el-option>
          <el-option label="横版 4:3" value="landscape_4_3"></el-option>
          <el-option label="横版 16:9" value="landscape_16_9"></el-option>
        </el-select>
      </el-form-item>
      <template v-if="isCustomMode">
        <el-form-item label="模型名称">
          <el-input v-model="formData.modelName"></el-input>
        </el-form-item>
        <el-form-item label="推理步数">
          <el-input-number v-model="formData.num_inference_steps" :min="1" :max="100"></el-input-number>
        </el-form-item>
        <el-form-item label="种子值">
          <el-input-number v-model="formData.seed" :min="0" :max="4294967295" :step="1" controls-position="right" style="width: 180px;">
            <template #append>
              <el-button @click="generateRandomSeed">随机</el-button>
            </template>
          </el-input-number>
        </el-form-item>
        <el-form-item label="引导比例">
          <el-slider v-model="formData.guidance_scale" :min="0" :max="20" :step="0.1"></el-slider>
        </el-form-item>
        <el-form-item label="同步模式">
          <el-switch v-model="formData.sync_mode"></el-switch>
        </el-form-item>
        <el-form-item label="生成数量">
          <el-input-number v-model="formData.num_images" :min="1" :max="10"></el-input-number>
        </el-form-item>
        <el-form-item label="安全容忍度">
          <el-select v-model="formData.safety_tolerance">
            <el-option v-for="n in 6" :key="n" :label="`级别 ${n}`" :value="n.toString()"></el-option>
          </el-select>
        </el-form-item>
      </template>
      <el-form-item>
        <el-button type="primary" native-type="submit">生成图像</el-button>
      </el-form-item>
    </el-form>
    <div v-if="result" class="result">
      <h3>生成结果:</h3>
      <pre>{{ result }}</pre>
    </div>
  </el-card>
</template>

<script>
import { ref, reactive, computed } from 'vue'
import axios from 'axios'

export default {
  name: 'DrawInterface',
  setup() {
    const convenienceLevel = ref(3)
    const convenienceMarks = {
      1: '速度',
      2: '初级',
      3: '均衡',
      4: '质量',
      5: '最高质量',
      6: '自定义'
    }

    const formData = reactive({
      modelName: 'dev',
      prompt: '',
      image_size: 'landscape_4_3',
      num_inference_steps: 28,
      seed: null,
      guidance_scale: 3.5,
      sync_mode: false,
      num_images: 1,
      safety_tolerance: '2'
    })

    const isCustomMode = computed(() => convenienceLevel.value === 6)

    const updateConvenienceSettings = (level) => {
      switch(level) {
        case 1:
          formData.modelName = 'schnell'
          formData.num_inference_steps = 5
          break
        case 2:
          formData.modelName = 'dev'
          formData.num_inference_steps = 20
          break
        case 3:
          formData.modelName = 'dev'
          formData.num_inference_steps = 28
          break
        case 4:
          formData.modelName = 'pro'
          formData.num_inference_steps = 28
          break
        case 5:
          formData.modelName = 'pro'
          formData.num_inference_steps = 35
          break
        case 6:
          // 自定义模式，不做任何更改
          break
      }
    }

    const generateRandomSeed = () => {
      formData.seed = Math.floor(Math.random() * 4294967296) // 生成 0 到 2^32 - 1 之间的随机整数
    }

    const result = ref(null)

    const submitForm = async () => {
      try {
        const response = await axios.post('/draw', formData)
        result.value = response.data
      } catch (error) {
        console.error('Error submitting form:', error)
        result.value = '发生错误: ' + error.message
      }
    }

    return {
      formData,
      result,
      submitForm,
      convenienceLevel,
      convenienceMarks,
      updateConvenienceSettings,
      isCustomMode,
      generateRandomSeed
    }
  }
}
</script>

<style scoped>
.draw-interface {
  max-width: 600px;
  margin: 0 auto;
}
.result {
  margin-top: 20px;
}
</style>