import { CameraController } from '@/infra/CameraController'
import * as THREE from 'three'
import { MoonModel } from './moonModel'

export class JupiterModel {

    scene: THREE.Scene
    cameraController: CameraController
    renderer: THREE.WebGLRenderer
    light?: THREE.DirectionalLight
    textures: { [key: string]: THREE.Texture } = {}
    //@ts-ignore
    mesh: THREE.Mesh
    //@ts-ignore
    ringMesh: THREE.Mesh
    canvas: HTMLCanvasElement

    moons: THREE.Mesh[] = []
    moonData: MoonModel[] = [] // Para armazenar dados de órbita das luas

    constructor() {
        this.scene = new THREE.Scene();
        this.cameraController = new CameraController();
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.xr.enabled = true;  // Certifique-se de que o XR está habilitado

        this.renderer.xr.addEventListener('sessionstart', () => {
            this.scene.position.z = -4
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
        this.loadRings()
        this.addLight()
        this.loadMoons()
        this.animate();
    }

    addLight() {
        this.light = new THREE.DirectionalLight(0xffffff, 1.5);
        this.light.position.set(10, 10, 10);
        this.light.castShadow = true;  // Ativar sombras
        this.light.shadow.mapSize.width = 1024; // Aumentar resolução das sombras
        this.light.shadow.mapSize.height = 1024;
        this.scene.add(this.light);

        const ambientLight = new THREE.AmbientLight(0x404040, 0.5); // Luz ambiente suave
        this.scene.add(ambientLight);

        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Sombra suave
    }

    loadTextures() {
        const textureLoader = new THREE.TextureLoader();
        this.textures.jupiterTexture = textureLoader.load('jupiter/jupitermap.jpg');
        this.textures.ringTexture = textureLoader.load('jupiter/jupiterringcolourSat.png');
        this.textures.ringAlpha = textureLoader.load('jupiter/jupiteralphaSat.png');
        this.textures.ringTexture.rotation = Math.PI / 2;
    }

    loadGeometry() {
        const jupiterMaterial = new THREE.MeshStandardMaterial({
            map: this.textures.jupiterTexture,
            bumpMap: this.textures.jupiterBumpMap,
            bumpScale: 0.05,
        });
    
        // Geometria de jupiter
        const jupiterGeometry = new THREE.SphereGeometry(1, 32, 32);
        this.mesh = new THREE.Mesh(jupiterGeometry, jupiterMaterial);

        this.mesh.rotation.z = THREE.MathUtils.degToRad(8);
        this.mesh.castShadow = true
        
        this.scene.add(this.mesh);
        this.cameraController.camera.position.set(0, 0, 5); // Ajuste para altura VR e posição adequada
    }

    loadRings() {
        const ringGeometry = new THREE.RingGeometry(2, 2.5, 64); // Raio interno e externo dos anéis

        // Ajustar manualmente o mapeamento UV para que a textura siga a curva dos anéis
        const uv = ringGeometry.attributes.uv.array;
        for (let i = 0; i < uv.length; i += 2) {
            const x = uv[i] * 2.0 - 1.0;  // Mapeamento centrado em torno de (0, 0)
            const y = uv[i + 1] * 2.0 - 1.0;

            const angle = Math.atan2(y, x); // Ângulo polar
            const radius = Math.sqrt(x * x + y * y); // Distância do centro

            // Mapear o UV baseado no ângulo e raio
            uv[i] = (angle / (2.0 * Math.PI)) + 0.5;
            uv[i + 1] = radius;
        }

        const ringMaterial = new THREE.MeshBasicMaterial({
            map: this.textures.ringTexture,
            alphaMap: this.textures.ringAlpha,
            transparent: true,       // Manter as partes transparentes na textura
            side: THREE.DoubleSide,  // Renderizar ambos os lados do anel
        });

        this.ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
        this.ringMesh.receiveShadow = true;

        this.ringMesh.castShadow = true
        this.ringMesh.rotation.x = Math.PI / 1.9;  // Inclinação dos anéis
        this.ringMesh.rotation.y = Math.PI * 1.05;

        this.scene.add(this.ringMesh);
    }


    loadMoons() {
        const numMoons = 95
        for (let i = 0; i < numMoons; i++) {

            const textureLoader = new THREE.TextureLoader();
            const textures = {
                moonTexture: textureLoader.load('jupiter/moons/texture.jpg'),
            }

            let moon = new MoonModel({
                orbitRadius: 3 + Math.random() * 5,
                orbitSpeed: 0.001 + Math.random() * 0.002,
                height: (Math.random() - 0.5) * 10,
                size: 0.05 * Math.random(),
                angle: Math.random() * Math.PI * 2,
                textures: textures,
                bumpScale:  (Math.random() * 8) + 2
            })

            this.moonData.push(moon);
            this.moons.push(moon.mesh);
            this.scene.add(moon.mesh);
        }
    }

    animate() {
        this.renderer.setAnimationLoop(() => {
            // Atualize a animação aqui (rotação ou outras interações)
            this.mesh.rotation.y += 0.001;
            this.ringMesh.rotation.z += 0.001;
            // Atualiza a posição da câmera com base no objeto focado
            this.cameraController.update(this.mesh.position);

            // Atualiza as posições das luas
            this.moonData.forEach((moon) => {
                moon.animate()
            });

            this.renderer.render(this.scene, this.cameraController.camera);
        });
    }

    focusOut() {
        this.cameraController.focusOut()
    }

    focusOnJupiter() {
        this.cameraController.followMoon = false; // Desativa o seguimento da Lua
        this.cameraController.targetPosition.set(0, 0, 3); // Ajuste a posição para focar na Terra
        this.cameraController.startTransition(false); // Não seguir a Lua
    }
}