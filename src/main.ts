import {
  CameraViewPlugin, CanvasSnapshotPlugin,
  ContactShadowGroundPlugin,
  IObject3D, ITexture,
  LoadingScreenPlugin, PhysicalMaterial,
  PickingPlugin,
  PopmotionPlugin, SRGBColorSpace,
  ThreeViewer,
  timeout,
  TransformAnimationPlugin,
  TransformControlsPlugin,
  Vector2, Raycaster, Camera
} from 'threepipe'
import {TweakpaneUiPlugin} from '@threepipe/plugin-tweakpane'

// Interactive webpage system for MacBook screen - Canvas-based approach
function createWebpageSystem() {
  const canvas = document.createElement('canvas')
  canvas.width = 1440
  canvas.height = 900
  const ctx = canvas.getContext('2d')!
  
  // Create URL input control
  const urlInput = document.createElement('div')
  urlInput.style.position = 'fixed'
  urlInput.style.top = '20px'
  urlInput.style.left = '20px'
  urlInput.style.zIndex = '1000'
  urlInput.style.background = 'rgba(0,0,0,0.8)'
  urlInput.style.padding = '10px'
  urlInput.style.borderRadius = '5px'
  urlInput.style.color = 'white'
  urlInput.style.fontFamily = 'monospace'
  urlInput.innerHTML = `
    <div style="margin-bottom: 10px;">MacBook Interactive Screen:</div>
    <input type="text" id="webpage-url" value="https://threejs.org" style="width: 250px; padding: 5px; margin-right: 10px;">
    <button id="load-webpage" style="padding: 5px 10px;">Navigate</button>
    <div style="margin-top: 5px; font-size: 12px;">Click on MacBook screen to interact!</div>
  `
  document.body.appendChild(urlInput)
  
  const input = document.getElementById('webpage-url') as HTMLInputElement
  const loadButton = document.getElementById('load-webpage') as HTMLButtonElement
  
  let currentUrl = 'https://threejs.org'
  let scrollY = 0
  let buttons: Array<{x: number, y: number, width: number, height: number, text: string, action: string}> = []
  
  function drawBrowserInterface() {
    // Clear canvas
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, 1440, 900)
    
    // Draw browser chrome
    ctx.fillStyle = '#f0f0f0'
    ctx.fillRect(0, 0, 1440, 80)
    
    // Draw address bar
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(100, 20, 1240, 40)
    ctx.strokeStyle = '#cccccc'
    ctx.lineWidth = 1
    ctx.strokeRect(100, 20, 1240, 40)
    
    // Draw URL
    ctx.fillStyle = '#333333'
    ctx.font = '16px Arial'
    ctx.fillText(currentUrl, 120, 45)
    
    // Draw back/forward buttons
    ctx.fillStyle = '#e0e0e0'
    ctx.fillRect(20, 25, 30, 30)
    ctx.fillRect(55, 25, 30, 30)
    ctx.strokeRect(20, 25, 30, 30)
    ctx.strokeRect(55, 25, 30, 30)
    ctx.fillStyle = '#666666'
    ctx.font = '14px Arial'
    ctx.fillText('←', 32, 45)
    ctx.fillText('→', 67, 45)
    
    // Draw page content based on current URL
    drawPageContent()
    
    // Create texture
    const texture = new (window as any).THREE.CanvasTexture(canvas)
    texture.needsUpdate = true
    texture.colorSpace = (window as any).THREE.SRGBColorSpace
    return texture
  }
  
  function drawPageContent() {
    // Content area (below browser chrome)
    const contentY = 80
    const contentHeight = 900 - contentY
    
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, contentY, 1440, contentHeight)
    
    // Reset buttons array
    buttons = []
    
    if (currentUrl.includes('threejs.org')) {
      drawThreeJSPage(contentY)
    } else if (currentUrl.includes('github.com')) {
      drawGitHubPage(contentY)
    } else if (currentUrl.includes('google.com')) {
      drawGooglePage(contentY)
    } else {
      drawDefaultPage(contentY)
    }
  }
  
  function drawThreeJSPage(startY: number) {
    // Header
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, startY, 1440, 100 - scrollY)
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 36px Arial'
    ctx.fillText('three.js', 50, startY + 60 - scrollY)
    
    // Navigation
    ctx.fillStyle = '#333333'
    ctx.font = '18px Arial'
    ctx.fillText('docs', 250, startY + 55 - scrollY)
    ctx.fillText('examples', 320, startY + 55 - scrollY)
    ctx.fillText('editor', 420, startY + 55 - scrollY)
    
    // Add clickable buttons
    buttons.push({x: 250, y: startY + 35 - scrollY, width: 60, height: 30, text: 'docs', action: 'navigate:https://threejs.org/docs'})
    buttons.push({x: 320, y: startY + 35 - scrollY, width: 80, height: 30, text: 'examples', action: 'navigate:https://threejs.org/examples'})
    
    // Content
    ctx.fillStyle = '#333333'
    ctx.font = '24px Arial'
    ctx.fillText('JavaScript 3D Library', 50, startY + 150 - scrollY)
    
    ctx.font = '16px Arial'
    ctx.fillText('The aim of the project is to create an easy to use, lightweight,', 50, startY + 190 - scrollY)
    ctx.fillText('cross-browser, general purpose 3D library.', 50, startY + 220 - scrollY)
    
    // Example cubes
    for (let i = 0; i < 3; i++) {
      ctx.fillStyle = '#ff6b6b'
      ctx.fillRect(50 + i * 200, startY + 300 - scrollY, 150, 150)
      ctx.fillStyle = '#4ecdc4'
      ctx.fillRect(70 + i * 200, startY + 320 - scrollY, 110, 110)
    }
    
    // Interactive button
    ctx.fillStyle = '#ff6b6b'
    ctx.fillRect(50, startY + 500 - scrollY, 200, 50)
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 18px Arial'
    ctx.fillText('Try Examples', 110, startY + 530 - scrollY)
    
    buttons.push({x: 50, y: startY + 500 - scrollY, width: 200, height: 50, text: 'Try Examples', action: 'navigate:https://threejs.org/examples'})
  }
  
  function drawGitHubPage(startY: number) {
    // Header
    ctx.fillStyle = '#24292e'
    ctx.fillRect(0, startY, 1440, 80 - scrollY)
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 24px Arial'
    ctx.fillText('GitHub', 50, startY + 50 - scrollY)
    
    // Repository info
    ctx.fillStyle = '#586069'
    ctx.font = '18px Arial'
    ctx.fillText('mrdoob/three.js', 50, startY + 130 - scrollY)
    
    ctx.fillStyle = '#333333'
    ctx.font = '16px Arial'
    ctx.fillText('JavaScript 3D library.', 50, startY + 160 - scrollY)
    
    // Buttons
    ctx.fillStyle = '#28a745'
    ctx.fillRect(50, startY + 200 - scrollY, 120, 40)
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 16px Arial'
    ctx.fillText('Clone', 90, startY + 225 - scrollY)
    
    buttons.push({x: 50, y: startY + 200 - scrollY, width: 120, height: 40, text: 'Clone', action: 'scroll'})
    
    // File list
    ctx.fillStyle = '#f6f8fa'
    ctx.fillRect(50, startY + 270 - scrollY, 1340, 300)
    ctx.strokeStyle = '#e1e4e8'
    ctx.strokeRect(50, startY + 270 - scrollY, 1340, 300)
    
    const files = ['src/', 'examples/', 'docs/', 'build/', 'README.md', 'package.json']
    files.forEach((file, i) => {
      ctx.fillStyle = '#333333'
      ctx.font = '14px Arial'
      ctx.fillText(file, 70, startY + 300 + i * 30 - scrollY)
    })
  }
  
  function drawGooglePage(startY: number) {
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, startY, 1440, 900 - startY)
    
    // Google logo
    ctx.fillStyle = '#4285f4'
    ctx.font = 'bold 60px Arial'
    ctx.fillText('G', 600, startY + 200 - scrollY)
    ctx.fillStyle = '#ea4335'
    ctx.fillText('o', 640, startY + 200 - scrollY)
    ctx.fillStyle = '#fbbc05'
    ctx.fillText('o', 680, startY + 200 - scrollY)
    ctx.fillStyle = '#4285f4'
    ctx.fillText('g', 720, startY + 200 - scrollY)
    ctx.fillStyle = '#34a853'
    ctx.fillText('l', 760, startY + 200 - scrollY)
    ctx.fillStyle = '#ea4335'
    ctx.fillText('e', 780, startY + 200 - scrollY)
    
    // Search box
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(500, startY + 250 - scrollY, 440, 50)
    ctx.strokeStyle = '#dfe1e5'
    ctx.lineWidth = 1
    ctx.strokeRect(500, startY + 250 - scrollY, 440, 50)
    
    // Search buttons
    ctx.fillStyle = '#f8f9fa'
    ctx.fillRect(600, startY + 320 - scrollY, 120, 40)
    ctx.fillRect(740, startY + 320 - scrollY, 120, 40)
    ctx.strokeRect(600, startY + 320 - scrollY, 120, 40)
    ctx.strokeRect(740, startY + 320 - scrollY, 120, 40)
    
    ctx.fillStyle = '#3c4043'
    ctx.font = '14px Arial'
    ctx.fillText('Google Search', 625, startY + 345 - scrollY)
    ctx.fillText("I'm Feeling Lucky", 755, startY + 345 - scrollY)
    
    buttons.push({x: 600, y: startY + 320 - scrollY, width: 120, height: 40, text: 'Google Search', action: 'scroll'})
    buttons.push({x: 740, y: startY + 320 - scrollY, width: 120, height: 40, text: "I'm Feeling Lucky", action: 'navigate:https://threejs.org'})
  }
  
  function drawDefaultPage(startY: number) {
    ctx.fillStyle = '#f5f5f5'
    ctx.fillRect(0, startY, 1440, 900 - startY)
    
    ctx.fillStyle = '#333333'
    ctx.font = 'bold 48px Arial'
    ctx.fillText('Interactive WebPage', 450, startY + 200 - scrollY)
    
    ctx.font = '24px Arial'
    ctx.fillText('Click anywhere to interact!', 550, startY + 260 - scrollY)
    
    // Interactive elements
    for (let i = 0; i < 3; i++) {
      ctx.fillStyle = ['#ff6b6b', '#4ecdc4', '#45b7d1'][i]
      ctx.fillRect(300 + i * 200, startY + 320 - scrollY, 150, 80)
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 18px Arial'
      ctx.fillText('Button ' + (i + 1), 350 + i * 200, startY + 370 - scrollY)
      
      buttons.push({x: 300 + i * 200, y: startY + 320 - scrollY, width: 150, height: 80, text: 'Button ' + (i + 1), action: i === 2 ? 'navigate:https://threejs.org' : 'scroll'})
    }
  }
  
  loadButton.addEventListener('click', () => {
    currentUrl = input.value.trim() || 'https://example.com'
    scrollY = 0
    updateTexture()
  })
  
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      loadButton.click()
    }
  })
  
  function updateTexture() {
    return drawBrowserInterface()
  }
  
  function handleScreenClick(normalizedX: number, normalizedY: number) {
    const x = normalizedX * 1440
    const y = normalizedY * 900
    
    // Check if click is on any button
    for (const button of buttons) {
      if (x >= button.x && x <= button.x + button.width && 
          y >= button.y && y <= button.y + button.height) {
        if (button.action.startsWith('navigate:')) {
          currentUrl = button.action.replace('navigate:', '')
          input.value = currentUrl
          scrollY = 0
        } else if (button.action === 'scroll') {
          scrollY += 50
        }
        return true // Interaction happened
      }
    }
    
    // Check if click is on back/forward buttons
    if (y >= 25 && y <= 55) {
      if (x >= 20 && x <= 50) { // Back button
        if (currentUrl !== 'https://threejs.org') {
          currentUrl = 'https://threejs.org'
          input.value = currentUrl
          scrollY = 0
          return true
        }
      } else if (x >= 55 && x <= 85) { // Forward button
        currentUrl = 'https://github.com/mrdoob/three.js'
        input.value = currentUrl
        scrollY = 0
        return true
      }
    }
    
    return false
  }
  
  function handleScreenScroll(_normalizedX: number, _normalizedY: number, deltaY: number) {
    scrollY += deltaY * 2
    scrollY = Math.max(0, Math.min(scrollY, 500)) // Limit scroll
    return true
  }
  
  return {
    updateTexture,
    handleScreenClick,
    handleScreenScroll
  }
}

async function init() {
  const viewer = new ThreeViewer({
    canvas: document.getElementById('threepipe-canvas') as HTMLCanvasElement,
    msaa: false,
    renderScale: 'auto',
    dropzone: {
      allowedExtensions: ['png', 'jpeg', 'jpg', 'webp', 'svg', 'hdr', 'exr'],
      autoImport: true,
      addOptions: {
        disposeSceneObjects: false,
        autoSetBackground: false,
        autoSetEnvironment: true, // when hdr, exr is dropped
      },
    },
    plugins: [LoadingScreenPlugin, PickingPlugin, PopmotionPlugin,
      CameraViewPlugin, TransformAnimationPlugin,
      new TransformControlsPlugin(false),
      CanvasSnapshotPlugin,
      ContactShadowGroundPlugin],
  })

  const ui = viewer.addPluginSync(new TweakpaneUiPlugin(true))

  // Model configured in the threepipe editor with Camera Views and Transform Animations, check the tutorial to learn more.
  // Includes Models from Sketchfab by timblewee and polyman Studio and HDR from polyhaven/threejs.org
  // https://sketchfab.com/3d-models/apple-iphone-15-pro-max-black-df17520841214c1792fb8a44c6783ee7
  // https://sketchfab.com/3d-models/macbook-pro-13-inch-2020-efab224280fd4c3993c808107f7c0b38
  const devices = await viewer.load<IObject3D>('./models/tabletop_macbook_iphone.glb')
  if (!devices) return

  const macbook = devices.getObjectByName('macbook')!
  const iphone = devices.getObjectByName('iphone')!

  const macbookScreen = macbook.getObjectByName('Bevels_2')!
  macbookScreen.name = 'Macbook Screen'

  // Create interactive webpage system for MacBook
  const webpageSystem = createWebpageSystem()
  
  // Canvas snapshot plugin can be used to download a snapshot of the canvas.
  ui.setupPluginUi(CanvasSnapshotPlugin, {expanded: false})
  // Add the object to the debug UI. The stored Transform objects can be seen and edited in the UI.
  ui.appendChild(macbookScreen.uiConfig, {expanded: false})
  ui.appendChild(iphone.uiConfig, {expanded: false})
  // Add the Camera View UI to the debug UI. The stored Camera Views can be seen and edited in the UI.
  ui.setupPluginUi(CameraViewPlugin, {expanded: false})
  ui.appendChild(viewer.scene.mainCamera.uiConfig)
  ui.setupPluginUi(TransformControlsPlugin, {expanded: true})

  // Listen to when an image is dropped and set it as the emissive map for the screens.
  viewer.assetManager.addEventListener('loadAsset', (e)=>{
    if (!e.data?.isTexture) return
    const texture = e.data as ITexture
    texture.colorSpace = SRGBColorSpace
    // The file has different objects that have the material.
    const mbpScreen = viewer.scene.getObjectByName('Object_7')?.material as PhysicalMaterial
    const iPhoneScreen = viewer.scene.getObjectByName('xXDHkMplTIDAXLN')?.material as PhysicalMaterial
    console.log(mbpScreen, iPhoneScreen)
    if(!mbpScreen || !iPhoneScreen) return
    mbpScreen.color.set(0,0,0)
    mbpScreen.emissive.set(1,1,1)
    mbpScreen.roughness = 0.2
    mbpScreen.metalness = 0.8
    mbpScreen.map = null
    mbpScreen.emissiveMap = texture
    iPhoneScreen.emissiveMap = texture
    mbpScreen.setDirty()
    iPhoneScreen.setDirty()
  })

  // Initialize interactive webpage on MacBook screen
  async function initializeWebpageOnMacBook() {
    const texture = webpageSystem.updateTexture()
    if (texture) {
      const mbpScreen = viewer.scene.getObjectByName('Object_7')?.material as PhysicalMaterial
      if (mbpScreen) {
        mbpScreen.color.set(0,0,0)
        mbpScreen.emissive.set(1,1,1)
        mbpScreen.roughness = 0.2
        mbpScreen.metalness = 0.8
        mbpScreen.map = null
        mbpScreen.emissiveMap = texture
        mbpScreen.setDirty()
      }
    }
  }
  
  // Initialize webpage after a short delay to ensure everything is loaded
  setTimeout(() => initializeWebpageOnMacBook(), 2000)
  
  // Also create a standalone demo for testing the interactive webpage system
  if (!viewer.scene.getObjectByName('Object_7')) {
    // If the 3D models fail to load, create a demo interface
    setTimeout(() => {
      console.log('3D models not loaded, creating standalone demo...')
      const demoDiv = document.createElement('div')
      demoDiv.style.position = 'fixed'
      demoDiv.style.bottom = '20px'
      demoDiv.style.left = '20px'
      demoDiv.style.width = '400px'
      demoDiv.style.height = '250px'
      demoDiv.style.border = '2px solid #333'
      demoDiv.style.borderRadius = '10px'
      demoDiv.style.background = '#fff'
      demoDiv.style.zIndex = '999'
      demoDiv.innerHTML = `
        <div style="padding: 10px; border-bottom: 1px solid #ccc; background: #f0f0f0; border-radius: 8px 8px 0 0;">
          <strong>Interactive Webpage Demo</strong>
          <button onclick="this.parentElement.parentElement.remove()" style="float: right;">×</button>
        </div>
        <div id="demo-canvas-container" style="width: 100%; height: 200px; position: relative;"></div>
      `
      document.body.appendChild(demoDiv)
      
      // Create a canvas demo of the interactive webpage
      const demoCanvas = document.createElement('canvas')
      demoCanvas.width = 400
      demoCanvas.height = 200
      demoCanvas.style.width = '100%'
      demoCanvas.style.height = '100%'
      demoCanvas.style.cursor = 'pointer'
      
      const container = document.getElementById('demo-canvas-container')!
      container.appendChild(demoCanvas)
      
      const demoCtx = demoCanvas.getContext('2d')!
      
      // Draw the webpage texture to the demo canvas
      function updateDemo() {
        const texture = webpageSystem.updateTexture()
        if (texture && texture.image) {
          demoCtx.drawImage(texture.image, 0, 0, 400, 200)
        }
      }
      
      updateDemo()
      
      // Add click handling for demo
      demoCanvas.addEventListener('click', (e) => {
        const rect = demoCanvas.getBoundingClientRect()
        const x = (e.clientX - rect.left) / rect.width
        const y = (e.clientY - rect.top) / rect.height
        
        const interacted = webpageSystem.handleScreenClick(x, y)
        if (interacted) {
          setTimeout(updateDemo, 100)
        }
      })
      
      // Add scroll handling for demo
      demoCanvas.addEventListener('wheel', (e) => {
        e.preventDefault()
        const rect = demoCanvas.getBoundingClientRect()
        const x = (e.clientX - rect.left) / rect.width
        const y = (e.clientY - rect.top) / rect.height
        
        const scrolled = webpageSystem.handleScreenScroll(x, y, e.deltaY)
        if (scrolled) {
          setTimeout(updateDemo, 50)
        }
      })
      
    }, 5000) // Wait 5 seconds to see if models load
  }

  // Separate views are created in the file with different camera fields of view and positions to account for mobile screen.
  const isMobile = ()=>window.matchMedia('(max-width: 768px)').matches
  const viewName = (key: string) => isMobile() ? key + '2' : key

  const transformAnim = viewer.getPlugin(TransformAnimationPlugin)!
  const cameraView = viewer.getPlugin(CameraViewPlugin)!

  const picking = viewer.getPlugin(PickingPlugin)!
  // Disable widget(3D bounding box) in the Picking Plugin (enabled by default)
  picking.widgetEnabled = false
  // Enable hover events in the Picking Plugin (disabled by default)
  picking.hoverEnabled = true

  // Set initial state
  await transformAnim.animateTransform(macbookScreen, 'closed', 50)?.promise
  await transformAnim.animateTransform(iphone, 'facedown', 50)?.promise
  await cameraView.animateToView(viewName('start'), 50)

  // Track the current and the next state.
  const state = {
    focused: '',
    hover: '',
    animating: false,
  }
  const nextState = {
    focused: '',
    hover: '',
  }
  async function updateState() {
    if (state.animating) return
    const next = nextState
    if (next.focused === state.focused && next.hover === state.hover) return
    state.animating = true
    const isOpen = state.focused
    Object.assign(state, next)
    if (state.focused) {
      await Promise.all([
        transformAnim.animateTransform(macbookScreen, state.focused === 'macbook' ? 'open' : 'closed', 500)?.promise,
        transformAnim.animateTransform(iphone, state.focused === 'iphone' ? 'floating' : 'facedown', 500)?.promise,
        cameraView.animateToView(viewName(state.focused === 'macbook' ? 'macbook' : 'iphone'), 500),
      ])
    } else if (state.hover) {
      await Promise.all([
        transformAnim.animateTransform(macbookScreen, state.hover === 'macbook' ? 'hover' : 'closed', 250)?.promise,
        transformAnim.animateTransform(iphone, state.hover === 'iphone' ? 'tilted' : 'facedown', 250)?.promise,
      ])
    } else {
      const duration = isOpen ? 500 : 250
      await Promise.all([
        transformAnim.animateTransform(macbookScreen, 'closed', duration)?.promise,
        transformAnim.animateTransform(iphone, 'facedown', duration)?.promise,
        isOpen ? cameraView.animateToView(viewName('front'), duration) : null,
      ])
    }
    state.animating = false
  }
  async function setState(next: typeof nextState) {
    Object.assign(nextState, next)
    while (state.animating) await timeout(50)
    await updateState()
  }

  function deviceFromHitObject(object: IObject3D) {
    let device = ''
    object.traverseAncestors(o => {
      if (o === macbook) device = 'macbook'
      if (o === iphone) device = 'iphone'
    })
    return device
  }

  // Fired when the current hover object changes.
  picking.addEventListener('hoverObjectChanged', async(e) => {
    const object = e.object as IObject3D
    if (!object) {
      if (state.hover && !state.focused) await setState({hover: '', focused: ''})
      return
    }
    if (state.focused) return
    const device = deviceFromHitObject(object)
    await setState({hover: device, focused: ''})
  })

  // Fired when the user clicks on the canvas.
  picking.addEventListener('hitObject', async(e) => {
    const object = e.intersects.selectedObject as IObject3D
    if (!object) {
      if (state.focused) await setState({hover: '', focused: ''})
      return
    }
    const device = deviceFromHitObject(object)
    
    // Handle MacBook screen interaction when focused
    if (device === 'macbook' && state.focused === 'macbook') {
      // Check if click is specifically on the screen
      const screenObject = viewer.scene.getObjectByName('Object_7')
      if (screenObject && e.intersects.intersects[0]?.object === screenObject) {
        // Get intersection point and convert to screen coordinates
        const intersection = e.intersects.intersects[0]
        if (intersection?.uv) {
          const normalizedX = intersection.uv.x
          const normalizedY = 1 - intersection.uv.y // Flip Y coordinate
          const interacted = webpageSystem.handleScreenClick(normalizedX, normalizedY)
          
          if (interacted) {
            // Update texture after interaction
            setTimeout(() => {
              const newTexture = webpageSystem.updateTexture()
              if (newTexture) {
                const mbpScreen = screenObject.material as PhysicalMaterial
                if (mbpScreen) {
                  mbpScreen.emissiveMap = newTexture
                  mbpScreen.setDirty()
                }
              }
            }, 100)
            return // Don't change focus state when interacting with screen
          }
        }
      }
    }
    
    // change the selected object for transform controls.
    e.intersects.selectedObject = device === 'macbook' ? macbook : iphone
    await setState({focused: device, hover: ''})
  })

  // Close all devices when the user presses the Escape key.
  document.addEventListener('keydown', (ev)=>{
    if (ev.key === 'Escape' && state.focused) setState({hover: '', focused: ''})
  })

  // Add scroll support for MacBook screen when focused
  viewer.canvas.addEventListener('wheel', async (e) => {
    if (state.focused === 'macbook') {
      e.preventDefault()
      
      // Get mouse position relative to canvas
      const rect = viewer.canvas.getBoundingClientRect()
      const mouseX = (e.clientX - rect.left) / rect.width
      const mouseY = (e.clientY - rect.top) / rect.height
      
      // Convert to normalized device coordinates
      const mouse = new Vector2()
      mouse.x = (mouseX * 2) - 1
      mouse.y = -(mouseY * 2) + 1
      
      // Raycast to check if we're over the MacBook screen
      const raycaster = new Raycaster()
      raycaster.setFromCamera(mouse, viewer.scene.mainCamera as Camera)
      
      const screenObject = viewer.scene.getObjectByName('Object_7')
      if (screenObject) {
        const intersects = raycaster.intersectObject(screenObject)
        if (intersects.length > 0 && intersects[0].uv) {
          const normalizedX = intersects[0].uv.x
          const normalizedY = 1 - intersects[0].uv.y
          
          const scrolled = webpageSystem.handleScreenScroll(normalizedX, normalizedY, e.deltaY)
          
          if (scrolled) {
            // Update texture after scroll
            setTimeout(() => {
              const newTexture = webpageSystem.updateTexture()
              if (newTexture) {
                const mbpScreen = screenObject.material as PhysicalMaterial
                if (mbpScreen) {
                  mbpScreen.emissiveMap = newTexture
                  mbpScreen.setDirty()
                }
              }
            }, 50)
          }
        }
      }
    }
  }, { passive: false })

}

init()
