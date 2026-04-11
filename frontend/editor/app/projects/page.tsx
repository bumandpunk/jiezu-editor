'use client'

import { apiCreateProject, apiDeleteProject, apiGetProjects } from '@/lib/api'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

interface Project {
  id: number
  name: string
  thumbnail_url: string | null
  is_private: number
  created_at: string
  updated_at: string
}

interface User {
  id: number
  username: string
  email: string
}

export default function ProjectsPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [newName, setNewName] = useState('')
  const newInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const token = localStorage.getItem('jiezu_token')
    if (!token) { router.replace('/auth'); return }
    const u = localStorage.getItem('jiezu_user')
    if (u) setUser(JSON.parse(u))
    loadProjects()
  }, [router])

  useEffect(() => {
    if (showNew) setTimeout(() => newInputRef.current?.focus(), 50)
  }, [showNew])

  async function loadProjects() {
    setLoading(true)
    try {
      const res = await apiGetProjects()
      if (res.data.code === 0) {
        setProjects(res.data.data)
      } else if (res.status === 401) {
        localStorage.removeItem('jiezu_token')
        localStorage.removeItem('jiezu_user')
        router.replace('/auth')
      }
    } finally {
      setLoading(false)
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!newName.trim()) return
    setCreating(true)
    try {
      const res = await apiCreateProject(newName.trim())
      if (res.data.code === 0) {
        const p = res.data.data
        router.push(`/editor/${p.id}`)
      }
    } finally {
      setCreating(false)
    }
  }

  async function handleDelete(id: number, name: string, e: React.MouseEvent) {
    e.stopPropagation()
    if (!confirm(`确认删除项目「${name}」？此操作不可恢复。`)) return
    await apiDeleteProject(id)
    setProjects(prev => prev.filter(p => p.id !== id))
  }

  function handleLogout() {
    localStorage.removeItem('jiezu_token')
    localStorage.removeItem('jiezu_user')
    router.replace('/auth')
  }

  function formatDate(s: string) {
    const d = new Date(s)
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
  }

  return (
    <div className="pl-bg">
      <div className="pl-grid" />

      {/* 顶栏 */}
      <header className="pl-header">
        <div className="pl-header-inner">
          <div className="pl-logo">
            <svg width="28" height="28" viewBox="0 0 36 36" fill="none">
              <rect width="36" height="36" rx="10" fill="#1a1a2e" />
              <path d="M8 28V12l10-4 10 4v16" stroke="#6366f1" strokeWidth="2" strokeLinejoin="round"/>
              <rect x="14" y="18" width="8" height="10" rx="1" fill="#6366f1" opacity="0.8"/>
            </svg>
            <span className="pl-logo-text">捷租建造</span>
          </div>
          <div className="pl-header-right">
            {user && <span className="pl-username">{user.username}</span>}
            <button className="pl-logout" onClick={handleLogout} type="button">退出</button>
          </div>
        </div>
      </header>

      <main className="pl-main">
        <div className="pl-title-row">
          <h1 className="pl-title">我的项目</h1>
          <button className="pl-new-btn" onClick={() => setShowNew(true)} type="button">
            <svg fill="none" height="16" viewBox="0 0 16 16" width="16">
              <path d="M8 3v10M3 8h10" stroke="currentColor" strokeLinecap="round" strokeWidth="2"/>
            </svg>
            新建项目
          </button>
        </div>

        {/* 新建表单 */}
        {showNew && (
          <form className="pl-new-form" onSubmit={handleCreate}>
            <input
              className="pl-new-input"
              onChange={e => setNewName(e.target.value)}
              placeholder="输入项目名称..."
              ref={newInputRef}
              required
              type="text"
              value={newName}
            />
            <button className="pl-new-confirm" disabled={creating} type="submit">
              {creating ? '创建中...' : '确认'}
            </button>
            <button
              className="pl-new-cancel"
              onClick={() => { setShowNew(false); setNewName('') }}
              type="button"
            >
              取消
            </button>
          </form>
        )}

        {/* 项目列表 */}
        {loading ? (
          <div className="pl-loading">
            <div className="pl-spinner" />
            <span>加载中...</span>
          </div>
        ) : projects.length === 0 ? (
          <div className="pl-empty">
            <svg fill="none" height="64" viewBox="0 0 64 64" width="64">
              <rect height="40" rx="6" stroke="rgba(99,102,241,.4)" strokeWidth="1.5" width="40" x="12" y="18"/>
              <path d="M22 18V14a10 10 0 0120 0v4" stroke="rgba(99,102,241,.4)" strokeLinecap="round" strokeWidth="1.5"/>
              <circle cx="32" cy="36" fill="rgba(99,102,241,.4)" r="3"/>
            </svg>
            <p>还没有项目</p>
            <button className="pl-new-btn" onClick={() => setShowNew(true)} type="button">
              创建第一个项目
            </button>
          </div>
        ) : (
          <div className="pl-grid-list">
            {projects.map(p => (
              <div
                className="pl-card"
                key={p.id}
                onClick={() => router.push(`/editor/${p.id}`)}
              >
                <div className="pl-card-thumb">
                  {p.thumbnail_url ? (
                    <img alt={p.name} src={p.thumbnail_url} />
                  ) : (
                    <div className="pl-card-thumb-empty">
                      <svg fill="none" height="32" viewBox="0 0 36 36" width="32">
                        <path d="M8 28V12l10-4 10 4v16" stroke="rgba(99,102,241,.5)" strokeWidth="1.5" strokeLinejoin="round"/>
                        <rect x="14" y="18" width="8" height="10" rx="1" fill="rgba(99,102,241,.4)"/>
                      </svg>
                    </div>
                  )}
                  <button
                    className="pl-card-delete"
                    onClick={(e) => handleDelete(p.id, p.name, e)}
                    title="删除项目"
                    type="button"
                  >
                    <svg fill="none" height="14" viewBox="0 0 16 16" width="14">
                      <path d="M3 4h10M6 4V3h4v1M5 4l.5 9h5L11 4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/>
                    </svg>
                  </button>
                </div>
                <div className="pl-card-info">
                  <span className="pl-card-name">{p.name}</span>
                  <span className="pl-card-date">{formatDate(p.updated_at)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <style>{`
        .pl-bg {
          min-height: 100vh;
          background: #0a0a14;
          position: relative;
          font-family: var(--font-barlow), sans-serif;
          color: #fff;
        }
        .pl-grid {
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(rgba(99,102,241,.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,102,241,.04) 1px, transparent 1px);
          background-size: 40px 40px;
          pointer-events: none;
        }
        .pl-header {
          position: sticky;
          top: 0;
          z-index: 10;
          background: rgba(10,10,20,.85);
          border-bottom: 1px solid rgba(99,102,241,.12);
          backdrop-filter: blur(16px);
        }
        .pl-header-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 32px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .pl-logo {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .pl-logo-text {
          font-size: 17px;
          font-weight: 700;
          letter-spacing: -0.3px;
        }
        .pl-header-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .pl-username {
          font-size: 13px;
          color: rgba(255,255,255,.5);
        }
        .pl-logout {
          font-size: 13px;
          color: rgba(255,255,255,.4);
          background: none;
          border: 1px solid rgba(255,255,255,.1);
          border-radius: 7px;
          padding: 5px 12px;
          cursor: pointer;
          transition: all .15s;
          font-family: inherit;
        }
        .pl-logout:hover { color: #fff; border-color: rgba(255,255,255,.25); }
        .pl-main {
          max-width: 1200px;
          margin: 0 auto;
          padding: 48px 32px;
          position: relative;
        }
        .pl-title-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 32px;
        }
        .pl-title {
          font-size: 28px;
          font-weight: 700;
          letter-spacing: -0.5px;
          margin: 0;
        }
        .pl-new-btn {
          display: flex;
          align-items: center;
          gap: 7px;
          background: #6366f1;
          border: none;
          border-radius: 10px;
          color: #fff;
          font-size: 14px;
          font-weight: 600;
          padding: 9px 18px;
          cursor: pointer;
          transition: background .15s, transform .15s;
          font-family: inherit;
        }
        .pl-new-btn:hover { background: #7c7ff5; transform: translateY(-1px); }
        .pl-new-form {
          display: flex;
          gap: 10px;
          align-items: center;
          background: rgba(99,102,241,.06);
          border: 1px solid rgba(99,102,241,.2);
          border-radius: 12px;
          padding: 14px 18px;
          margin-bottom: 28px;
        }
        .pl-new-input {
          flex: 1;
          background: rgba(255,255,255,.06);
          border: 1px solid rgba(255,255,255,.1);
          border-radius: 8px;
          color: #fff;
          font-size: 14px;
          padding: 8px 12px;
          outline: none;
          font-family: inherit;
        }
        .pl-new-input:focus { border-color: rgba(99,102,241,.5); }
        .pl-new-input::placeholder { color: rgba(255,255,255,.25); }
        .pl-new-confirm {
          background: #6366f1;
          border: none;
          border-radius: 8px;
          color: #fff;
          font-size: 13px;
          font-weight: 600;
          padding: 8px 16px;
          cursor: pointer;
          font-family: inherit;
          transition: background .15s;
        }
        .pl-new-confirm:hover { background: #7c7ff5; }
        .pl-new-cancel {
          background: transparent;
          border: 1px solid rgba(255,255,255,.1);
          border-radius: 8px;
          color: rgba(255,255,255,.45);
          font-size: 13px;
          padding: 8px 14px;
          cursor: pointer;
          font-family: inherit;
          transition: all .15s;
        }
        .pl-new-cancel:hover { color: #fff; border-color: rgba(255,255,255,.25); }
        .pl-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 80px 0;
          color: rgba(255,255,255,.4);
          font-size: 14px;
        }
        .pl-spinner {
          width: 20px; height: 20px;
          border: 2px solid rgba(99,102,241,.3);
          border-top-color: #6366f1;
          border-radius: 50%;
          animation: spin .7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .pl-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
          padding: 100px 0;
          color: rgba(255,255,255,.35);
          font-size: 15px;
        }
        .pl-empty p { margin: 0; }
        .pl-grid-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 20px;
        }
        .pl-card {
          background: rgba(255,255,255,.04);
          border: 1px solid rgba(255,255,255,.08);
          border-radius: 14px;
          overflow: hidden;
          cursor: pointer;
          transition: all .2s;
        }
        .pl-card:hover {
          border-color: rgba(99,102,241,.4);
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(99,102,241,.1);
        }
        .pl-card-thumb {
          position: relative;
          aspect-ratio: 16/9;
          background: rgba(255,255,255,.03);
          overflow: hidden;
        }
        .pl-card-thumb img {
          width: 100%; height: 100%;
          object-fit: cover;
        }
        .pl-card-thumb-empty {
          width: 100%; height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .pl-card-delete {
          position: absolute;
          top: 8px; right: 8px;
          background: rgba(10,10,20,.8);
          border: 1px solid rgba(255,255,255,.1);
          border-radius: 7px;
          color: rgba(255,255,255,.5);
          width: 28px; height: 28px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          opacity: 0;
          transition: opacity .15s, color .15s;
          backdrop-filter: blur(8px);
        }
        .pl-card:hover .pl-card-delete { opacity: 1; }
        .pl-card-delete:hover { color: #f87171; }
        .pl-card-info {
          padding: 12px 14px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .pl-card-name {
          font-size: 14px;
          font-weight: 600;
          color: rgba(255,255,255,.9);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .pl-card-date {
          font-size: 11px;
          color: rgba(255,255,255,.3);
        }
      `}</style>
    </div>
  )
}
