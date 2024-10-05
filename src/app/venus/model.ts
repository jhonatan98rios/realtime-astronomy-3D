import * as THREE from 'three'
import { CameraController } from '@/infra/CameraController'

export class VenusModel {

    scene: THREE.Scene
    cameraController: CameraController
    renderer: THREE.WebGLRenderer
    light?: THREE.DirectionalLight
    textures: { [key: string]: THREE.Texture } = {}
    //@ts-ignore
    mesh: THREE.Mesh
    //@ts-ignore
    canvas: HTMLCanvasElement

    constructor() {
        this.scene = new THREE.Scene();
        this.cameraController = new CameraController();
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.xr.enabled = true;  // Certifique-se de que o XR está habilitado

        this.renderer.xr.addEventListener('sessionstart', () => {
            this.scene.position.z = -3
            this.scene.position.y = 1
        });

        this.canvas = this.renderer.domElement
        document.body.appendChild(this.canvas)

        window.addEventListener('resize', () => {
            this.cameraController.resize()
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });

        this.loadTextures()
        this.loadGeometry()
        this.addLight()
        this.animate();
    }

    addLight() {
        this.light = new THREE.DirectionalLight(0xffffff, 1);
        this.light.position.set(5, 3, 5);
        this.scene.add(this.light);
    }

    loadTextures() {
        const textureLoader = new THREE.TextureLoader();
        this.textures.venusTexture = textureLoader.load('venus/venusmap.jpg');
        this.textures.venusBumpMap = textureLoader.load('venus/venusbump.jpg');
    }

    loadGeometry() {
        const venusMaterial = new THREE.MeshStandardMaterial({
            map: this.textures.venusTexture,
            metalness: 0.1,  // Controla o brilho da superfície
            roughness: 0.8,   // Controla o quanto a luz se espalha
            bumpScale: 0.8,
            bumpMap: this.textures.venusBumpMap
        });
    
        // Geometria da Terra
        const venusGeometry = new THREE.SphereGeometry(1, 32, 32);
        this.mesh = new THREE.Mesh(venusGeometry, venusMaterial);

        this.mesh.rotation.z = THREE.MathUtils.degToRad(8);
        this.mesh.castShadow = true
        
        this.scene.add(this.mesh);

        this.cameraController.camera.position.set(0, 0, 3); // Ajuste para altura VR e posição adequada
    }

    animate() {
        this.renderer.setAnimationLoop(() => {
            this.mesh.rotation.y += 0.001;
            
            // Atualiza a posição da câmera com base no objeto focado
            this.cameraController.update(this.mesh.position);

            this.renderer.render(this.scene, this.cameraController.camera);
        });
    }

    focusOut() {
        this.cameraController.focusOut()
    }

    focusOnVenus() {
        this.cameraController.followMoon = false; // Desativa o seguimento da Lua
        this.cameraController.targetPosition.set(0, 0, 2); // Ajuste a posição para focar na Terra
        this.cameraController.startTransition(false); // Não seguir a Lua
    }
}

