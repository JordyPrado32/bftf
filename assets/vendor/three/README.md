Three.js local modules for this landing page.

Version: 0.184.0
Source: https://www.jsdelivr.com/package/npm/three

Included files:
- three.core.js and three.module.js: core Three.js ES modules.
- addons/controls/OrbitControls.js: optional camera interaction for inspectable 3D elements.
- addons/loaders/GLTFLoader.js: loader for GLB/GLTF house, tool, or renovation models.
- addons/loaders/HDRLoader.js: HDR environment lighting for more realistic materials.
- addons/environments/RoomEnvironment.js: lightweight generated studio lighting when no HDR image is used.

The import map in index.html points "three" and "three/addons/" to these local files. The landing does not load them until a module imports them.

Current implementation:
- three-process.js uses the core module to render the process-section blueprint scene.
