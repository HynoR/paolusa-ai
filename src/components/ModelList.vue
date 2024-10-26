<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span>可用模型</span>
      </div>
    </template>
    <el-alert style="margin-top: 5px"
              :title="'OpenAI、Claude、Gemini等商业模型存在对话审查，禁止有害、色情、仇恨、暴力等内容。遇到审查会扣费不返回回应，如有此类需求请使用无审查的Command R+(command-r-plus)'"
              type="error"
              :closable="false"
              :show-icon="false"
    />
    <el-alert style="margin-top: 5px"
              :title="'先进模型和标注\'不可并发\'的模型禁止用于沉浸式翻译等并发工具、如存在并发影响他人使用，我们可能会限制您的密钥使用。'"
              type="error"
              :closable="false"
              :show-icon="false"
    />
    <div class="model-info">
      <p><small>所有非官方接口模型均低于官网价格，大概在2折到8折之间。官方接口模型为官方原价</small></p>
      <p><small>灵车(相当便宜但是较慢,视觉功能不稳定) / 普通 (标准速度和低廉价格,正常视觉能力和功能) / 官方 (最快速度和原始价格)</small></p>
      <p><small>I：用户输入1M Token单价(单位usd) / O：AI输出1M Token单价(单位usd) / X: 参考折扣（该模型折扣约为官方价格的折扣比例）</small></p>
      <p><small> 价格计算方法 = (输入token * I + 输出token * O ) * X</small></p>
    </div>
    <div>
      <a href="https://livebench.ai/#" target="_blank">
       <el-button type="info">模型评分排行榜</el-button>
      </a>
      <a href="https://chatapi.nloli.xyz/pricing" target="_blank">
        <el-button type="success">模型价格表</el-button>
      </a>
    </div>
  </el-card>

  <el-card>
    <div>国产模型API一般用于开发和对比测试，如您需要常规使用对话，推荐使用国产模型官方的免费对话。</div>
    <el-button type="text">
      <a href="https://kimi.moonshot.cn/" target="_blank">
      月之暗面
      </a>
    </el-button>
    <el-button type="text">
      <a href="https://chatglm.cn/" target="_blank">
      智谱清言GLM
      </a>
    </el-button>
    <el-button type="text">
      <a href="https://tongyi.aliyun.com/qianwen/" target="_blank">
      通义千问
      </a>
    </el-button>
    <el-button type="text">
      <a href="https://chat.deepseek.com/" target="_blank">
        DeepSeek
      </a>
      </el-button>
    <el-button type="text">
      <a href="https://www.wanzhi.com/" target="_blank">
      01万物
      </a>
    </el-button>
  </el-card>
</template>

<script setup>


</script>

<style scoped>
.box-card {
  margin-bottom: 20px;
}
.model-info {
  margin-bottom: 20px;
}
.el-table {
  margin-bottom: 20px;
}
</style>