import { h, defineComponent } from "vue";
import { Icon as IconifyIcon, addIcon } from "@iconify/vue/dist/offline";

// Iconify Icon在Vue里本地使用（用于内网环境）https://docs.iconify.design/icon-components/vue/offline.html
export default defineComponent({
  name: "IconifyIconOffline",
  components: { IconifyIcon },
  props: {
    icon: {
      type: [String, Object],
      default: ""
    }
  },
  render() {
    if (typeof this.icon === "object") addIcon(this.icon as any, this.icon as any);
    const attrs = this.$attrs;
    return h(
      IconifyIcon,
      {
        icon: this.icon as any,
        style: attrs?.style
          ? Object.assign(attrs.style, { outline: "none" })
          : { outline: "none" },
        ...attrs
      },
      {
        default: () => []
      }
    );
  }
});
