'use client'

import { apiGetProject, apiSaveProject } from '@/lib/api'
import {
  Editor,
  type SidebarTab,
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
]

export default function EditorPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string
  const [projectName, setProjectName] = useState('')
  const [ready, setReady] = useState(false)
  const initialSceneRef = useRef<any>(null)

  // 鉴权检查 + 加载项目
  useEffect(() => {
    const token = localStorage.getItem('jiezu_token')
    if (!token) { router.replace('/auth'); return }

    apiGetProject(projectId).then(res => {
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

  // onSave：保存到后端
  const handleSave = useCallback(async (scene: any) => {
    await apiSaveProject(projectId, { scene })
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

  return (
    <div className="h-screen w-screen">
      <Editor
        layoutVersion="v2"
        onLoad={handleLoad}
        onSave={handleSave}
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
