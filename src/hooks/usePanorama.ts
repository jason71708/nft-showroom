import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import panoramaImage from "../assets/showroom.jpeg";
import { DDSLoader } from 'three/examples/jsm/loaders/DDSLoader.js';
import { blindboxMarkers } from '../service/markerData';

const usePanorama = (canvas: HTMLCanvasElement | null) => {
  const isInitializedRef = useRef(false);
  const [markerId, setMarkerId] = useState<string | undefined>();

  console.log("usePanorama");

  useEffect(() => {
    if (!canvas || isInitializedRef.current) {
      return;
    }

    /*
     * Create a basic scene, camera and renderer
     */
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      2000
    );
    camera.position.z = 0.01;

    const scene = new THREE.Scene();

    const renderer = new THREE.WebGLRenderer({ canvas });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    /*
     * Setup panorama environment
     */
    const geometry = new THREE.SphereGeometry(1000, 60, 40);
    geometry.scale(-1, 1, 1);

    const texture = new THREE.TextureLoader().load(panoramaImage);
    const material = new THREE.MeshBasicMaterial({ map: texture });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    /*
     * Create Lighting
     */
    const pointLight = new THREE.PointLight("#ddd");
    pointLight.position.set(10, 400, 15);
    const ambientLight = new THREE.AmbientLight("#999");
    scene.add(pointLight, ambientLight);

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

    const markersGroup: THREE.Object3D[] = [];

    blindboxMarkers.forEach((marker, i) => {
      // frame
      const frameGeo = new THREE.BoxGeometry(180, 180, 20);
      const frameMesh = new THREE.Mesh(frameGeo, frameMaterial);
      frameMesh.position.x = 220 - i * 200;
      frameMesh.position.z = 500;
      frameMesh.position.y = 100;
      scene.add(frameMesh);

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
      markersGroup.push(imageMesh);
    });

    /*
     * Setup camera controls
     */
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.rotateSpeed *= -0.5;
    controls.target.set(1, 0, 1);
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.enableDamping = true;

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener("resize", onWindowResize);

    /*
     * Setup pointer event
     */
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    function onPointerMove(event: PointerEvent) {
      pointer.set(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
      );

      raycaster.setFromCamera(pointer, camera);

      const intersects = raycaster.intersectObjects(markersGroup, false);

      if (intersects.length > 0) {
        if (canvas) {
          canvas.style.cursor = "pointer";
        }
      } else {
        if (canvas) {
          canvas.style.cursor = "grab";
        }
      }
    }

    function onPointerDown(event: PointerEvent) {
      pointer.set(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
      );

      raycaster.setFromCamera(pointer, camera);

      const intersects = raycaster.intersectObjects(markersGroup, true);

      if (intersects.length > 0 && !markerId) {
        const intersect = intersects[0];
        controls.enabled = false;
        setMarkerId(intersect.object.userData.markerData.id);
      } else {
        controls.enabled = true;
      }
    }
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerdown", onPointerDown);

    /*
     * Setup animation
     */
    function animate() {
      controls.update();
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }
    animate();

    /*
     * Complete initialization
     */
    isInitializedRef.current = true;
  }, [canvas]);

  return { markerId, setMarkerId };
};

export default usePanorama