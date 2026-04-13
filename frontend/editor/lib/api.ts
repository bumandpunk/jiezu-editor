const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7001'

function getToken() {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('jiezu_token')
}

async function request(path: string, options: RequestInit = {}) {
  const token = getToken()
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  })
  const data = await res.json()
  if (res.status === 401) {
    // 动态引入避免 SSR 报错
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

export async function apiCreateProject(name: string, is_private = 1) {
  return request('/api/projects', {
    method: 'POST',
    body: JSON.stringify({ name, is_private }),
  })
}

export async function apiGetProject(id: number | string) {
  return request(`/api/projects/${id}`)
}

export async function apiSaveProject(
  id: number | string,
  payload: { name?: string; scene?: object; thumbnail_url?: string; is_private?: number },
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
  const res = await fetch(`${BASE_URL}/api/upload`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: form,
  })
  const data = await res.json()
  return { status: res.status, data }
}
