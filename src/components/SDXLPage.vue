<template>

      <el-card>
        <template #header>
          <h3>WorkerAI 图像生成 (Beta)</h3>
        </template>
        <el-form @submit.prevent="generateImage" label-position="top">
          <el-form-item label="选择免费模型">
            <el-select v-model="model" placeholder="请选择模型">
              <el-option label="FLUX.1 Schnell (推荐)" value="3" />
              <el-option label="SDXL Lightning (极速)" value="0" />
              <el-option label="SDXL Base 1.0 (均衡)" value="1" />
              <el-option label="SDXL Dreamshaper 8 （均衡)" value="2" />
            </el-select>
          </el-form-item>
          <el-form-item label="提示词">
            <el-input v-model="prompt" placeholder="请输入英文提示词，其他语言不会生成确定内容。或者输入提示词后，点击优化提示词转换成适合的内容。不可生成NSFW内容" type="textarea"  :rows="3"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" native-type="submit" :loading="loading">
              生成图像
            </el-button>
            <el-button type="success" @click="improvePrompt" :loading="loading">提示词翻译+优化(可选)</el-button>
            <br><small>一次生成预计需要3-20秒</small>
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
  <el-card style="margin-top: 20px;">
    <template #header>
      <h3>DALL-E 3 <el-tag>付费</el-tag><el-tag>较低门槛</el-tag><el-tag>中等质量</el-tag></h3>
    </template>
    <div style="margin-top: 20px">
      DALL-E 3 是由OpenAI研究的强大的图像生成模型。可以通过聊天来自动生成提示词和迭代图片。使用难度较低。
    </div>
    <div>
      请自行填入密钥和API地址，OpenAI商业模型拒绝生成有害、色情、仇恨、暴力等内容图像，如有问题请在群内反馈。<br>
      可使用下方的网站使用，或者在Lobechat通过GPT插件调用（调用时一定要说明图片数量）。
    </div>
    <div>
      <a href="https://chat.nloli.xyz" target="_blank"> <el-button style="margin-top: 20px;"  type="primary">使用DALL-E 3插件绘图(可自动优化提示词)</el-button></a>
    </div>
    <div>
    <el-button style="margin-top: 20px;"  type="primary" @click="openMidjounary">使用DALL-E 3绘图</el-button>
    </div>
  </el-card>
  <el-card style="margin-top: 20px;">
    <template #header>
      <h3>Recraft V3 <el-tag>免费</el-tag><el-tag>较低门槛</el-tag><el-tag>高质量</el-tag></h3>
    </template>
    <div style="margin-top: 20px">
      Recraft V3 新生图模型
    </div>
    <div>
      <a href="https://www.recraft.ai" target="_blank"> <el-button style="margin-top: 20px;"  type="primary">官网使用</el-button></a>
    </div>

  </el-card>
  <el-card style="margin-top: 20px;" >

    <template #header>
      <h3>MidJourney <el-tag>付费</el-tag><el-tag>难度较高</el-tag><el-tag>极高质量</el-tag></h3>
    </template>
    <div>
      请自行填入密钥和API地址，<span style="color:red">MJ绘图商业模型拒绝生成有害、色情、仇恨、暴力等内容图像，</span>部分功能暂不稳定，如有问题请在群内反馈。
      测试功能，反代极不稳定，使用前请加群，如果生成图片失败，请联系群主查看失败原因和回退余额。<br>
      文字生图网站,由于官方反代，绘图一次需要1-10分钟，视负载程度而定，可提交任务后一会再来查看。<br>
      <span style="color:red">Mj需要自行优化提示词和魔法咒语,不建议在不懂各种参数的情况下随意调节，调节无效参数有可能导致生成图片失败！</span><br>
      cw(0-100) 参数需要预先使用sref和cref上传图片才可使用，如果没有设置sref和cref，调节cw会导致绘图错误！<el-tag>使用门槛和难度较大，建议学习相关用法后再使用</el-tag>
    </div>
    <el-button style="margin-top: 20px;"  type="primary" @click="openMidjounary">使用MidJourney绘图</el-button>
  </el-card>

  <el-card style="margin-top: 20px;">
    <h3>Flux.1 (含提示词优化) <el-tag>免费+付费</el-tag> <el-tag>难度较低</el-tag><el-tag>高质量(仅Pro)</el-tag></h3>
    <div>
      新强大绘图模型。Pro/Dev/Schnell 三个版本，Pro版本最强大，Dev版本其次，Schnell牺牲质量换取速度。该模型优势在于相当听话，基本上会遵循提示词。<el-tag>中等门槛</el-tag>
       </div>
    <div>
      <a href="https://chat.nloli.xyz" target="_blank"> <el-button style="margin-top: 20px;"  type="primary">使用Flux.1 Pro/Dev/Schnell绘图</el-button></a>
    </div>
    <div>
      <a href="https://cloud.siliconflow.cn/i/c2DrMg1s" target="_blank"> <el-button style="margin-top: 20px;"  type="primary">免费Flux.1 使用Dev/Schnell绘图(三方)</el-button></a>
    </div>

  </el-card>
  <el-card style="margin-top: 20px;">
    <h3>Ideogram (含提示词优化)  <el-tag>免费</el-tag><el-tag>难度较低</el-tag><el-tag>高质量</el-tag></h3>
    <div style="margin-top: 20px">
      Ideo2.0是新一代图片生成模型，支持多种图片生成功能。
    </div>
    <a href="https://ideogram.ai/" target="_blank"> <el-button style="margin-top: 20px;"  type="primary">免费使用Ideogram</el-button></a>
  </el-card>


</template>

<script setup>
import { ref } from 'vue';
import { ElMessage } from 'element-plus';


    const model = ref('3');
    const prompt = ref('');
    const imageUrl = ref('');
    const loading = ref(false);
    const openMidjounary = () => {
      window.open('https://mjchat.nloli.xyz/#/draw/1002', '_blank');
    };

    const improvePrompt = async() => {
      if (!prompt.value) {
        ElMessage.warning('请输入提示词');
        return;
      }

      loading.value = true;
      // https://gentle-base-65f5.logty202029.workers.dev/conv POST
      // req : {"prompt":"sunset cyberpunk city"}
      // resp: {"response":"Vibrant sunset casting an array of colors over a futuristic cyberpunk city skyline. Neon lights flicker and reflect on glass buildings, creating a surreal atmosphere. Silhouettes of flying vehicles and bustling streets below. Dynamic composition showcasing the contrast between warm sunset hues and cold neon tones, capturing the essence of a high-tech metropolis."}
      try {
        const response = await fetch('https://gentle-base-65f5.logty202029.workers.dev/conv', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: prompt.value,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          prompt.value = data.response;
          ElMessage.success('提示词优化成功');
        } else {
          ElMessage.error('提示词优化失败: ' + response.statusText);
        }
      } catch (error) {
        ElMessage.error('发生错误: ' + error.message);
      }
      finally {
        loading.value = false;
      }
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
          // 如果模型id=3
          if (model.value === '3') {
            const data = await response.json();
            const imgbase64 = data.image;
            imageUrl.value = 'data:image/png;base64,' + imgbase64;

            ElMessage.success('图像生成成功');
          } else {
            const blob = await response.blob();
            imageUrl.value = URL.createObjectURL(blob);
            ElMessage.success('图像生成成功');
          }
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