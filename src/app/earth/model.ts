import * as THREE from 'three'
import { MoonModel } from './moonModel'
import { CameraController } from '@/infra/CameraController'

export class EarthModel {

    scene: THREE.Scene
    cameraController: CameraController
    renderer: THREE.WebGLRenderer
    light?: THREE.DirectionalLight
    textures: { [key: string]: THREE.Texture } = {}
    //@ts-ignore
    mesh: THREE.Mesh
    //@ts-ignore
    cloudMesh: THREE.Mesh
    satellites: MoonModel[] = []
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

        this.addLight()
        this.loadTextures()
        this.loadGeometry()
        this.loadClouds()
        this.loadAtmosphere()
        this.loadSatellites()

        this.animate();
    }

    addLight() {
        const ambientLight = new THREE.AmbientLight(0x202020); // Luz fraca para suavizar sombras
        ambientLight.castShadow = true
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 3, 5);  // Simulando a luz do sol
        directionalLight.castShadow = true
        this.scene.add(directionalLight);
    }

    loadTextures() {
        const textureLoader = new THREE.TextureLoader();
        this.textures.earthTexture = textureLoader.load('earth/earthmap.jpg');
        this.textures.earthBumpMap = textureLoader.load('earth/earthbump.jpg');
        this.textures.earthClouds = textureLoader.load('earth/2k_earth_clouds.jpg');
        this.textures.earthSpecularMap = textureLoader.load('earth/earthspec.jpg');
        this.textures.earthEmissiveMap = textureLoader.load('earth/earthemissivemap.jpg');
    }

    loadGeometry() {
        const earthMaterial = new THREE.MeshPhongMaterial({
            map: this.textures.earthTexture,         // Textura base da Terra
            bumpMap: this.textures.earthBumpMap,     // Mapa de relevos
            bumpScale: 5,                            // Escala do relevo
            specularMap: this.textures.earthSpecularMap, // Mapa de especularidade (reflexos nos oceanos)
            specular: new THREE.Color(0x333333),     // Intensidade da reflexão
            emissiveMap: this.textures.earthEmissiveMap, // Mapa de emissão para luzes de cidades à noite
            emissive: new THREE.Color(0x222222),     // Cor da emissão
        });
    
        // Geometria da Terra
        const earthGeometry = new THREE.SphereGeometry(1, 32, 32);
        this.mesh = new THREE.Mesh(earthGeometry, earthMaterial);
        this.mesh.castShadow = true
        this.scene.add(this.mesh);
    }

    loadAtmosphere() {
        const atmosphereGeometry = new THREE.SphereGeometry(1.02, 32, 32);  // Um pouco maior que a Terra
        const atmosphereMaterial = new THREE.MeshPhongMaterial({
            color: 0x00aaff,  // Azul claro
            transparent: true,
            opacity: 0.25,  // Transparência baixa para um efeito sutil
            blending: THREE.AdditiveBlending,
        });
        const atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
        this.scene.add(atmosphereMesh);
    }

    loadClouds() {
        const cloudGeometry = new THREE.SphereGeometry(1.01, 32, 32);  // Levemente maior que a Terra
        const cloudMaterial = new THREE.MeshPhongMaterial({
            map: this.textures.earthClouds,
            transparent: true,
            opacity: 0.7,  // Semitransparente
        });
        this.cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
        this.scene.add(this.cloudMesh);
    }


    loadSatellites() {
        this.satellites.push(new MoonModel({
            textures: {
                map: 'earth/moon/moonmap2k.jpg',
                bump: 'earth/moon/moonmap2k.jpg',
                normal: 'earth/moon/moon_normal_map.jpg',
            }
        }))


        this.satellites.forEach(satellite => {
            this.scene.add(satellite.mesh)
        })
    }

    animate() {
        this.renderer.setAnimationLoop(() => {
            // Atualize a animação aqui (rotação ou outras interações)

            // Atualizar a rotação da Terra
            this.mesh.rotation.y += 0.001;

            // Rotação das nuvens (mais lenta)
            this.cloudMesh.rotation.y += 0.0005;  // Rotação mais sutil das nuvens
            
            // Animar satélites (como a Lua)
            this.satellites.forEach(satellite => {
                satellite.animate()
            })

            // Atualiza a posição da câmera com base no objeto focado
            this.cameraController.update(this.satellites[0].mesh.position);

            // Renderizar a cena
            this.renderer.render(this.scene, this.cameraController.camera);
        });
    }

    focusOut() {
        this.cameraController.focusOut()
    }

    focusOnEarth() {
        this.cameraController.focusOnPlanet();
    }

    focusOnMoon() {
        const moonPosition = this.satellites[0].mesh.position   
        this.cameraController.focusOnMoon(moonPosition);
    }
}

