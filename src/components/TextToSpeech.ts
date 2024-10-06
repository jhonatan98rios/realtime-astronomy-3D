import { useEffect, useState } from 'react';

const useSpeech = (text: string) => {
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

    // Função para carregar as vozes como uma Promise
    const loadVoices = (): Promise<SpeechSynthesisVoice[]> => {
        return new Promise((resolve) => {
            const availableVoices = window.speechSynthesis.getVoices();
            if (availableVoices.length > 0) {
                resolve(availableVoices);
            } else {
                // Adiciona um listener para o evento de mudança de vozes
                window.speechSynthesis.onvoiceschanged = () => {
                    const updatedVoices = window.speechSynthesis.getVoices();
                    resolve(updatedVoices);
                };
            }
        });
    };

    const speak = (text: string) => {
        const utterance = new SpeechSynthesisUtterance(text);
        const portugueseVoice = voices[2]

        if (portugueseVoice) {
            utterance.voice = portugueseVoice;
        }

        console.log("Falando:", text); // Log para depuração
        // Inicia a fala
        window.speechSynthesis.speak(utterance);
    };

    useEffect(() => {
        // Carrega as vozes e depois fala o texto
        loadVoices().then(availableVoices => {
            setVoices(availableVoices);
            
            if (text) {
                // Cancela qualquer narração anterior
                window.speechSynthesis.cancel();

                // Chama a função para falar o texto
                setTimeout(() => {
                    speak(text);
                }, 1000); // Aguarda meio segundo antes de falar para garantir que as vozes estão carregadas
            }
        });

        // Interrompe a fala ao sair da página
        return () => {
            window.speechSynthesis.cancel(); // Cancela a narração ao desmontar
            window.speechSynthesis.onvoiceschanged = null;
        };
    }, [text]);

};

export default useSpeech;
