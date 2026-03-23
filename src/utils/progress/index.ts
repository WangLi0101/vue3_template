import NProgress from "nprogress";
import "nprogress/nprogress.css";

NProgress.configure({
  // 更干脆的缓动，减少默认 ease 的拖拽感
  easing: "cubic-bezier(0.22, 1, 0.36, 1)",
  // 缩短位移动画时长，让开始和结束都更利落
  speed: 140,
  // 是否显示加载图标
  showSpinner: false,
  // 自动递增稍微放缓，避免频繁跳动导致体感不顺
  trickleSpeed: 120,
  // 降低初始进度，避免一出现就冲得过前
  minimum: 0.08,
});

export default NProgress;
