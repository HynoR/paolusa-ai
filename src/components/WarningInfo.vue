<template>
<el-card>
  <template #header>
    <div class="card-header">
      <strong>使用须知</strong>
    </div>
  </template>

    <template #default>
      <p style="color:#c45656">1. 每次对话都会附带话题中之前所有的对话内容，因此随着对话的不断进行，每次对话token消耗会逐渐累加。如您已经完成一个话题或者事件，请新建话题或者清空历史记录避免无意义的token消耗。</p>
      <p>2. 聊天界面可以在设置中关闭 "自动标题生成"，或者使用更便宜的模型， 来节约额外的token消耗。</p>
     <p>3. 如无特殊需求，请在对话时不要启用各种插件，插件也是有一定预留的Token消耗</p>
      <p>4. 商业模型均有安全性审查，遇到不安全内容会空返回并扣费，请勿不断尝试以免浪费Token余额</p>
      <p>5. 生产力模型并非最贵的就是最好的，一般来讲最新的模型能力和知识更强，只有遇到模型偷懒才需要用到更贵的模型去减少偷懒的可能性</p>
      <p>6. 如果输入内容超过了模型窗口，模型可能不会回应且计费系统仍会扣费！可提前在Token计算器(<a href="/#/tiktoken">本站</a>或者<a href="https://platform.openai.com/tokenizer" target="_blank">网络上</a> )提前预估长度</p>
      <p>如果您的内容非常长，而且不涉及隐私内容，可以尝试共享GPT账号，直接使用官方账号对话节约开支</p>
      <hr>
      <p><strong>关于官方GPT Plus会员和ChatAPI区别</strong></p>
      <p>如果您是“长期大量”使用GPT或“重度使用GPT扩展功能”(图片/文件上传/联网)，需要自定义GPT符合你日常习惯，需要体验官方最新功能，去买官方的网页版Plus更合算</p>
      <p>如果您只是把GPT当作解决问题的工具，偶尔使用扩展功能，并且不需要GPT来帮你完成一整个庞大的项目而是部分模块，那么API更有性价比</p>
    </template>

</el-card>
  <el-card>
    <template #header>
      <div class="card-header">
        <span>关于</span>
      </div>
    </template>

    <template #default>
      <p><strong>Code By Paoluz Dev && 该页面80%由 Claude 3.5 Sonnet 编写</strong></p>
      <p>如有其他模型需求、错误扣费、模型失效、面板Bug等，欢迎在<a href="https://t.me/+VgETgSaGDiMxNzhl" target="_blank">群内</a>汇报bug!</p>
    </template>

  </el-card>

</template>
<script setup lang="ts">

</script>