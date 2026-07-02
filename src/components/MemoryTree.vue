<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as THREE from 'three'

interface Memory {
  title: string
  cat: string
  date: string
  desc: string
  cover?: string
}

const props = defineProps<{ memories: Memory[] }>()
const emit = defineEmits<{ (e: 'select', memory: Memory): void }>()

const container = ref<HTMLDivElement>()
const tooltip = ref({ show: false, title: '', date: '', desc: '', x: 0, y: 0 })

let scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer
let photoNodes: THREE.Mesh[] = []
let glowRings: THREE.Mesh[] = []
let animationId: number
let mouseX = 0, mouseY = 0
let targetX = 0, targetY = 0
let raycaster: THREE.Raycaster
let mouse = new THREE.Vector2()
let hoveredNode: THREE.Mesh | null = null

const catColors: Record<string, number> = { '项目': 0x10b981, '学习': 0x06b6d4 }

function createNodeTexture(memory: Memory): THREE.Texture {
  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width = size; canvas.height = size
  const ctx = canvas.getContext('2d')!
  
  const r = 24
  ctx.beginPath()
  ctx.moveTo(r, 0); ctx.lineTo(size - r, 0)
  ctx.quadraticCurveTo(size, 0, size, r)
  ctx.lineTo(size, size - r)
  ctx.quadraticCurveTo(size, size, size - r, size)
  ctx.lineTo(r, size)
  ctx.quadraticCurveTo(0, size, 0, size - r)
  ctx.lineTo(0, r)
  ctx.quadraticCurveTo(0, 0, r, 0)
  ctx.closePath()
  
  const color = catColors[memory.cat] || 0x10b981
  ctx.fillStyle = `rgba(${(color >> 16) & 0xff}, ${(color >> 8) & 0xff}, ${color & 0xff}, 0.85)`
  ctx.fill()
  
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 22px Inter, system-ui, sans-serif'
  ctx.textAlign = 'center'
  const title = memory.title.length > 8 ? memory.title.slice(0, 7) + '..' : memory.title
  ctx.fillText(title, size / 2, size / 2 - 10)
  
  ctx.font = '14px Inter, system-ui, sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.7)'
  ctx.fillText(memory.date, size / 2, size / 2 + 24)
  
  ctx.font = '32px sans-serif'
  ctx.fillText(memory.cat === '项目' ? '🚀' : '📚', size / 2, size / 2 - 42)
  
  const tex = new THREE.CanvasTexture(canvas)
  tex.minFilter = THREE.LinearFilter
  return tex
}

onMounted(() => {
  if (!container.value) return
  initThree()
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('click', onClick)
  animate()
})

onUnmounted(() => {
  cancelAnimationFrame(animationId)
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('click', onClick)
  renderer?.dispose()
})

watch(() => props.memories, () => {
  // Clean up ALL nodes and rings
  photoNodes.forEach(n => scene.remove(n))
  glowRings.forEach(r => scene.remove(r))
  photoNodes = []
  glowRings = []
  buildNodes()
}, { deep: true })

function onMouseMove(e: MouseEvent) {
  targetX = (e.clientX / window.innerWidth) * 2 - 1
  targetY = -(e.clientY / window.innerHeight) * 2 + 1
  
  if (!container.value || !renderer) return
  const rect = container.value.getBoundingClientRect()
  mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
  mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
  
  raycaster.setFromCamera(mouse, camera)
  const intersects = raycaster.intersectObjects(photoNodes)
  
  if (intersects.length > 0) {
    const node = intersects[0].object as THREE.Mesh
    if (hoveredNode !== node) {
      if (hoveredNode) (hoveredNode.material as THREE.MeshBasicMaterial).opacity = 1
      hoveredNode = node;
      (node.material as THREE.MeshBasicMaterial).opacity = 0.7
      const m = node.userData.memory as Memory
      tooltip.value = { show: true, title: m.title, date: m.date, desc: m.desc, x: e.clientX, y: e.clientY }
      container.value!.style.cursor = 'pointer'
    }
  } else if (hoveredNode) {
    (hoveredNode.material as THREE.MeshBasicMaterial).opacity = 1
    hoveredNode = null
    tooltip.value.show = false
    container.value!.style.cursor = 'grab'
  }
}

function onClick(e: MouseEvent) {
  if (!container.value || !renderer) return
  const rect = container.value.getBoundingClientRect()
  mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
  mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
  
  raycaster.setFromCamera(mouse, camera)
  const intersects = raycaster.intersectObjects(photoNodes)
  if (intersects.length > 0) {
    const node = intersects[0].object as THREE.Mesh
    emit('select', node.userData.memory)
  }
}

function initThree() {
  const w = container.value!.clientWidth
  const h = container.value!.clientHeight

  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 100)
  camera.position.z = 8

  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
  renderer.setSize(w, h)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  container.value!.appendChild(renderer.domElement)

  raycaster = new THREE.Raycaster()
  
  buildNodes()
  scene.add(new THREE.AmbientLight(0xffffff, 0.9))
}

function buildNodes() {
  const mems = props.memories.length > 0 ? props.memories : [
    { title: '暂无记忆', cat: '项目', date: '----', desc: '等待添加' },
  ]
  
  mems.forEach((memory, i) => {
    const texture = createNodeTexture(memory)
    const geo = new THREE.PlaneGeometry(0.9, 0.9)
    const mat = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide, transparent: true })
    const mesh = new THREE.Mesh(geo, mat)

    const angle = i * ((Math.PI * 2) / mems.length)
    const radius = 3.5 - i * 0.25
    const height = (i - mems.length / 2) * 0.65
    mesh.position.set(Math.cos(angle) * radius, height, Math.sin(angle) * radius)
    mesh.userData = { basePos: mesh.position.clone(), memory, index: i }
    photoNodes.push(mesh)
    scene.add(mesh)

    // Glow ring
    const ringGeo = new THREE.RingGeometry(0.47, 0.49, 64)
    const ringMat = new THREE.MeshBasicMaterial({
      color: catColors[memory.cat] || 0x10b981,
      side: THREE.DoubleSide, transparent: true, opacity: 0.5,
    })
    const ring = new THREE.Mesh(ringGeo, ringMat)
    ring.position.copy(mesh.position); ring.position.z -= 0.01
    glowRings.push(ring)
    scene.add(ring)
  })
}

function animate() {
  animationId = requestAnimationFrame(animate)
  mouseX += (targetX - mouseX) * 0.05
  mouseY += (targetY - mouseY) * 0.05
  scene.rotation.y += (mouseX * 0.3 - scene.rotation.y) * 0.03
  scene.rotation.x += (mouseY * 0.1 - scene.rotation.x) * 0.03
  photoNodes.forEach((node, i) => {
    node.position.y = node.userData.basePos.y + Math.sin(Date.now() * 0.001 + i) * 0.15
    node.lookAt(camera.position)
  })
  renderer.render(scene, camera)
}
</script>

<template>
  <div class="relative w-full" style="height: 460px;">
    <div ref="container" class="w-full h-full rounded-3xl overflow-hidden cursor-grab active:cursor-grabbing"
         style="background: radial-gradient(ellipse at center, rgba(16,185,129,0.06) 0%, rgba(6,182,212,0.04) 50%, transparent 70%);" />
    
    <div class="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-gray-400 font-mono pointer-events-none">
      移动鼠标旋转 · 悬停查看记忆 · 点击定位卡片
    </div>

    <Teleport to="body">
      <div
        v-if="tooltip.show"
        class="fixed z-[999] px-4 py-2.5 rounded-xl glass text-left pointer-events-none transition-opacity duration-150"
        :style="{ left: tooltip.x + 16 + 'px', top: tooltip.y - 16 + 'px', transform: 'translateY(-100%)' }"
      >
        <p class="text-sm font-bold text-gray-800">{{ tooltip.title }}</p>
        <p class="text-xs text-gray-400 mt-0.5">{{ tooltip.date }} · {{ tooltip.desc }}</p>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.glass {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}
</style>
