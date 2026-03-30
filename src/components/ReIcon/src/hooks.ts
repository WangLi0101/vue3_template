import type { iconType } from "./types";
import type { Component } from "vue";
import { defineComponent, h } from "vue";
import type { IconifyIcon as IconifyIconType } from "@iconify/vue/dist/offline";
import { IconifyIconOnline, IconifyIconOffline, FontIcon } from "../index";

/**
 * 支持 `iconfont`、自定义 `svg` 以及 `iconify` 中所有的图标
 * @see 点击查看文档图标篇 {@link https://yiming_chang.gitee.io/pure-admin-doc/pages/icon/}
 * @param icon 必传 图标
 * @param attrs 可选 iconType 属性
 * @returns Component
 */
export function useRenderIcon(
  icon: string | IconifyIconType | Component,
  attrs?: iconType,
): Component {
  // iconfont
  const ifReg = /^IF-/;
  if (typeof icon === "string" && ifReg.test(icon)) {
    // iconfont
    const name = icon.split(ifReg)[1];
    const iconName = name.slice(0, name.indexOf(" ") === -1 ? name.length : name.indexOf(" "));
    const iconType = name.slice(name.indexOf(" ") + 1, name.length);
    return defineComponent({
      name: "FontIcon",
      render() {
        return h(FontIcon, {
          icon: iconName,
          iconType,
          ...attrs,
        });
      },
    });
  }

  if (typeof icon === "string") {
    // 通过是否存在 : 符号来判断是在线还是本地图标，存在即是在线图标，反之
    return defineComponent({
      name: "ReIcon",
      render() {
        if (icon.includes(":")) {
          return h(IconifyIconOnline, {
            icon: icon,
            ...attrs,
          });
        }

        return h(IconifyIconOffline, {
          icon: icon,
          ...attrs,
        });
      },
    });
  }

  if (
    typeof icon === "function" ||
    (typeof icon === "object" && icon !== null && ("render" in icon || "setup" in icon))
  ) {
    // svg
    return icon;
  }

  if (typeof icon === "object" && icon !== null) {
    return defineComponent({
      name: "OfflineIcon",
      render() {
        return h(IconifyIconOffline, {
          icon: icon as IconifyIconType,
          ...attrs,
        });
      },
    });
  }

  return IconifyIconOffline;
}
