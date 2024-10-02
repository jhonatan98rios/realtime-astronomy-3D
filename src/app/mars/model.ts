import { CameraController } from '@/infra/CameraController'
import * as THREE from 'three'

export class MarsModel {

    scene: THREE.Scene
    cameraController: CameraController
    renderer: THREE.WebGLRenderer
    light?: THREE.DirectionalLight
    textures: { [key: string]: THREE.Texture } = {}
    canvas: HTMLCanvasElement
    //@ts-ignore
    mesh: THREE.Mesh

    constructor() {
        this.scene = new THREE.Scene();
        this.cameraController = new CameraController();
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.xr.enabled = true;  // Certifique-se de que o XR está habilitado

        this.canvas = this.renderer.domElement
        document.body.appendChild(this.canvas)

        window.addEventListener('resize', () => {
            this.cameraController.resize()
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });

        this.addLight()
        this.loadTextures()
        this.loadGeometry()
        this.animate();
    }

    addLight() {
        this.light = new THREE.DirectionalLight(0xffffff, 1);
        this.light.position.set(5, 3, 5);
        this.scene.add(this.light);
    }

    loadTextures() {
        const textureLoader = new THREE.TextureLoader();
        this.textures.marsTexture = textureLoader.load('mars/marsmap10k.jpg');
        this.textures.marsBumpMap = textureLoader.load('mars/marsbump.jpg');
        // this.textures.marsClouds = textureLoader.load('mars/marscloudmaptrans.jpg');
    }

    loadGeometry() {
        const marsMaterial = new THREE.MeshPhongMaterial({
            map: this.textures.marsTexture,
            bumpMap: this.textures.marsBumpMap,
            bumpScale: 0.05,
        });
    
        // Geometria da Terra
        const marsGeometry = new THREE.SphereGeometry(1, 32, 32);
        this.mesh = new THREE.Mesh(marsGeometry, marsMaterial);
        this.scene.add(this.mesh);

        // Nuvens da Terra
        // const cloudGeometry = new THREE.SphereGeometry(1, 32, 32);
        // const cloudMaterial = new THREE.MeshLambertMaterial({
        //     map: this.textures.marsClouds,
        //     transparent: true,
        // });
        //const cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
        //this.scene.add(cloudMesh);
    }

    animate() {
        this.renderer.setAnimationLoop(() => {
            // Atualize a animação aqui (rotação ou outras interações)
            this.cameraController.update(this.mesh.position);

            this.renderer.render(this.scene,  this.cameraController.camera);
        });
    }

    focusOut() {
        this.cameraController.focusOut()
    }

    focusOnMars() {
        this.cameraController.focusOnPlanet();
        window.history.pushState({}, '', '#');
    }

}

