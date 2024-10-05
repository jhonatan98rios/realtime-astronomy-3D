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
        this.generateStars()
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