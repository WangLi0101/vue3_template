/// <reference types="vite/client" />

declare module "*.vue" {
  import type { DefineComponent } from "vue";

  const component: DefineComponent<Record<string, never>, Record<string, never>, unknown>;
  export default component;
}

declare module "*.svg?component" {
  import type { FunctionalComponent, SVGAttributes } from "vue";

  const component: FunctionalComponent<SVGAttributes>;
  export default component;
}
