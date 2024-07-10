<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span>Token计算器</span>
      </div>
    </template>

    <template #default>
      <small>此工具用于估算文本的Token数量，以便更好地了解模型的消耗情况。如果输入内容超过了模型窗口，模型可能不会回应且计费系统仍会扣费！</small>
      <div style="margin-top: 10px">
        <label>估算内容</label>
        <el-input
            v-model="inputText"
            :rows="5"
            placeholder="请输入文本"
            type="textarea"
            @input="calculateTokens"
        />
        <el-text class="mt-3 block">
          Token 数量: {{ tokenCount }}
        </el-text>
        <el-text class="mt-3 block">
          字符 数量: {{ charCount }}
        </el-text>
      </div>
    </template>
  </el-card>
</template>

<script lang="ts" setup>
import {onMounted, ref} from 'vue';

import {Tiktoken} from "tiktoken/lite";
import cl100k_base from "tiktoken/encoders/cl100k_base.json";

const inputText = ref('');
const tokenCount = ref(0);
const charCount = ref(0);
let enc: Tiktoken;

onMounted(async () => {
  enc = new Tiktoken(
      cl100k_base.bpe_ranks,
      cl100k_base.special_tokens,
      cl100k_base.pat_str
  );
});


const calculateTokens = () => {
  let tokens: any;

  if (enc) {
    tokens = enc.encode(inputText.value)
    tokenCount.value = tokens.length;
    charCount.value = inputText.value.length;
  }

};
</script>

<style scoped>
.mt-3 {
  margin-top: 12px;
}

.block {
  display: block;
}


</style>