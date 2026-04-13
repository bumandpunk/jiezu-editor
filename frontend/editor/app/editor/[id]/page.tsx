'use client'

import { apiGetProject, apiSaveProject, apiUpload } from '@/lib/api'
import {
  Editor,
  type SidebarTab,
  SettingsPanel,
  ViewerToolbarLeft,
  ViewerToolbarRight,
} from '@pascal-app/editor'
import { saveAsset, useScene } from '@pascal-app/core'
import { useParams, useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'

const SIDEBAR_TABS: (SidebarTab & { component: React.ComponentType })[] = [
  {
    id: 'site',
    label: '场景',
    component: () => null,
  },
  {
    id: 'settings',
    label: '设置',
    component: SettingsPanel,
  },
]

// 检测是否为移动设备
function checkIsMobile() {
  if (typeof window === 'undefined') return false
  return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) || window.innerWidth < 768
}

export default function EditorPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string
  const [projectName, setProjectName] = useState('')
  const [ready, setReady] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const initialSceneRef = useRef<any>(null)

  useEffect(() => {
    setIsMobile(checkIsMobile())
  }, [])

  // 鉴权检查 + 加载项目
  useEffect(() => {
    const token = localStorage.getItem('jiezu_token')
    if (!token) { router.replace('/auth'); return }

    apiGetProject(projectId).then(res => {
      if (res.status === 401) {
        localStorage.removeItem('jiezu_token')
        localStorage.removeItem('jiezu_user')
        router.replace('/auth')
        return
      }
      if (res.data.code === 0) {
        const p = res.data.data
        setProjectName(p.name)
        if (p.scene) {
          initialSceneRef.current = p.scene
        }
        setReady(true)
      } else {
        router.replace('/projects')
      }
    })
  }, [projectId, router])

  // onLoad：返回已保存的场景
  const handleLoad = useCallback(async () => {
    return initialSceneRef.current ?? null
  }, [])

  // onSave：保存到后端，401 时跳转登录
  const handleSave = useCallback(async (scene: any) => {
    const res = await apiSaveProject(projectId, { scene })
    if (res.status === 401) {
      localStorage.removeItem('jiezu_token')
      localStorage.removeItem('jiezu_user')
      router.replace('/auth')
    }
  }, [projectId, router])

  // 缩略图生成后上传并更新项目
  const handleThumbnailCapture = useCallback(async (blob: Blob) => {
    try {
      const file = new File([blob], 'thumbnail.png', { type: 'image/png' })
      const res = await apiUpload(file)
      // 后端返回 { code: 0, data: { url: '...' } }，apiUpload 包了一层 { status, data }
      const url = res.data?.data?.url ?? res.data?.url
      if (url) {
        await apiSaveProject(projectId, { thumbnail_url: url })
      }
    } catch {
      // 缩略图上传失败不影响主流程
    }
  }, [projectId])

  // 上传 GLB/图片到本地 IndexedDB（本地版，后续可替换为 OSS）
  const handleUploadAsset = useCallback(
    async (_pid: string, levelId: string, file: File, type: 'scan' | 'guide') => {
      const assetUrl = await saveAsset(file)
      const id = crypto.randomUUID()
      const nodeId = `${type}_${id}` as any
      useScene.getState().createNode(
        {
          id: nodeId,
          type,
          url: assetUrl,
          name: file.name,
          position: [0, 0, 0],
          rotation: [0, 0, 0],
          scale: 1,
          opacity: type === 'scan' ? 100 : 50,
        } as any,
        levelId as any,
      )
    },
    [],
  )

  // 移动端提示页
  if (isMobile) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        height: '100vh', background: '#0a0a14', color: '#fff', padding: '0 32px',
        fontFamily: 'var(--font-barlow), sans-serif', textAlign: 'center', gap: 20,
      }}>
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <rect x="20" y="4" width="24" height="40" rx="4" stroke="rgba(99,102,241,.6)" strokeWidth="1.5"/>
          <rect x="28" y="38" width="8" height="2" rx="1" fill="rgba(99,102,241,.6)"/>
          <path d="M8 52h48" stroke="rgba(99,102,241,.3)" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M28 20l-8 8 8 8M36 20l8 8-8 8" stroke="rgba(99,102,241,.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <div>
          <p style={{ fontSize: 20, fontWeight: 700, margin: '0 0 8px' }}>请使用电脑访问</p>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,.45)', margin: 0, lineHeight: 1.7 }}>
            3D 编辑器需要较大屏幕和键鼠操作<br />
            请在 PC 或平板（横屏）上打开此页面
          </p>
        </div>
        <button
          onClick={() => router.push('/projects')}
          style={{
            marginTop: 8, padding: '10px 24px', background: 'rgba(99,102,241,.15)',
            border: '1px solid rgba(99,102,241,.3)', borderRadius: 10,
            color: '#818cf8', fontSize: 14, cursor: 'pointer', fontFamily: 'inherit',
          }}
          type="button"
        >
          返回项目列表
        </button>
      </div>
    )
  }

  if (!ready) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100vh', background: '#0a0a14', color: 'rgba(255,255,255,.4)',
        fontFamily: 'var(--font-barlow), sans-serif', gap: 12,
      }}>
        <div style={{
          width: 20, height: 20,
          border: '2px solid rgba(99,102,241,.3)',
          borderTopColor: '#6366f1',
          borderRadius: '50%',
          animation: 'spin .7s linear infinite',
        }} />
        加载项目中...
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  const sidebarHeader = (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '6px 8px',
      borderBottom: '1px solid rgba(255,255,255,0.08)',
    }}>
      <button
        onClick={() => router.push('/projects')}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '4px 8px', borderRadius: 6, border: 'none',
          background: 'transparent', color: 'rgba(255,255,255,0.5)',
          cursor: 'pointer', fontSize: 12, transition: 'color 0.15s',
        }}
        onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.9)')}
        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
        type="button"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        返回
      </button>
      {projectName && (
        <span style={{
          fontSize: 13,
          color: 'rgba(255,255,255,0.7)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          flex: 1,
          minWidth: 0,
        }}>
          {projectName}
        </span>
      )}
    </div>
  )

  return (
    <div className="h-screen w-screen">
      <Editor
        layoutVersion="v2"
        sidebarHeaderSlot={sidebarHeader}
        onLoad={handleLoad}
        onSave={handleSave}
        onThumbnailCapture={handleThumbnailCapture}
        projectId={projectId}
        sidebarTabs={SIDEBAR_TABS}
        sitePanelProps={{
          projectId,
          onUploadAsset: handleUploadAsset,
        }}
        viewerToolbarLeft={<ViewerToolbarLeft />}
        viewerToolbarRight={<ViewerToolbarRight />}
      />
    </div>
  )
}
