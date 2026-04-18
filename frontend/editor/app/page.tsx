'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'

export default function Home() {
  const router = useRouter()
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    async function init() {
      const params = new URLSearchParams(window.location.search)
      const ticket = params.get('ticket')

      if (ticket) {
        localStorage.removeItem('jiezu_token')
        localStorage.removeItem('jiezu_user')
        try {
          const res = await fetch(`/jiezu-api/sso/exchange`, {
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
          router.replace('/auth')
        } catch {
          router.replace('/auth')
        }
        return
      }

      const token = localStorage.getItem('jiezu_token')
      router.replace(token ? '/projects' : '/auth')
    }

    init()
  }, [router])

  return null
}

