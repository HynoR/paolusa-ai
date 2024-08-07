<template>
  <el-card class="box-card">
    <el-descriptions :column="1" border>
      <el-descriptions-item label="您的ChatKey">
        <el-tag type="success" @click="doCopy">{{ 'sk-' + maskChatKey }}</el-tag>
        <el-button size="small" style="margin-left: 10px" @click="toggleChatKey">
          {{ showFullKey ? '隐藏' : '显示' }} Key
        </el-button>
        <el-button size="small" @click="doCopy">
          复制Key
        </el-button>

      </el-descriptions-item>
      <el-descriptions-item label="OpenAI接口地址">
        <p>默认地址：<span style="color:#E2943B">{{ apiHost }}</span></p>
        <p>大陆备用: <span style="color:#E2943B">{{ apiHostBackup }}</span></p>
        <p>大陆备用2: <span style="color:#E2943B"> https://visa-hkapp-api.mujika.xyz </span></p>
        <p>lobeChat和某些软件需要额外在地址后面加上 /v1 或者完整的 /v1/chat/completions</p>
        <p>接口网络默认为CloudflareCDN，如大陆直连可尝试更换接口地址到大陆备用地址</p>
      </el-descriptions-item>
    </el-descriptions>

    <el-alert :closable="false"
              show-icon
              style="margin-top: 20px"
              title="您的ChatKey是私密信息，请勿泄露给他人，否则可能导致您的账号被滥用"
              type="warning"
    />
    <el-alert :closable="false"
              :title="'我们已根据您在跑路云的套餐赠送了免费的额度（套餐可用不足一个月不会赠送），每次续费套餐后可在额度详情中领取免费额度，如需更多额度请自行充值'"
              show-icon
              style="margin-top: 20px"
              type="info"
    />
    <div class="quick-actions">
      <h4>一键使用：</h4>
      <el-button type="success" @click="openWebAppPro">点我开始使用(WebApp)</el-button>
      <el-button type="warning" @click="OpenAbout">使用技巧</el-button>
      <div>
        <small> 带有Eco为逆向方式得到的模型，比正式模型的折后价更便宜但降低了稳定性，阉割了部分功能，只适合小量使用。</small>
      </div>
      <div>
        <small> PlayGround WebApp已停止维护，未来将继续使用Pro版本 chat.nloli.xyz 作为更新主线。</small>
      </div>
      <div>
        <small style="color:red"> 如果您是初次接触改产品，强烈建议阅读"使用技巧"来达到以最优的成本使用AI</small>
      </div>
      <div>
        <small style="color:red"> 灵车API不能完全确保稳定性，如果出现模型失效、过于卡顿(一分钟以上)、无效扣费等情况，请尝试切换其他模型或在群内反馈，如有错误扣费可在群内反馈获得补偿。反馈官网客服没有用，官网客服仅处理机场问题</small>
    </div>
    </div>

    <div class="other-clients">
      <h4>其他客户端：</h4>
      <el-button type="primary" @click="openNextChat">使用NextChat网页</el-button>
      <el-button type="success" @click="openWebApp">使用LobeChat(WebApp PlayGround)</el-button>
      <el-button type="primary" @click="openBotGem">使用BotGem客户端(Android)</el-button>
      <el-button type="primary" @click="openOpenCat">使用OpenCat客户端(macOS、iOS)</el-button>
      <el-button type="primary" @click="openMidjounary">使用MidJourney绘图网页端</el-button>
    </div>

    <div class="integration">
      <h4>其他集成用途：</h4>
      <el-button type="success" @click="openWiki">WIKI</el-button>

    </div>

    <p>上述按钮点击后正常情况下会自动导入配置，需要手动同意导入后<span
        class="text-danger font-weight-bold">并在设置中选择模型</span>即可使用。</p>
    <p>
      如果无法自动导入，请在设置中选择启用"自定义接口"，"模型服务商"选择"OPENAI"，接口地址填入本站接口地址,密钥填入上面的Key即可。</p>
    <p>
      聊天网站在一次导入配置后永久保存，除非更换key，无需再访问此页面导入配置，直接访问聊天网站即可。如果您是在公共电脑上使用，请务必在使用后清空浏览器缓存避免泄露。</p>
    <el-divider/>
  </el-card>
</template>

<script setup>
import {onMounted, ref} from 'vue';
import {ElMessageBox} from 'element-plus';
import {router} from "../route.js";

const apiKey = ref('');
const apiHost = ref('');
const apiHostBackup = ref('');
const createdAt = ref('');
const expiredAt = ref('');
const amountUsed = ref(0);
const amountRemain = ref(0);
const id = ref('');
const cToken = ref('');

const showFullKey = ref(false);
const maskChatKey = ref('********');

import {GetCtoken, GetUserInfo} from '../js/data.js';

onMounted(async () => {
  // 从sessionStorage读取token
  const userInfo = GetUserInfo();
  cToken.value = GetCtoken();
  console.log(userInfo);

  apiKey.value = userInfo.api_key;
  if (apiKey.value.length <= 0) {
    ElMessageBox.alert('ApiKey申请完毕,点击获取', '通知', {
      // if you want to disable its autofocus
      autofocus: false,
      confirmButtonText: 'OK',
      callback: (action) => {
        // 刷新网页
        window.location.reload();
      },
    })
  }

  apiHost.value = userInfo.api_host;
  apiHostBackup.value = userInfo.api_host_backup;
  createdAt.value = userInfo.created_at;
  expiredAt.value = userInfo.expired_at;
  amountUsed.value = userInfo.amount_used;
  amountRemain.value = userInfo.amount_remain;
  id.value = userInfo.id || 'Unknown';
  maskChatKey.value = '*'.repeat(apiKey.value.length);
});

const OpenAbout = () =>{
  router.push('/about?token=' + cToken.value)

}

const doCopy = () => {
  navigator.clipboard.writeText('sk-'+apiKey.value).then(() => {
    ElMessageBox.alert('已复制到剪贴板', '通知', {
      confirmButtonText: 'OK',
    });
  });
};

const toggleChatKey = () => {
  showFullKey.value = !showFullKey.value;
  maskChatKey.value = showFullKey.value ? apiKey.value : '*'.repeat(apiKey.value.length);
};

const openWebApp = () => {
  const lobe = `{"keyVaults":{"openai":{"apiKey":"${apiKey.value}","baseURL":"${apiHost.value}/v1"}},"languageModel":{"openai":{"fetchOnClient":true}},"systemAgent":{"topic":{"model":"gemini-1.5-flash","provider":"openai"}}}`;
  window.open('https://gpt2.nloli.xyz/?settings=' + encodeURIComponent(lobe), '_blank');
};

const openWebAppPro = () => {
  const lobe = `{"keyVaults":{"openai":{"apiKey":"${apiKey.value}"}},"languageModel":{"openai":{"fetchOnClient":false}},"systemAgent":{"topic":{"model":"gemini-1.5-flash","provider":"openai"}}}`;
  window.open('https://chat.nloli.xyz/?settings=' + encodeURIComponent(lobe), '_blank');
};

const openNextChat = () => {
  window.open(`https://gpt.nloli.xyz/#/?settings=%7B%22key%22%3A%22${apiKey.value}%22%2C%22url%22%3A%22${apiHost.value}%22%7D`, '_blank');
};

const openBotGem = () => {
  window.open('ama://set-api-key?server=' + apiHost.value + '&key=' + apiKey.value, '_blank');
};

const openOpenCat = () => {
  window.open('opencat://team/join?domain=' + apiHost.value + '&key=' + apiKey.value, '_blank');
};

const openMidjounary = () => {
  window.open('https://mjchat.nloli.xyz/#/draw/1002', '_blank');
};

const openWiki = () => {
  window.open('https://github.com/deepseek-ai/awesome-deepseek-integration/blob/main/README_cn.md', '_blank');
};

const scrollToRecharge = () => {
  // 实现滚动到充值区域的逻辑
};

const scrollToBalance = () => {
  // 实现滚动到余额区域的逻辑
};

const scrollToModel = () => {
  // 实现滚动到模型区域的逻辑
};
</script>

<style scoped>
.box-card {
  margin-bottom: 20px;
}

.text-danger {
  color: #F56C6C;
}

.font-weight-bold {
  font-weight: bold;
}

.quick-actions, .other-clients, .integration {
  margin-top: 20px;
}

.el-button {
  margin-right: 10px;
  margin-bottom: 10px;
}
</style>