export interface AppRouteMeta {
  title: string;
  icon?: string;
  rank?: number;
  hidden?: boolean;
  keepAlive?: boolean;
  skipAuth?: boolean;
}

export interface AppMenu {
  id: string;
  name: string;
  path: string;
  component?: string;
  redirect?: string;
  meta: AppRouteMeta;
  children?: AppMenu[];
}
