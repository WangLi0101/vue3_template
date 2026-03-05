export type PermissionCode = string

export interface AppRouteMeta {
  title: string
  icon?: string
  hidden?: boolean
  keepAlive?: boolean
  permission?: PermissionCode | PermissionCode[]
  requiresAuth?: boolean
  public?: boolean
}

export interface AppMenu {
  id: string
  name: string
  path: string
  component: string
  redirect?: string
  meta: AppRouteMeta
  children?: AppMenu[]
}

export interface AuthUser {
  id: string
  username: string
  displayName: string
}

export interface LoginPayload {
  username: string
  password: string
}

export interface LoginResponse {
  accessToken: string
}

export interface ProfileResponse {
  user: AuthUser
  roles: string[]
  permissions: PermissionCode[]
  menus: AppMenu[]
}
