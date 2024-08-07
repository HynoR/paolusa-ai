<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span>Token计算器</span>
      </div>
    </template>

    <template #default >
      <small>此工具用于估算文本的Token数量，以便更好地了解模型的消耗情况。如果输入内容超过了模型窗口，模型可能不会回应且计费系统仍会扣费！</small>
      <div style="margin-top: 10px">
        <iframe src="https://gpt-tokenizer.dev/" width="100%" height="880px" ></iframe>
      </div>
    </template>
  </el-card>
</template>

<script lang="ts" setup>



</script>

<style scoped>
.mt-3 {
  margin-top: 12px;
}

.block {
  display: block;
}


</style>