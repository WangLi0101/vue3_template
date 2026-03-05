import { createApp } from "vue";
import ElementPlus from "element-plus";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import "element-plus/theme-chalk/src/index.scss";
import "element-plus/theme-chalk/dark/css-vars.css";
import App from "@/App.vue";
import { setupPermissionDirective } from "@/directives";
import { setupRouterGuards } from "@/router/guard";
import "@/styles/tailwind.css";
import "@/styles/index.scss";
import { setupStore, store } from "./stores";
import { useThemeStore } from "./stores/modules/theme";
import router, { setupRouter } from "./router";

const app = createApp(App);
setupRouter(app);
setupStore(app);
const themeStore = useThemeStore(store);
themeStore.initTheme();
setupRouterGuards(router);

app.use(ElementPlus, { locale: zhCn });

setupPermissionDirective(app);

app.mount("#app");
