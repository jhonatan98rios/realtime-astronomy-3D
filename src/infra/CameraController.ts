import * as THREE from 'three'

export class CameraController {
    camera: THREE.PerspectiveCamera
    targetObject: THREE.Object3D | null = null  // Astro alvo da câmera
    focusTransitionSpeed: number = 0.05  // Velocidade de transição suave
    isTransitioning: boolean = false  // Se está ocorrendo uma transição
    followTarget: boolean = false  // Se deve continuar seguindo o objeto após a transição

    constructor() {
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    }

    // Focar em um astro específico com transição suave
    focusOnObject(object: THREE.Mesh) {
        this.targetObject = object
        this.isTransitioning = true  // Inicia a transição
        this.followTarget = false    // Durante a transição, não seguimos o objeto
    }

    focusOut() {
        this.camera.position.set(0, 0, 10)
        this.targetObject = null
        this.followTarget = false
        this.isTransitioning = true
    }

    update() {
        if (this.targetObject) {
            const targetPosition = this.targetObject.position.clone()
            const offset = new THREE.Vector3(0, 0, 3)  // Offset para garantir que a câmera não fique dentro do objeto
            const desiredPosition = targetPosition.clone().add(offset)

            if (this.isTransitioning) {
                // Durante a transição, interpolamos a posição da câmera até o objeto
                this.camera.position.lerp(desiredPosition, this.focusTransitionSpeed)

                // Quando a câmera chega perto o suficiente do alvo, finalizamos a transição
                if (this.camera.position.distanceTo(desiredPosition) < 0.1) {
                    this.isTransitioning = false
                    this.followTarget = true  // Ativamos o estado de seguir o objeto
                }
            }

            // Se a transição terminou, seguimos o objeto continuamente
            if (this.followTarget) {
                this.camera.position.copy(desiredPosition)
            }

            // Sempre olhamos para o objeto, independentemente do estado
            this.camera.lookAt(targetPosition)
        }
    }

    resize() {
        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.updateProjectionMatrix()
    }
}
