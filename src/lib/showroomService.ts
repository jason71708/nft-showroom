import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { DDSLoader } from "three/examples/jsm/loaders/DDSLoader.js";
import { BlindboxMarker } from "../service/markerData";

class ShowroomService {
  private canvas: HTMLCanvasElement;
  private camera: THREE.PerspectiveCamera;
  private scene: THREE.Scene;
  private renderer: THREE.WebGLRenderer;
  private controls: OrbitControls;
  private markersGroup: THREE.Object3D[] = [];

  constructor(
    canvas: HTMLCanvasElement,
    panoramaImageUrl: string,
    markers: BlindboxMarker[],
    clickMarker: (marker: BlindboxMarker) => void
  ) {
    this.canvas = canvas;
    /*
     * Create a basic scene, camera and renderer
     */
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      2000
    );
    this.camera.position.z = 0.01;

    this.scene = new THREE.Scene();

    this.renderer = new THREE.WebGLRenderer({ canvas });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    /*
     * Setup panorama environment
     */
    const geometry = new THREE.SphereGeometry(1000, 60, 40);
    geometry.scale(-1, 1, 1);

    const texture = new THREE.TextureLoader().load(panoramaImageUrl);
    const material = new THREE.MeshBasicMaterial({ map: texture });
    const mesh = new THREE.Mesh(geometry, material);
    this.scene.add(mesh);

    /*
     * Create Lighting
     */
    const pointLight = new THREE.PointLight("#ddd");
    pointLight.position.set(10, 400, 15);
    const ambientLight = new THREE.AmbientLight("#999");
    this.scene.add(pointLight, ambientLight);

    /*
     * Add picture frame objects and images from markers
     */
    const ddsLoader = new DDSLoader();
    const cubemap = ddsLoader.load(
      "textures/Mountains_argb_nomip.dds",
      (texture) => {
        texture.magFilter = THREE.LinearFilter;
        texture.minFilter = THREE.LinearFilter;
        texture.mapping = THREE.CubeReflectionMapping;
        frameMaterial.needsUpdate = true;
      }
    );
    const frameMaterial = new THREE.MeshBasicMaterial({ envMap: cubemap });

    markers.forEach((marker, i) => {
      // frame
      const frameGeo = new THREE.BoxGeometry(180, 180, 20);
      const frameMesh = new THREE.Mesh(frameGeo, frameMaterial);
      frameMesh.position.x = 220 - i * 200;
      frameMesh.position.z = 500;
      frameMesh.position.y = 100;
      this.scene.add(frameMesh);

      // image
      const imageTexture = new THREE.TextureLoader().load(marker.image);
      const imageMaterial = new THREE.MeshBasicMaterial({
        map: imageTexture,
        side: THREE.DoubleSide,
      });
      const imageGeometry = new THREE.PlaneGeometry(160, 160);
      const imageMesh = new THREE.Mesh(imageGeometry, imageMaterial);
      imageMesh.userData.markerData = marker;
      imageMesh.position.z = -11;
      imageMesh.scale.set(-1, 1, 1);
      frameMesh.add(imageMesh);
      this.markersGroup.push(imageMesh);
    });

    /*
     * Setup camera controls
     */
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.rotateSpeed *= -0.5;
    this.controls.target.set(1, 0, 1);
    this.controls.enableZoom = false;
    this.controls.enablePan = false;
    this.controls.enableDamping = true;

    const onWindowResize = () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", onWindowResize);

    /*
     * Setup pointer event
     */
    const pointer = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();

    const onPointerMove = (event: PointerEvent) => {
      pointer.set(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
      );

      raycaster.setFromCamera(pointer, this.camera);

      const intersects = raycaster.intersectObjects(this.markersGroup, false);

      if (intersects.length > 0) {
        if (this.canvas) {
          this.canvas.style.cursor = "pointer";
        }
      } else {
        if (this.canvas) {
          this.canvas.style.cursor = "grab";
        }
      }
    };
    const onPointerDown = (event: PointerEvent) => {
      pointer.set(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
      );

      raycaster.setFromCamera(pointer, this.camera);

      const intersects = raycaster.intersectObjects(this.markersGroup, true);

      if (intersects.length > 0) {
        const intersect = intersects[0];
        clickMarker(intersect.object.userData.markerData);
      }
    };

    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerdown", onPointerDown);

    /*
     * Setup animation
     */
    const animate = () => {
      this.controls.update();
      this.renderer.render(this.scene, this.camera);
      requestAnimationFrame(animate);
    };

    animate();
  }
}

export default ShowroomService;
