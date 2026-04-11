'use client'

import { apiLogin, apiRegister } from '@/lib/api'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function AuthPage() {
  const router = useRouter()
  const [tab, setTab] = useState<'login' | 'register'>('login')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // 已登录则跳转
  useEffect(() => {
    if (localStorage.getItem('jiezu_token')) {
      router.replace('/projects')
    }
  }, [router])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const fd = new FormData(e.currentTarget)
    const phone = fd.get('phone') as string
    const password = fd.get('password') as string

    try {
      let res
      if (tab === 'login') {
        res = await apiLogin(phone, password)
      } else {
        res = await apiRegister(phone, password)
      }

      if (res.data.code !== 0) {
        setError(res.data.message || '操作失败')
      } else {
        localStorage.setItem('jiezu_token', res.data.data.token)
        localStorage.setItem('jiezu_user', JSON.stringify(res.data.data.user))
        router.push('/projects')
      }
    } catch {
      setError('网络错误，请检查后端服务是否启动')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-bg">
      {/* 背景装饰 */}
      <div className="auth-grid" />
      <div className="auth-glow" />

      <div className="auth-card">
        {/* Logo */}
        <div className="auth-logo">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <rect width="36" height="36" rx="10" fill="#1a1a2e" />
            <path d="M8 28V12l10-4 10 4v16" stroke="#6366f1" strokeWidth="2" strokeLinejoin="round"/>
            <rect x="14" y="18" width="8" height="10" rx="1" fill="#6366f1" opacity="0.8"/>
            <path d="M10 16h16" stroke="#6366f1" strokeWidth="1.5" opacity="0.5"/>
          </svg>
          <span className="auth-logo-text">捷租建造</span>
        </div>

        <p className="auth-subtitle">专业建筑空间沙盘演练及设计工具</p>

        {/* Tab 切换 */}
        <div className="auth-tabs">
          <button
            className={`auth-tab ${tab === 'login' ? 'active' : ''}`}
            onClick={() => { setTab('login'); setError('') }}
            type="button"
          >
            登录
          </button>
          <button
            className={`auth-tab ${tab === 'register' ? 'active' : ''}`}
            onClick={() => { setTab('register'); setError('') }}
            type="button"
          >
            注册
          </button>
          <div className={`auth-tab-indicator ${tab === 'register' ? 'right' : 'left'}`} />
        </div>

        {/* 表单 */}
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="phone">手机号</label>
            <input
              autoComplete="tel"
              id="phone"
              name="phone"
              pattern="^1[3-9]\d{9}$"
              placeholder="请输入 11 位手机号"
              required
              type="tel"
              maxLength={11}
            />
          </div>
          <div className="auth-field">
            <label htmlFor="password">密码</label>
            <input
              autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
              id="password"
              minLength={6}
              name="password"
              placeholder={tab === 'login' ? '输入密码' : '至少 6 位'}
              required
              type="password"
            />
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button className="auth-submit" disabled={loading} type="submit">
            {loading ? (
              <span className="auth-spinner" />
            ) : (
              tab === 'login' ? '登录' : '创建账号'
            )}
          </button>
        </form>

        <p className="auth-footer">
          {tab === 'login' ? '还没有账号？' : '已有账号？'}
          <button
            onClick={() => { setTab(tab === 'login' ? 'register' : 'login'); setError('') }}
            type="button"
          >
            {tab === 'login' ? '立即注册' : '去登录'}
          </button>
        </p>
      </div>

      <style>{`
        .auth-bg {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #0a0a14;
          position: relative;
          overflow: hidden;
          font-family: var(--font-barlow), sans-serif;
        }
        .auth-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(99,102,241,.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,102,241,.06) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        .auth-glow {
          position: absolute;
          top: 20%;
          left: 50%;
          transform: translateX(-50%);
          width: 600px;
          height: 400px;
          background: radial-gradient(ellipse, rgba(99,102,241,.15) 0%, transparent 70%);
          pointer-events: none;
        }
        .auth-card {
          position: relative;
          z-index: 1;
          background: rgba(15,15,28,.85);
          border: 1px solid rgba(99,102,241,.2);
          border-radius: 20px;
          padding: 40px 44px;
          width: 420px;
          backdrop-filter: blur(20px);
          box-shadow: 0 0 60px rgba(99,102,241,.08), 0 24px 64px rgba(0,0,0,.4);
        }
        .auth-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 6px;
        }
        .auth-logo-text {
          font-size: 22px;
          font-weight: 700;
          color: #fff;
          letter-spacing: -0.5px;
        }
        .auth-subtitle {
          color: rgba(255,255,255,.4);
          font-size: 13px;
          margin: 0 0 28px;
        }
        .auth-tabs {
          position: relative;
          display: flex;
          background: rgba(255,255,255,.05);
          border-radius: 10px;
          padding: 3px;
          margin-bottom: 28px;
        }
        .auth-tab {
          flex: 1;
          padding: 8px;
          font-size: 14px;
          font-weight: 500;
          color: rgba(255,255,255,.45);
          border: none;
          background: transparent;
          cursor: pointer;
          position: relative;
          z-index: 1;
          border-radius: 8px;
          transition: color .2s;
        }
        .auth-tab.active {
          color: #fff;
        }
        .auth-tab-indicator {
          position: absolute;
          top: 3px;
          bottom: 3px;
          width: calc(50% - 3px);
          background: rgba(99,102,241,.5);
          border-radius: 8px;
          transition: left .25s cubic-bezier(.4,0,.2,1);
          border: 1px solid rgba(99,102,241,.4);
        }
        .auth-tab-indicator.left { left: 3px; }
        .auth-tab-indicator.right { left: calc(50%); }
        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .auth-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .auth-field label {
          font-size: 12px;
          font-weight: 500;
          color: rgba(255,255,255,.5);
          letter-spacing: .5px;
          text-transform: uppercase;
        }
        .auth-field input {
          background: rgba(255,255,255,.05);
          border: 1px solid rgba(255,255,255,.1);
          border-radius: 10px;
          padding: 11px 14px;
          color: #fff;
          font-size: 14px;
          outline: none;
          transition: border-color .2s, background .2s;
          font-family: inherit;
        }
        .auth-field input::placeholder { color: rgba(255,255,255,.2); }
        .auth-field input:focus {
          border-color: rgba(99,102,241,.6);
          background: rgba(99,102,241,.06);
        }
        .auth-error {
          background: rgba(239,68,68,.1);
          border: 1px solid rgba(239,68,68,.3);
          border-radius: 8px;
          color: #fca5a5;
          font-size: 13px;
          padding: 10px 14px;
          margin: 0;
        }
        .auth-submit {
          margin-top: 4px;
          padding: 13px;
          background: #6366f1;
          border: none;
          border-radius: 10px;
          color: #fff;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: background .2s, transform .15s;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: inherit;
        }
        .auth-submit:hover:not(:disabled) {
          background: #7c7ff5;
          transform: translateY(-1px);
        }
        .auth-submit:disabled { opacity: .6; cursor: not-allowed; }
        .auth-spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255,255,255,.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin .7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .auth-footer {
          text-align: center;
          margin-top: 20px;
          font-size: 13px;
          color: rgba(255,255,255,.35);
        }
        .auth-footer button {
          background: none;
          border: none;
          color: #818cf8;
          cursor: pointer;
          font-size: 13px;
          margin-left: 4px;
          padding: 0;
          font-family: inherit;
        }
        .auth-footer button:hover { color: #a5b4fc; text-decoration: underline; }
      `}</style>
    </div>
  )
}
