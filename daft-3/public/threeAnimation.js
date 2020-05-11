import {visibleHeightAtZDepth, visibleWidthAtZDepth, lerp} from "../utils.js"
import {nextSlide, previousSlide} from "../main.js"

const raycaster = new THREE.Raycaster()
const objLoader = new THREE.OBJLoader()
let arrowBoxForward = null
let arrowBoxBackwards = null
let arrowBoxRotationForward = 0
let arrowBoxRotationBackwards = 180

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight)

const renderer = new THREE.WebGLRenderer({antialias: true, alpha: true})
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.render(scene, camera)

document.body.append(renderer.domElement)

objLoader.load(
    'models/cube.obj',
    ({children}) => {
      const screenBorderRight = visibleWidthAtZDepth(-10, camera) / 2
      const screenBottom = -visibleHeightAtZDepth(-10, camera) / 2
      addCube(children[0], previousSlide, screenBorderRight - 2.5, screenBottom + 1, true)
      addCube(children[0], nextSlide, screenBorderRight - 1.5, screenBottom + 1)
      animate()
    }
)

const addCube = (object, callbackFn, x, y, backwards = false) => {
  const cubeMesh = object.clone()

  cubeMesh.scale.setScalar(.3)
  cubeMesh.rotation.set(THREE.Math.degToRad(90), 0, backwards ? Math.PI: 0);

  const boundingBox = new THREE.Mesh(
      new THREE.BoxGeometry(.7, .7, .7),
      new THREE.MeshBasicMaterial({transparent: true, opacity: 0})
  )

  boundingBox.position.x = x
  boundingBox.position.y = y
  boundingBox.position.z = -10

  boundingBox.add(cubeMesh)

  boundingBox.callbackFn = callbackFn

  if (backwards) arrowBoxBackwards = boundingBox;
  else arrowBoxForward = boundingBox;
  scene.add(boundingBox)
}

const animate = () => {
  arrowBoxRotationForward = lerp(arrowBoxRotationForward, 0, .07)
  arrowBoxForward.rotation.set(THREE.Math.degToRad(arrowBoxRotationForward), 0, 0)
  arrowBoxRotationBackwards = lerp(arrowBoxRotationBackwards, 180, .07)
  arrowBoxBackwards.rotation.set(THREE.Math.degToRad(arrowBoxRotationBackwards), 0, 0)

  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}

export const handleThreeAnimationForward = () => {
  arrowBoxRotationForward = 360
}

export const handleThreeAnimationBackwards = () => {
  arrowBoxRotationBackwards = -180
}

window.addEventListener('click', () => {
  const mousePosition = new THREE.Vector2()
  mousePosition.x = (event.clientX / window.innerWidth) * 2 - 1
  mousePosition.y = -(event.clientY / window.innerHeight) * 2 + 1

  raycaster.setFromCamera(mousePosition, camera)

  const interesctedObjects = raycaster.intersectObjects([arrowBoxForward, arrowBoxBackwards])
  interesctedObjects.length && interesctedObjects[0].object.callbackFn()
})