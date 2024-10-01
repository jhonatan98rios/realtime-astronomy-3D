import * as THREE from 'three'
import { MoonModel } from './moonModel'

export class EarthModel {

    scene: THREE.Scene
    camera: THREE.PerspectiveCamera
    renderer: THREE.WebGLRenderer
    light?: THREE.DirectionalLight
    textures: { [key: string]: THREE.Texture } = {}
    //@ts-ignore
    mesh: THREE.Mesh
    satellites: MoonModel[] = []

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
        this.loadSatellites()

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
            bumpScale: 2,
        });
    
        // Geometria da Terra
        const earthGeometry = new THREE.SphereGeometry(1, 32, 32);
        this.mesh = new THREE.Mesh(earthGeometry, earthMaterial);
        this.scene.add(this.mesh);

        // Nuvens da Terra
        // const cloudGeometry = new THREE.SphereGeometry(1, 32, 32);
        // const cloudMaterial = new THREE.MeshLambertMaterial({
        //     map: this.textures.earthClouds,
        //     transparent: true,
        // });
        //const cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
        //this.scene.add(cloudMesh);
        this.camera.position.set(0, 0, 10); // Ajuste para altura VR e posição adequada
    }

    loadSatellites() {
        this.satellites.push(new MoonModel({
            texture: {
                map: 'earth/moon/moonmap2k.jpg',
                bump: 'earth/moon/moonmap2k.jpg',
            }
        }))


        this.satellites.forEach(satellite => {
            this.scene.add(satellite.mesh)
        })
    }

    animate() {
        this.renderer.setAnimationLoop(() => {
            // Atualize a animação aqui (rotação ou outras interações)
            this.renderer.render(this.scene, this.camera);
            this.mesh.rotation.y += 0.001;

            this.satellites.forEach(satellite => {
                satellite.animate()
            })
        });
    }

}

