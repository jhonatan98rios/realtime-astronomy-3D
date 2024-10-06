import { CameraController } from '@/infra/CameraController'
import * as THREE from 'three'

export class MercuryModel {

    scene: THREE.Scene
    cameraController: CameraController
    renderer: THREE.WebGLRenderer
    light?: THREE.DirectionalLight
    textures: { [key: string]: THREE.Texture } = {}
    //@ts-ignore
    mesh: THREE.Mesh
    canvas: HTMLCanvasElement

    constructor() {
        this.scene = new THREE.Scene();
        this.cameraController = new CameraController();

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.xr.enabled = true;  // Certifique-se de que o XR está habilitado

        this.renderer.xr.addEventListener('sessionstart', () => {
            this.scene.position.z = -1.5
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
        const ambientLight = new THREE.AmbientLight(0x404040, 0.1); // Luz suave e difusa
        ambientLight.castShadow = true
        this.scene.add(ambientLight);

        this.light = new THREE.DirectionalLight(0xffffff, 1);
        this.light.position.set(5, 3, 5);
        this.light.castShadow = true
        this.light.intensity = 0.8;
        this.scene.add(this.light);

        this.renderer.shadowMap.enabled = true;
        this.light.castShadow = true;
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
    }

    loadTextures() {
        const textureLoader = new THREE.TextureLoader();
        this.textures.mercuryTexture = textureLoader.load('mercury/mercury_texture_2k.jpg');
        this.textures.mercuryBumpMap = textureLoader.load('mercury/mercurybump.jpg');
        this.textures.mercurySpecularMap = textureLoader.load('mercury/mercurybump.jpg');
    }

    loadGeometry() {
        const mercuryMaterial = new THREE.MeshPhongMaterial({
            map: this.textures.mercuryTexture,
            bumpMap: this.textures.mercuryBumpMap,
            bumpScale: 1,
            specularMap: this.textures.mercurySpecularMap,
            specular: new THREE.Color(0x222222), // Suave brilho especular
            shininess: 10, // Controle da intensidade do brilho
        });
    
        // Geometria da Terra
        const mercuryGeometry = new THREE.SphereGeometry(1, 32, 32);
        this.mesh = new THREE.Mesh(mercuryGeometry, mercuryMaterial);
        this.scene.add(this.mesh);
    }

    animate() {
        this.renderer.setAnimationLoop(() => {
            // Atualize a animação aqui (rotação ou outras interações)
            this.mesh.rotation.y += 0.0007;

            // Atualiza a posição da câmera com base no objeto focado
            this.cameraController.update(this.mesh.position);

            // Renderizar a cena
            this.renderer.render(this.scene, this.cameraController.camera);
        });
    }

    focusOut() {
        this.cameraController.focusOut()
    }

    focusOnMercury() {
        this.cameraController.focusOnPlanet();
    }

}

