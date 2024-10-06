import * as THREE from 'three'

export class UranusModel {

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
        this.textures.uranusTexture = textureLoader.load('uranus/uranusmap.jpg');
        this.textures.uranusBumpMap = textureLoader.load('uranus/uranusbump.jpg');
        // this.textures.uranusClouds = textureLoader.load('uranus/uranuscloudmaptrans.jpg');
    }

    loadGeometry() {
        const uranusMaterial = new THREE.MeshPhongMaterial({
            map: this.textures.uranusTexture,
            bumpMap: this.textures.uranusBumpMap,
            bumpScale: 1,
        });
    
        // Geometria da Terra
        const uranusGeometry = new THREE.SphereGeometry(1, 32, 32);
        const uranusMesh = new THREE.Mesh(uranusGeometry, uranusMaterial);
        this.scene.add(uranusMesh);

        // Nuvens da Terra
        // const cloudGeometry = new THREE.SphereGeometry(1, 32, 32);
        // const cloudMaterial = new THREE.MeshLambertMaterial({
        //     map: this.textures.uranusClouds,
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

