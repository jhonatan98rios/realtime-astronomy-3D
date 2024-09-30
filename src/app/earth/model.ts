import * as THREE from 'three'

export class EarthModel {

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
        document.body.appendChild(this.renderer.domElement);

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
        this.textures.earthTexture = textureLoader.load('earth/earthmap10k.jpg');
        this.textures.earthBumpMap = textureLoader.load('earth/earthbump.jpg');
        this.textures.earthClouds = textureLoader.load('earth/earthcloudmaptrans.jpg');
    }

    loadGeometry() {
        const earthMaterial = new THREE.MeshPhongMaterial({
            map: this.textures.earthTexture,
            bumpMap: this.textures.earthBumpMap,
            bumpScale: 0.05,
        });
    
        // Geometria da Terra
        const earthGeometry = new THREE.SphereGeometry(1, 32, 32);
        const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
        this.scene.add(earthMesh);

        // Nuvens da Terra
        const cloudGeometry = new THREE.SphereGeometry(1, 32, 32);
        const cloudMaterial = new THREE.MeshLambertMaterial({
            map: this.textures.earthClouds,
            transparent: true,
        });
        const cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
        //this.scene.add(cloudMesh);
        this.camera.position.z = 3;
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        
        // Rotacionar a Terra
        //this.textures.earthMesh.rotation += 0.001;
        //this.textures.cloudMesh.rotation += 0.0015;
        
        this.renderer.render(this.scene, this.camera);
    }

}

