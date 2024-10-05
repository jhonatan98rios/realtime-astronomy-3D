import { CameraController } from '@/infra/CameraController'
import * as THREE from 'three'
import { MoonModel } from './moonModel'

export class MarsModel {

    scene: THREE.Scene
    cameraController: CameraController
    renderer: THREE.WebGLRenderer
    light?: THREE.DirectionalLight
    textures: { [key: string]: THREE.Texture } = {}
    canvas: HTMLCanvasElement
    //@ts-ignore
    mesh: THREE.Mesh

    moons: THREE.Mesh[] = []
    moonData: MoonModel[] = [] // Para armazenar dados de órbita das luas

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
        this.loadAtmosphere()
        this.addLight()
        this.loadMoons()
        this.generateStars()
        this.animate();
    }

    addLight() {
        // const ambientLight = new THREE.AmbientLight(0x404040, 0.1); // Luz suave e difusa
        // ambientLight.castShadow = true
        // this.scene.add(ambientLight);

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
        this.textures.marsTexture = textureLoader.load('mars/marsmap4k.jpg');
        this.textures.marsBumpMap = textureLoader.load('mars/marsbump.jpg');
        this.textures.marsSpecularMap = textureLoader.load('mars/marsspecular.jpg');
    }

    loadGeometry() {
        const marsMaterial = new THREE.MeshPhongMaterial({
            map: this.textures.marsTexture,
            bumpMap: this.textures.marsBumpMap,
            bumpScale: 5,
            specularMap: this.textures.marsSpecularMap,
            specular: new THREE.Color(0x222222), // Suave brilho especular
            shininess: 10, // Controle da intensidade do brilho
        });
    
        // Geometria de Marte
        const marsGeometry = new THREE.SphereGeometry(1, 32, 32);
        this.mesh = new THREE.Mesh(marsGeometry, marsMaterial);
        this.scene.add(this.mesh);
    }

    loadAtmosphere() {
        const atmosphereGeometry = new THREE.SphereGeometry(1.01, 32, 32);  // Um pouco maior que a Terra
        const atmosphereMaterial = new THREE.MeshPhongMaterial({
            color: 0xff6622,   // Cor levemente alaranjada para Marte
            transparent: true,
            opacity: 0.2,  // Transparência baixa para um efeito sutil
            blending: THREE.BackSide,
        });
        const atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
        this.scene.add(atmosphereMesh);
    }

    loadMoons() {
        const numMoons = 2
        for (let i = 0; i < numMoons; i++) {

            const textureLoader = new THREE.TextureLoader();
            const textures = {
                moonTexture: textureLoader.load('neptune/moons/texture.jpg'),
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

            this.mesh.rotation.y += 0.0007;

            this.cameraController.update(this.mesh.position);

            this.renderer.render(this.scene,  this.cameraController.camera);
        });
    }

    focusOut() {
        this.cameraController.focusOut()
    }

    focusOnMars() {
        this.cameraController.followMoon = false; // Desativa o seguimento da Lua
        this.cameraController.focusOnPlanet();
        window.history.pushState({}, '', '#');
    }
    generateStars() {
        const starGeometry = new THREE.BufferGeometry();
        const starMaterial = new THREE.PointsMaterial({
          color: 0xffffff, // Cor branca para as estrelas
          size: 1, // Tamanho padrão das estrelas
          sizeAttenuation: true, // Faz com que as estrelas fiquem menores conforme se distanciam
        });
    
        const starCount = 3000; // Quantidade de estrelas
        const positions = new Float32Array(starCount * 3); // 3 valores para x, y, z de cada estrela
    
        const minDistance = 500; // Distância mínima de 100 unidades em todas as direções
    
        for (let i = 0; i < starCount; i++) {
          let x, y, z;
          do {
            // Gera coordenadas aleatórias dentro de um volume cúbico de 2000x2000x2000
            x = THREE.MathUtils.randFloatSpread(2000);
            y = THREE.MathUtils.randFloatSpread(2000);
            z = THREE.MathUtils.randFloatSpread(2000);
          } while (
            Math.abs(x) < minDistance &&
            Math.abs(y) < minDistance &&
            Math.abs(z) < minDistance
          );
          // Garante que a estrela esteja fora da zona mínima de 100 unidades em todas as direções
    
          positions[i * 3] = x;
          positions[i * 3 + 1] = y;
          positions[i * 3 + 2] = z;
        }
    
        // Atribui as posições geradas à geometria
        starGeometry.setAttribute(
          "position",
          new THREE.BufferAttribute(positions, 3)
        );
    
        // Cria o objeto de partículas (estrelas) e o adiciona à cena
        const stars = new THREE.Points(starGeometry, starMaterial);
        this.scene.add(stars);
    }
}

