import { CameraController } from "@/infra/CameraController";
import * as THREE from "three";

export class SunModel {
  scene: THREE.Scene;
  cameraController: CameraController;
  renderer: THREE.WebGLRenderer;
  light?: THREE.DirectionalLight;
  textures: { [key: string]: THREE.Texture } = {};
  //@ts-ignore
  mesh: THREE.Mesh;
  //@ts-ignore
  canvas: HTMLCanvasElement;

  constructor() {
    this.scene = new THREE.Scene();
    this.cameraController = new CameraController();
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.xr.enabled = true;

    this.renderer.xr.addEventListener("sessionstart", () => {
      this.scene.position.z = -4;
      this.scene.position.y = 1;
    });

    this.canvas = this.renderer.domElement;
    document.body.appendChild(this.canvas);

    window.addEventListener("resize", () => {
      this.cameraController.resize();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });

    this.loadTextures();
    this.loadGeometry();
    this.addLight();
    this.loadAtmosphere(); // Adiciona a atmosfera
    // this.addParticleExplosion(); // Adiciona partículas para simular explosões
    this.animate();
    // Gerar o céu estrelado
    this.generateStars(); // Adiciona o fundo de estrelas ao redor do sistema solar
  }

  loadTextures() {
    const textureLoader = new THREE.TextureLoader();
    this.textures.sunTexture = textureLoader.load("sun/sunmap.jpg");
  }

  loadGeometry() {
    const vertexShader = `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                vec3 pos = position;
                pos.x += sin(uv.y * 10.0) * 0.02; // Distorção suave na superfície
                gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            }
        `;

    const fragmentShader = `
            uniform sampler2D sunTexture;
            varying vec2 vUv;
            void main() {
                vec3 texture = texture2D(sunTexture, vUv).rgb;
                gl_FragColor = vec4(texture, 1.0);
            }
        `;

    const sunMaterial = new THREE.ShaderMaterial({
      uniforms: {
        sunTexture: { value: this.textures.sunTexture },
      },
      vertexShader,
      fragmentShader,
    });

    const sunGeometry = new THREE.SphereGeometry(1, 32, 32);
    this.mesh = new THREE.Mesh(sunGeometry, sunMaterial);
    this.scene.add(this.mesh);
    this.cameraController.camera.position.set(0, 0, 5); // Ajuste de posição da câmera
  }

  addLight() {
    this.light = new THREE.DirectionalLight(0xffffff, 1.5);
    this.light.position.set(10, 10, 10);
    this.light.castShadow = true;
    this.light.shadow.mapSize.width = 1024;
    this.light.shadow.mapSize.height = 1024;
    this.scene.add(this.light);

    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    this.scene.add(ambientLight);

    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  }

  loadAtmosphere() {
    const atmosphereGeometry = new THREE.SphereGeometry(1.06, 64, 64); // Um pouco maior que o sol
    const atmosphereMaterial = new THREE.MeshBasicMaterial({
      color: 0xffcc33, // Cor amarelada para a atmosfera
      transparent: true,
      opacity: 0.3, // Levemente transparente
      blending: THREE.AdditiveBlending, // Mistura de cor para efeito brilhante
      side: THREE.BackSide, // Renderizar a parte interna para efeito de aura
    });
    const atmosphereMesh = new THREE.Mesh(
      atmosphereGeometry,
      atmosphereMaterial
    );
    this.scene.add(atmosphereMesh);
  }

  addParticleExplosion() {
    const particleCount = 1000;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.5) * 2; // Posição aleatória
      const y = (Math.random() - 0.5) * 2;
      const z = (Math.random() - 0.5) * 2;
      positions.set([x, y, z], i * 3);
    }

    particles.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const particleMaterial = new THREE.PointsMaterial({
      color: 0xff9900,
      size: 0.05,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });

    const particleSystem = new THREE.Points(particles, particleMaterial);
    this.scene.add(particleSystem);

    // Animação para as partículas
    this.renderer.setAnimationLoop(() => {
      const positions = particles.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 1] += 0.01 * Math.random(); // Movimentação das partículas
      }
      particles.attributes.position.needsUpdate = true;
    });
  }

  animate() {
    this.renderer.setAnimationLoop(() => {
      // Rotação do sol
      this.mesh.rotation.y += 0.001;
      // Atualiza a posição da câmera com base no objeto focado
      this.cameraController.update(this.mesh.position);
      // Renderização da cena
      this.renderer.render(this.scene, this.cameraController.camera);
    });
  }

  focusOut() {
    this.cameraController.focusOut();
  }

  focusOnSun() {
    this.cameraController.followMoon = false; // Desativa o seguimento da Lua
    this.cameraController.targetPosition.set(0, 0, 3); // Ajuste a posição para focar no Sol
    this.cameraController.startTransition(false); // Não seguir a Lua
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
