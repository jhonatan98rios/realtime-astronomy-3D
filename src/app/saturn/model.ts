import * as THREE from 'three'

export class SaturnModel {

    scene: THREE.Scene
    camera: THREE.PerspectiveCamera
    renderer: THREE.WebGLRenderer
    light?: THREE.DirectionalLight
    textures: { [key: string]: THREE.Texture } = {}
    //@ts-ignore
    mesh: THREE.Mesh
    //@ts-ignore
    ringMesh: THREE.Mesh

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

        this.loadTextures()
        this.loadGeometry()
        this.loadRings()
        this.loadAtmosphere()
        this.addLight()
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
        this.textures.saturnTexture = textureLoader.load('saturn/saturnmap.jpg');
        this.textures.ringTexture = textureLoader.load('saturn/saturnringcolor.png');
        this.textures.ringTexture.rotation = Math.PI / 2;
        this.textures.ringAlpha = textureLoader.load('saturn/saturnringalpha.png');
    }

    loadGeometry() {
        const saturnMaterial = new THREE.MeshStandardMaterial({
            map: this.textures.saturnTexture,
            metalness: 0.1,  // Controla o brilho da superfície
            roughness: 0.8,   // Controla o quanto a luz se espalha
        });
    
        // Geometria de Saturno
        const saturnGeometry = new THREE.SphereGeometry(1, 32, 32);
        this.mesh = new THREE.Mesh(saturnGeometry, saturnMaterial);

        this.mesh.rotation.z = THREE.MathUtils.degToRad(8);
        this.mesh.castShadow = true
        
        this.scene.add(this.mesh);
        this.camera.position.set(0, 0, 5); // Ajuste para altura VR e posição adequada
    }

    loadRings() {
        const ringGeometry = new THREE.RingGeometry(1.4, 2.5, 64); // Raio interno e externo dos anéis

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

    loadAtmosphere() {
        const atmosphereGeometry = new THREE.SphereGeometry(1.05, 64, 64); // Um pouco maior que Saturno
        const atmosphereMaterial = new THREE.MeshPhongMaterial({
            color: 0xddddff, // Cor suave para a atmosfera
            transparent: true,
            opacity: 0.1, // Camada transparente
        });
        const atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
        this.scene.add(atmosphereMesh);
    }


    animate() {
        this.renderer.setAnimationLoop(() => {
            // Atualize a animação aqui (rotação ou outras interações)
            this.ringMesh.rotation.z += 0.001;

            this.renderer.render(this.scene, this.camera);
        });
    }

}

