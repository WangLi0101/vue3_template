import NProgress from "nprogress";
import "nprogress/nprogress.css";

NProgress.configure({
  // 动画方式
  easing: "ease",
  // 递增进度条的速度（毫秒），从 500 降低到 200，让进度动画更干脆快响应
  speed: 200,
  // 是否显示加载ico
  showSpinner: false,
  // 自动递增间隔（毫秒），从 200 降低到 50，让假进度增加得更极速
  trickleSpeed: 50,
  // 初始化时的最小百分比，提升到 0.4，一开始直接冲到近半位置
  minimum: 0.4,
});

export default NProgress;
