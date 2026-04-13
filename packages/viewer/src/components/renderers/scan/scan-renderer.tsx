import { type ScanNode, useRegistry } from '@pascal-app/core'
import { Suspense, useMemo, useRef } from 'react'
import type { Group, Material, Mesh, Object3D } from 'three'
import { useLoader } from '@react-three/fiber'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import { useAssetUrl } from '../../../hooks/use-asset-url'
import { useGLTFKTX2 } from '../../../hooks/use-gltf-ktx2'
import useViewer from '../../../store/use-viewer'

export const ScanRenderer = ({ node }: { node: ScanNode }) => {
  const showScans = useViewer((s) => s.showScans)
  const ref = useRef<Group>(null!)
  useRegistry(node.id, 'scan', ref)

  const resolvedUrl = useAssetUrl(node.url)

  // 简单根据扩展名选择加载器（http/blob URL 都支持）
  const ext = ((): string | null => {
    if (!resolvedUrl) return null
    try {
      const u = new URL(resolvedUrl)
      const p = u.pathname.toLowerCase()
      if (p.endsWith('.glb') || p.endsWith('.gltf')) return 'gltf'
      if (p.endsWith('.obj')) return 'obj'
      return null
    } catch {
      const p = resolvedUrl.toLowerCase()
      if (p.includes('.glb') || p.includes('.gltf')) return 'gltf'
      if (p.includes('.obj')) return 'obj'
      return null
    }
  })()

  return (
    <group position={node.position} ref={ref} rotation={node.rotation} scale={[node.scale, node.scale, node.scale]} visible={showScans}>
      {resolvedUrl && (
        <Suspense>
          {ext === 'obj' ? (
            <ScanModelOBJ opacity={node.opacity} url={resolvedUrl} />
          ) : (
            <ScanModelGLTF opacity={node.opacity} url={resolvedUrl} />
          )}
        </Suspense>
      )}
    </group>
  )
}

const applyOpacity = (root: Object3D, opacity: number) => {
  const normalizedOpacity = opacity / 100
  const isTransparent = normalizedOpacity < 1
  root.traverse((child) => {
    const mesh = child as Mesh
    if ((mesh as Mesh).isMesh) {
      // Disable raycasting
      mesh.raycast = () => {}
      // Exclude from bounding box calculations
      mesh.geometry.boundingBox = null as any
      mesh.geometry.boundingSphere = null as any
      mesh.frustumCulled = false

      const updateMaterial = (material: Material) => {
        if (isTransparent) {
          material.transparent = true
          material.opacity = normalizedOpacity
          material.depthWrite = false
        } else {
          material.transparent = false
          material.opacity = 1
          material.depthWrite = true
        }
        material.needsUpdate = true
      }

      if (Array.isArray(mesh.material)) {
        mesh.material.forEach((m) => updateMaterial(m))
      } else if (mesh.material) {
        updateMaterial(mesh.material)
      }
    }
  })
}

const ScanModelGLTF = ({ url, opacity }: { url: string; opacity: number }) => {
  const gltf = useGLTFKTX2(url) as any
  const scene = gltf.scene
  useMemo(() => {
    applyOpacity(scene, opacity)
  }, [scene, opacity])
  return <primitive object={scene} />
}

const ScanModelOBJ = ({ url, opacity }: { url: string; opacity: number }) => {
  const obj = useLoader(OBJLoader, url) as Object3D
  useMemo(() => {
    applyOpacity(obj, opacity)
  }, [obj, opacity])
  return <primitive object={obj} />
}
