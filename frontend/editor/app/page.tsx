'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7002'

export default function Home() {
  const router = useRouter()
  // 防止 React StrictMode 开发环境下 useEffect 双重执行
  // ticket 是一次性的，第二次调用会因 ticket 已失效而 exchange 失败
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    async function init() {
      // 检查 URL 是否携带 SSO ticket
      const params = new URLSearchParams(window.location.search)
      const ticket = params.get('ticket')

      if (ticket) {
        // 收到新 ticket 时先清掉旧 token，避免旧 payload 残留导致 401
        localStorage.removeItem('jiezu_token')
        localStorage.removeItem('jiezu_user')
        // 用 ticket 换 jiezu_token
        try {
          const res = await fetch(`${BASE_URL}/api/sso/exchange`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ticket }),
          })
          const data = await res.json()
          if (data.code === 0) {
            localStorage.setItem('jiezu_token', data.data.token)
            localStorage.setItem('jiezu_user', JSON.stringify(data.data.user))
            router.replace('/projects')
            return
          }
          // exchange 返回非 0：ticket 无效/过期，跳转登录页
          router.replace('/auth')
        } catch {
          // 网络异常，跳转登录页
          router.replace('/auth')
        }
        return
      }

      // 无 ticket，走普通登录流程
      const token = localStorage.getItem('jiezu_token')
      router.replace(token ? '/projects' : '/auth')
    }

    init()
  }, [router])

  return null
}

