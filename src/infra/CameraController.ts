import * as THREE from 'three';

export class CameraController {
    camera: THREE.PerspectiveCamera;
    focusTransitionSpeed: number = 0.05; // Velocidade de transição suave
    isTransitioning: boolean = false; // Se está ocorrendo uma transição
    targetPosition: THREE.Vector3; // Posição alvo da câmera
    transitionDuration: number = 1; // Duração da transição em segundos
    transitionStartTime: number | null = null; // Tempo de início da transição
    followMoon: boolean = false; // Se a câmera deve seguir a Lua
    satellitesFixedDistance: number = 0.8; // Distância fixa da câmera em relação à Lua

    constructor() {
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.targetPosition = new THREE.Vector3(0, 0, 1000); // Posição padrão inicial da câmera
        this.camera.position.copy(this.targetPosition); // Define a posição inicial
        this.focusOut()
    }

    focusOut() {
        this.targetPosition.set(0, 0, 10); // Ajuste a posição para visualizar a Terra e a Lua
        this.startTransition(false); // Não seguir nenhum objeto
    }

    focusOnPlanet() {
        this.followMoon = false; // Desativa o seguimento da Lua
        this.targetPosition.set(0, 0, 2); // Ajuste a posição para focar na Terra
        this.startTransition(false); // Não seguir a Lua
    }

    // Focar em uma das Luas
    focusOnMoon(moonPosition: THREE.Vector3) {
        this.followMoon = true; // Ativa o seguimento da Lua
        this.transitionStartTime = null; // Reseta o tempo de início
        this.targetPosition.copy(moonPosition); // Inicia a posição alvo na posição da Lua
        this.targetPosition.z += this.satellitesFixedDistance; // Mantém a distância fixa
        this.startTransition(true); // Inicia a transição e segue a Lua
    }

    // Se afastar muito de ambos
    zoomOut() {
        this.followMoon = false; // Desativa o seguimento da Lua
        this.targetPosition.set(0, 0, 1000); // Ajuste a posição para se afastar
        this.startTransition(false); // Não seguir nenhum objeto
    }

    // Inicia a transição
    private startTransition(follow: boolean) {
        if (!this.isTransitioning) {
            this.isTransitioning = true;
            this.followMoon = follow; // Define se deve seguir a Lua
            this.transitionStartTime = performance.now(); // Armazena o tempo de início da transição
        }
    }

    // Atualiza a posição da câmera
    update(moonPosition: THREE.Vector3) {
        if (this.isTransitioning) {
            this.handleTransition(moonPosition); // Passa a posição da Lua para a transição
        } else if (this.followMoon) {
            this.followMoonObject(moonPosition); // Segue a Lua
        }
    }

    // Lida com a transição da câmera
    private handleTransition(moonPosition: THREE.Vector3) {
        const elapsedTime = performance.now() - (this.transitionStartTime as number);
        const progress = Math.min(elapsedTime / (this.transitionDuration * 1000), 1); // Calcular o progresso da transição

        // Atualiza a posição alvo com a posição atual da Lua durante a transição
        if (this.followMoon) {
            this.targetPosition.copy(moonPosition);
            this.targetPosition.z += this.satellitesFixedDistance; // Mantém a distância fixa
        }

        // Interpole a posição da câmera para a posição alvo
        this.camera.position.lerp(this.targetPosition, progress);

        // Quando a transição terminar, finalize a animação e atualize a posição da câmera
        if (progress === 1) {
            this.isTransitioning = false; // Finaliza a transição
            this.transitionStartTime = null; // Reseta o tempo de início

            // Se a Lua estiver sendo seguida, a posição da câmera é fixada
            if (this.followMoon) {
                this.camera.position.copy(this.targetPosition); // Define a posição da câmera como a posição alvo
            }
        }
    }

    // Faz a câmera seguir a Lua
    private followMoonObject(moonPosition: THREE.Vector3) {
        // Atualiza a posição da Lua e mantém a distância fixa
        this.targetPosition.copy(moonPosition);
        this.targetPosition.z += this.satellitesFixedDistance; // Mantém a distância fixa

        // A câmera agora segue suavemente a nova posição
        this.camera.position.lerp(this.targetPosition, this.focusTransitionSpeed);
    }

    resize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
    }
}
