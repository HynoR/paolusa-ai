import ChatInfo from './components/ChatInfo.vue'
import WarningInfo from './components/WarningInfo.vue'
import BalanceDetails from './components/BalanceDetails.vue'
import ModelList from './components/ModelList.vue'
import RechargeForm from './components/RechargeForm.vue'
import { createRouter,createWebHashHistory } from 'vue-router'
import TiktokenPage from "./components/TiktokenPage.vue";
import SDXLPage from "./components/SDXLPage.vue";
import Flux1Page from "./components/Flux1.vue";
const routes = [
    { path: '/', component: ChatInfo},
    { path: '/info', component: ChatInfo},
    { path: '/warninginfo', component: WarningInfo},
    { path: '/usage', component: BalanceDetails},
    { path: '/model', component: ModelList},
    { path: '/recharge', component: RechargeForm},
    { path: '/about', component: WarningInfo},
    { path: '/tiktoken',component: TiktokenPage},
    { path: '/sdxl',component: SDXLPage},
    {path: '/flux1',component: Flux1Page}



]


export const router = createRouter({
    // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
    //history: createWebHashHistory(),
    history: createWebHashHistory(),
    routes, // `routes: routes` 的缩写
})
