'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7002'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    async function init() {
      // 检查 URL 是否携带 SSO ticket
      const params = new URLSearchParams(window.location.search)
      const ticket = params.get('ticket')

      if (ticket) {
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
            // 清除 URL 中的 ticket 参数后跳转
            router.replace('/projects')
            return
          }
        } catch {
          // exchange 失败，降级到普通登录
        }
      }

      // 无 ticket 或 exchange 失败，走普通登录流程
      const token = localStorage.getItem('jiezu_token')
      router.replace(token ? '/projects' : '/auth')
    }

    init()
  }, [router])

  return null
}
