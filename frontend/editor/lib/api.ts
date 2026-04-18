// 使用相对路径，由 next.config.ts rewrites 代理到后端
// 这样无论本机还是局域网其他机器访问，都不会硬编码 IP
const BASE_URL = ''

function getToken() {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('jiezu_token')
}

async function request(path: string, options: RequestInit = {}) {
  const token = getToken()
  // 将 /api/* 替换为 /jiezu-api/*，走 Next.js rewrites 代理
  const proxyPath = path.replace(/^\/api\//, '/jiezu-api/')
  const res = await fetch(`${BASE_URL}${proxyPath}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  })
  const data = await res.json()
  if (res.status === 401) {
    import('sonner').then(({ toast }) => {
      toast.error('登录已过期，请重新登录')
    })
  }
  return { status: res.status, data }
}

// ── Auth ──────────────────────────────────────────────────

export async function apiRegister(phone: string, password: string) {
  return request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ phone, password }),
  })
}

export async function apiLogin(phone: string, password: string) {
  return request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ phone, password }),
  })
}

export async function apiGetMe() {
  return request('/api/auth/me')
}

// ── Projects ──────────────────────────────────────────────

export async function apiGetProjects() {
  return request('/api/projects')
}

export async function apiCreateProject(name: string) {
  return request('/api/projects', {
    method: 'POST',
    // 当前前端没有“是否共享”设置入口，新建项目默认按共享项目创建
    body: JSON.stringify({ name, is_private: 0 }),
  })
}

export async function apiGetProject(id: number | string) {
  return request(`/api/projects/${id}`)
}

export async function apiSaveProject(
  id: number | string,
  payload: { name?: string; scene?: object; thumbnail_url?: string },
) {
  return request(`/api/projects/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export async function apiDeleteProject(id: number | string) {
  return request(`/api/projects/${id}`, { method: 'DELETE' })
}

// ── File Upload ───────────────────────────────────────────

export async function apiUpload(file: File) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('jiezu_token') : null
  const form = new FormData()
  form.append('file', file)
  const res = await fetch(`/jiezu-api/upload`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: form,
  })
  const data = await res.json()
  return { status: res.status, data }
}
