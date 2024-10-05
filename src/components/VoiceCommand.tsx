"use client";

import React, { useEffect, useState } from 'react';
import { commands } from './Commands';
import './Style.css'; 

declare global {
    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }
}

const VoiceCommand = () => {
    const [transcript, setTranscript] = useState('');
    const [showIcon, setShowIcon] = useState(false); // Estado para mostrar/ocultar o ícone do microfone
    const [error, setError] = useState(''); // Estado para armazenar erros

    const navigateTo = (destination: string) => {
        window.location.href = `/${destination}`;  
    };

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setError('Seu navegador não suporta reconhecimento de voz.');
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true; // Ouve constantemente
        recognition.interimResults = true; // Permite resultados intermediários
        recognition.lang = 'pt-BR'; // Define o idioma para português

        recognition.onstart = () => {
            setShowIcon(true); // Mostra o ícone do microfone
            setError(''); // Limpa erros
        };

        recognition.onresult = (event: any) => {
            const currentTranscript = event.results[event.resultIndex][0].transcript.trim();

            // Verifica se a palavra-chave "comando" foi dita
            if (currentTranscript.toLowerCase().includes("comando")) {
                const command = currentTranscript.slice("comando".length).trim(); // Extrai o comando

                // Atualiza a transcrição apenas se "comando" for dito
                setTranscript(currentTranscript); 

                // Verifica se o comando é um comando de navegação
                const destination = commands[command.toLowerCase()];
                if (destination) {
                    navigateTo(destination); // Navega para a URL correspondente
                } else {
                    console.log('Comando não reconhecido:', command); // Log para comandos não reconhecidos
                }
            }
        };

        recognition.onerror = (event: any) => {
            console.error('Erro de reconhecimento:', event.error);
            if (event.error === 'not-allowed') {
                setError('Permissão para usar o microfone foi negada.');
            } else {
                setError('Erro ao acessar o microfone: ' + event.error);
            }
            setShowIcon(false); // Esconde o ícone do microfone em caso de erro
        };

        // Solicita permissão do microfone
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(() => {
                recognition.start(); // Inicia o reconhecimento após obter permissão
            })
            .catch((err) => {
                console.error('Erro ao acessar o microfone:', err);
                setError('Erro ao acessar o microfone. Verifique as permissões.');
            });

        return () => {
            recognition.stop(); // Função de limpeza para parar o reconhecimento ao desmontar
        };
    }, []); // Executa o efeito apenas uma vez ao montar o componente

    return (
        <div style={{ position: 'relative' }}>
            {error && <p style={{ color: 'red' }}>{error}</p>} {/* Exibe erros, se houver */}
            {/* Exibe o ícone do microfone se estiver escutando */}
            {showIcon && (
                <span
                    role="img"
                    aria-label="microphone"
                    className="pulse" // Adiciona a classe de animação
                    style={{ fontSize: '20px', position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)' }}                 
                >
                    🎤
                </span>
            )}
            <p>Transcrição: {transcript}</p> {/* Mostra a transcrição atual */}
        </div>
    );
};

export default VoiceCommand;
