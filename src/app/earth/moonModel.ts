import * as THREE from 'three'

export type MoonModelProps = {
    textures: {
        map: string,
        bump: string,
        normal: string
    }
}

export class MoonModel {

    textures: { [key: string]: THREE.Texture } = {}
    //@ts-ignore
    mesh: THREE.Mesh

    orbitRadius = 10 // Deveria ser 30
    angle = 0
    orbitSpeed = 0.001; // Velocidade da órbita, proporcional aos 27,3 dias

    constructor(props: MoonModelProps) {
        this.loadTextures(props.textures)
        this.loadGeometry()
    }

    loadTextures(textures: MoonModelProps['textures']) {
        const textureLoader = new THREE.TextureLoader();
        this.textures.moonTexture = textureLoader.load(textures.map);
        this.textures.moonBumpMap = textureLoader.load(textures.bump);
        this.textures.moonNormalMap = textureLoader.load(textures.normal);
    }

    loadGeometry() {
        const moonMaterial = new THREE.MeshPhongMaterial({
            map: this.textures.moonTexture,
            bumpMap: this.textures.moonBumpMap,  // Aplicando o bump map
            bumpScale: 1,  // Ajuste a intensidade do relevo 
            normalMap: this.textures.moonNormalMap,
        });
        const moonGeometry = new THREE.SphereGeometry(0.27, 32, 32);  // Tamanho proporcional à Terra
        this.mesh = new THREE.Mesh(moonGeometry, moonMaterial);
        this.mesh.castShadow = true
    }

    animate() {
        // Simula a órbita da Lua ao redor da Terra
        this.angle += this.orbitSpeed;

        // Inclinação da órbita de 5 graus (convertido para radianos)
        const inclination = THREE.MathUtils.degToRad(5);
        this.mesh.position.x = Math.cos(this.angle) * this.orbitRadius;
        this.mesh.position.z = Math.sin(this.angle) * this.orbitRadius * Math.cos(inclination);
        this.mesh.position.y = Math.sin(this.angle) * this.orbitRadius * Math.sin(inclination);
    }
}