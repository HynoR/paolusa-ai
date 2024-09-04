<template>

      <el-card>
        <template #header>
          <h3>WorkerAI 图像生成 (Beta)</h3>
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
  <el-card style="margin-top: 20px;" >
    <h3>MidJourney <el-tag>0.35/4张(绘图，重绘，变换)</el-tag> <el-tag>0.1/次(放大,描述)</el-tag></h3>

    <div>
      请自行填入密钥和API地址，<span style="color:red">MJ绘图商业模型拒绝生成有害、色情、仇恨、暴力等内容图像，</span>部分功能暂不稳定，如有问题请在群内反馈。
      测试功能，反代极不稳定，使用前请加群，如果生成图片失败，请联系群主查看失败原因和回退余额。<br>
      文字生图网站,由于官方反代，绘图一次需要1-10分钟，视负载程度而定，可提交任务后一会再来查看。<br>
      <span style="color:red">不建议在不懂各种参数的情况下随意调节，调节无效参数有可能导致生成图片失败！</span><br>
      cw(0-100) 参数需要预先使用sref和cref上传图片才可使用，如果没有设置sref和cref，调节cw会导致绘图错误！


    </div>
    <el-button style="margin-top: 20px;"  type="primary" @click="openMidjounary">使用MidJourney绘图</el-button>
  </el-card>

  <el-card style="margin-top: 20px;">
    <h3>Flux.1 <el-tag>0.45/张(Pro模型绘图)</el-tag></h3>
    <div>
      新强大绘图模型。Pro/Dev/Schnell 三个版本，Pro版本最强大，Dev版本其次，Schnell牺牲质量换取速度。
       </div>
    <div>
      <a href="https://siliconflow.cn/" target="_blank"> <el-button style="margin-top: 20px;"  type="primary">免费使用Dev/Schnell绘图</el-button></a>

    </div> <div>

  <el-button style="margin-top: 20px;"  type="primary" disabled>三方接入Pro绘图（咕咕咕...）</el-button>
  </div>

  </el-card>
  <el-card style="margin-top: 20px;">
    <h3>Ideogram <el-tag>Free</el-tag></h3>
    <div style="margin-top: 20px">
      Ideo2.0是新一代图片生成模型，支持多种图片生成功能。
    </div>
    <a href="https://ideogram.ai/" target="_blank"> <el-button style="margin-top: 20px;"  type="primary">免费使用Ideogram</el-button></a>
  </el-card>

  <el-card style="margin-top: 20px;">
    <h3>DALL-E 3 <el-tag>0.06-0.12/张(普通)</el-tag> <el-tag>0.12-0.18/张(HD)</el-tag></h3>
    <div style="margin-top: 20px">
      DALL-E 3 是由OpenAI研究的强大的图像生成模型。
    </div>
    <div>
      请自行填入密钥和API地址，OpenAI商业模型拒绝生成有害、色情、仇恨、暴力等内容图像，如有问题请在群内反馈。<br>
      可使用下方的网站使用，或者在Lobechat通过GPT插件调用（调用时一定要说明图片数量）。
   </div>
    <el-button style="margin-top: 20px;"  type="primary" @click="openMidjounary">使用DALL-E 3绘图</el-button>
  </el-card>
</template>

<script setup>
import { ref } from 'vue';
import { ElMessage } from 'element-plus';


    const model = ref('0');
    const prompt = ref('');
    const imageUrl = ref('');
    const loading = ref(false);
    const openMidjounary = () => {
      window.open('https://mjchat.nloli.xyz/#/draw/1002', '_blank');
    };

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