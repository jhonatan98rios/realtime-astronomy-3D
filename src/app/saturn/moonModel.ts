import * as THREE from 'three'

export type MoonModelProps = {
    textures: { [key: string]: THREE.Texture },
    orbitRadius: number
    orbitSpeed: number
    height: number
    size: number
    angle: number
    bumpScale: number
}

export class MoonModel {

    textures: { [key: string]: THREE.Texture } = {}
    //@ts-ignore
    mesh: THREE.Mesh
    orbitRadius: number
    orbitSpeed: number
    height: number
    size: number
    angle: number
    bumpScale: number

    constructor(props: MoonModelProps) {
        this.orbitRadius = props.orbitRadius
        this.orbitSpeed = props.orbitSpeed
        this.height = props.height
        this.size = props.size
        this.angle = props.angle
        this.textures = props.textures
        this.bumpScale = props.bumpScale
        this.loadGeometry()
    }

    loadGeometry() {
        const moonMaterial = new THREE.MeshPhongMaterial({
            map: this.textures.moonTexture,
            bumpMap: this.textures.moonTexture,  // Aplicando o bump map
            bumpScale: this.bumpScale,  // Ajuste a intensidade do relevo 
        });

        console.log(this.size)
        const moonGeometry = new THREE.SphereGeometry(this.size, 8, 8);
        this.mesh = new THREE.Mesh(moonGeometry, moonMaterial);
        this.mesh.castShadow = true

        this.mesh.position.set(
            Math.cos(this.angle) * this.orbitRadius,
            this.height,
            Math.sin(this.angle) * this.orbitRadius
        );
    }

    animate() {
        // Simula a órbita da Lua ao redor da Terra
        this.angle += this.orbitSpeed;

        // Inclinação da órbita de 5 graus (convertido para radianos)
        const inclination = THREE.MathUtils.degToRad(this.height);
        this.mesh.position.x = Math.cos(this.angle) * this.orbitRadius;
        this.mesh.position.z = Math.sin(this.angle) * this.orbitRadius * Math.cos(inclination);
        this.mesh.position.y = Math.sin(this.angle) * this.orbitRadius * Math.sin(inclination);
    }
}