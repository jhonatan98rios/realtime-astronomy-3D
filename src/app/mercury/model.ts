import * as THREE from 'three'

export class MercuryModel {

    scene: THREE.Scene
    camera: THREE.PerspectiveCamera
    renderer: THREE.WebGLRenderer
    light?: THREE.DirectionalLight
    textures: { [key: string]: THREE.Texture } = {}

    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.xr.enabled = true;  // Certifique-se de que o XR está habilitado

        document.body.appendChild(this.renderer.domElement);
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
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
        this.textures.mercuryTexture = textureLoader.load('mercury/mercurymap.jpg');
        this.textures.mercuryBumpMap = textureLoader.load('mercury/mercurybump.jpg');
        // this.textures.mercuryClouds = textureLoader.load('mercury/mercurycloudmaptrans.jpg');
    }

    loadGeometry() {
        const mercuryMaterial = new THREE.MeshPhongMaterial({
            map: this.textures.mercuryTexture,
            bumpMap: this.textures.mercuryBumpMap,
            bumpScale: 0.05,
        });
    
        // Geometria da Terra
        const mercuryGeometry = new THREE.SphereGeometry(1, 32, 32);
        const mercuryMesh = new THREE.Mesh(mercuryGeometry, mercuryMaterial);
        this.scene.add(mercuryMesh);

        // Nuvens da Terra
        // const cloudGeometry = new THREE.SphereGeometry(1, 32, 32);
        // const cloudMaterial = new THREE.MeshLambertMaterial({
        //     map: this.textures.mercuryClouds,
        //     transparent: true,
        // });
        //const cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
        //this.scene.add(cloudMesh);
        this.camera.position.set(0, 0, 3); // Ajuste para altura VR e posição adequada
    }

    animate() {
        this.renderer.setAnimationLoop(() => {
            // Atualize a animação aqui (rotação ou outras interações)
            this.renderer.render(this.scene, this.camera);
        });
    }

}

