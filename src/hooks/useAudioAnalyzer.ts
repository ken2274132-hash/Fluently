'use client';

import { useRef, useCallback, useState } from 'react';

interface UseAudioAnalyzerReturn {
    audioLevel: number;
    analyzeAudioElement: (audio: HTMLAudioElement) => void;
    stopAnalyzing: () => void;
}

export function useAudioAnalyzer(): UseAudioAnalyzerReturn {
    const [audioLevel, setAudioLevel] = useState(0);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
    const animationFrameRef = useRef<number | null>(null);
    const connectedElementRef = useRef<HTMLAudioElement | null>(null);

    const analyzeAudioElement = useCallback((audio: HTMLAudioElement) => {
        // Don't reconnect the same element
        if (connectedElementRef.current === audio) {
            return;
        }

        // Clean up previous
        stopAnalyzing();

        try {
            // Create audio context
            const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
            const audioContext = new AudioContextClass();
            const analyser = audioContext.createAnalyser();
            analyser.fftSize = 256;
            analyser.smoothingTimeConstant = 0.8;

            // Create source from audio element
            const source = audioContext.createMediaElementSource(audio);
            source.connect(analyser);
            analyser.connect(audioContext.destination);

            audioContextRef.current = audioContext;
            analyserRef.current = analyser;
            sourceRef.current = source;
            connectedElementRef.current = audio;

            // Start analyzing
            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);

            const analyze = () => {
                if (!analyserRef.current) return;

                analyserRef.current.getByteFrequencyData(dataArray);

                // Focus on voice frequencies (85-255 Hz for fundamentals, up to 3000 Hz for clarity)
                // These typically map to indices 2-70 in a 256-bin FFT at 44.1kHz
                let sum = 0;
                const voiceStart = 2;
                const voiceEnd = 70;

                for (let i = voiceStart; i < voiceEnd; i++) {
                    sum += dataArray[i];
                }

                const average = sum / (voiceEnd - voiceStart);
                const normalizedLevel = Math.min(average / 128, 1);

                setAudioLevel(normalizedLevel);
                animationFrameRef.current = requestAnimationFrame(analyze);
            };

            analyze();
        } catch (err) {
            console.error('Audio analyzer error:', err);
        }
    }, []);

    const stopAnalyzing = useCallback(() => {
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = null;
        }

        // Don't close the audio context if we want to reuse it
        // Just stop the animation frame
        setAudioLevel(0);
    }, []);

    return {
        audioLevel,
        analyzeAudioElement,
        stopAnalyzing
    };
}
