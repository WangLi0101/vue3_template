import type { PropType } from "vue";
import { h, defineComponent } from "vue";
import { Icon as IconifyIcon } from "@iconify/vue/dist/offline";
import type { IconifyIcon as IconifyIconType } from "@iconify/vue/dist/offline";

// Iconify Icon在Vue里本地使用（用于内网环境）https://docs.iconify.design/icon-components/vue/offline.html
export default defineComponent({
  name: "IconifyIconOffline",
  components: { IconifyIcon },
  props: {
    icon: {
      type: [String, Object] as PropType<string | IconifyIconType>,
      default: "",
    },
  },
  render() {
    const attrs = this.$attrs;
    return h(
      IconifyIcon,
      {
        icon: this.icon,
        style: attrs?.style ? Object.assign(attrs.style, { outline: "none" }) : { outline: "none" },
        ...attrs,
      },
      {
        default: () => [],
      },
    );
  },
});
