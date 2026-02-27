'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Mic, MicOff, Phone, Sparkles, Loader2, ArrowLeft, Volume2, User2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { TOPICS, SITE_CONFIG } from '@/lib/constants';
import dynamic from 'next/dynamic';

// Dynamically import 3D avatar to avoid SSR issues
const Avatar3D = dynamic(() => import('@/components/Avatar3D'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-800">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        </div>
    )
});

type PageStatus = 'idle' | 'connecting' | 'connected' | 'speaking' | 'listening' | 'error';

export default function VoiceAvatarPage() {
    const router = useRouter();
    const [status, setStatus] = useState<PageStatus>('idle');
    const [statusMessage, setStatusMessage] = useState('Click Start to begin');
    const [isMuted, setIsMuted] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const [showAvatar, setShowAvatar] = useState(true);
    const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
    const [selectedTopic, setSelectedTopic] = useState(TOPICS[0]);
    const [audioLevel, setAudioLevel] = useState(0);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const animationFrameRef = useRef<number | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const playbackAnalyserRef = useRef<AnalyserNode | null>(null);
    const playbackSourceRef = useRef<MediaElementAudioSourceNode | null>(null);

    const cleanupResources = useCallback(() => {
        try {
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
            mediaRecorderRef.current?.stream?.getTracks().forEach(track => track.stop());
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.src = '';
                audioRef.current = null;
            }
            window.speechSynthesis?.cancel();
            playbackSourceRef.current = null;
            playbackAnalyserRef.current = null;
            if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
                audioContextRef.current.close().catch(() => {});
            }
        } catch (e) {
            // Ignore cleanup errors
        }
    }, []);

    const handleBack = useCallback(() => {
        // Hide avatar first to unmount 3D component
        setShowAvatar(false);
        cleanupResources();
        // Allow time for 3D cleanup before navigation
        setTimeout(() => {
            window.location.href = '/dashboard';
        }, 100);
    }, [cleanupResources]);

    useEffect(() => {
        setIsClient(true);
        return () => {
            cleanupResources();
        };
    }, [cleanupResources]);

    const startSession = async () => {
        setStatus('connecting');
        setStatusMessage('Starting session...');

        try {
            // Get initial greeting
            const chatRes = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: selectedTopic.prompt,
                    history: []
                })
            });
            const { response } = await chatRes.json();
            await playResponse(response);
            setStatus('connected');
            setStatusMessage('Ready - speak to interact');
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Unknown error';
            setStatus('error');
            setStatusMessage('Error: ' + message);
        }
    };

    const endSession = () => {
        setStatus('idle');
        setStatusMessage('Session ended');
        setMessages([]);
        setAudioLevel(0);
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }
        window.speechSynthesis?.cancel();
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) audioChunksRef.current.push(event.data);
            };

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
                await processAudio(audioBlob);
            };

            mediaRecorder.start();
            setStatus('listening');
            setStatusMessage('Listening...');
            setupMicVisualizer(stream);
        } catch {
            setStatusMessage('Error accessing microphone');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && status === 'listening') {
            mediaRecorderRef.current.stop();
            setAudioLevel(0);
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        }
    };

    const setupMicVisualizer = (stream: MediaStream) => {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const audioContext = new AudioContextClass();
        const analyser = audioContext.createAnalyser();
        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);
        analyser.fftSize = 256;

        audioContextRef.current = audioContext;
        analyserRef.current = analyser;

        const draw = () => {
            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);
            analyser.getByteFrequencyData(dataArray);

            let sum = 0;
            for (let i = 0; i < bufferLength; i++) {
                sum += dataArray[i];
            }
            const average = sum / bufferLength;
            setAudioLevel(average / 128);

            animationFrameRef.current = requestAnimationFrame(draw);
        };

        draw();
    };

    const setupPlaybackAnalyzer = (audio: HTMLAudioElement) => {
        try {
            const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

            if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
                audioContextRef.current = new AudioContextClass();
            }

            const audioContext = audioContextRef.current;

            if (audioContext.state === 'suspended') {
                audioContext.resume();
            }

            if (!playbackSourceRef.current) {
                const analyser = audioContext.createAnalyser();
                analyser.fftSize = 256;
                analyser.smoothingTimeConstant = 0.8;

                const source = audioContext.createMediaElementSource(audio);
                source.connect(analyser);
                analyser.connect(audioContext.destination);

                playbackAnalyserRef.current = analyser;
                playbackSourceRef.current = source;
            }

            const analyser = playbackAnalyserRef.current!;
            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);

            const analyze = () => {
                // Check if audio is still playing
                if (audio.paused || audio.ended) {
                    setAudioLevel(0);
                    return;
                }

                analyser.getByteFrequencyData(dataArray);

                let sum = 0;
                for (let i = 2; i < 70; i++) {
                    sum += dataArray[i];
                }
                const average = sum / 68;
                setAudioLevel(Math.min(average / 100, 1));

                animationFrameRef.current = requestAnimationFrame(analyze);
            };

            analyze();
        } catch {
            // Silent fail
        }
    };

    const processAudio = async (blob: Blob) => {
        setStatus('connecting');
        setStatusMessage('Transcribing...');

        try {
            const formData = new FormData();
            formData.append('file', blob);
            const sttRes = await fetch('/api/stt', { method: 'POST', body: formData });
            const { text } = await sttRes.json();

            if (!text) throw new Error('Could not understand audio');

            setMessages(prev => [...prev, { role: 'user', content: text }]);
            setStatusMessage('Thinking...');

            const chatRes = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text, history: messages.slice(-10) })
            });
            const { response } = await chatRes.json();

            await playResponse(response);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Something went wrong';
            setStatusMessage('Error: ' + message);
            setStatus('connected');
        }
    };

    const playResponse = async (text: string) => {
        try {
            setStatus('speaking');
            setStatusMessage('Speaking...');

            const ttsRes = await fetch('/api/tts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text })
            });

            if (!ttsRes.ok) {
                speakLocal(text);
                return;
            }

            const audioBlob = await ttsRes.blob();
            const audioUrl = URL.createObjectURL(audioBlob);

            setMessages(prev => [...prev, { role: 'assistant', content: text }]);

            const audio = new Audio(audioUrl);
            audioRef.current = audio;

            audio.onplay = () => {
                setupPlaybackAnalyzer(audio);
            };

            audio.onended = () => {
                setStatus('connected');
                setAudioLevel(0);
                setStatusMessage('Ready - speak to interact');
                if (animationFrameRef.current) {
                    cancelAnimationFrame(animationFrameRef.current);
                }
            };

            audio.onerror = () => speakLocal(text);

            await audio.play();
        } catch {
            speakLocal(text);
        }
    };

    const speakLocal = (text: string) => {
        if (!('speechSynthesis' in window)) {
            setStatusMessage('Voice error: Not supported');
            setStatus('connected');
            return;
        }

        try {
            window.speechSynthesis.cancel();
        } catch (e) {
            // Ignore cancel errors
        }

        setMessages(prev => {
            if (prev.length > 0 && prev[prev.length - 1].content === text) return prev;
            return [...prev, { role: 'assistant', content: text }];
        });

        const utterance = new SpeechSynthesisUtterance(text);

        let localAnimationFrame: number;
        let isSpeaking = true;

        const simulateLevel = () => {
            if (!isSpeaking) return;
            setAudioLevel(0.3 + Math.random() * 0.4);
            localAnimationFrame = requestAnimationFrame(simulateLevel);
        };

        const cleanup = () => {
            isSpeaking = false;
            setAudioLevel(0);
            if (localAnimationFrame) cancelAnimationFrame(localAnimationFrame);
        };

        utterance.onstart = () => {
            setStatus('speaking');
            setStatusMessage('Speaking (Browser Voice)');
            simulateLevel();
        };
        utterance.onend = () => {
            cleanup();
            setStatus('connected');
            setStatusMessage('Ready - speak to interact');
        };
        utterance.onerror = () => {
            cleanup();
            setStatusMessage('Voice Error');
            setStatus('connected');
        };

        const setVoice = () => {
            try {
                const voices = window.speechSynthesis.getVoices();
                const preferredVoices = [
                    voices.find(v => v.name.includes('Google US English')),
                    voices.find(v => v.name.includes('Natural')),
                    voices.find(v => v.name.includes('Samantha')),
                    voices.find(v => v.lang.startsWith('en-US')),
                    voices.find(v => v.lang.startsWith('en'))
                ];
                const voice = preferredVoices.find(v => v !== undefined);
                if (voice) utterance.voice = voice;
                utterance.rate = 0.95;
                utterance.pitch = 1.0;
                window.speechSynthesis.speak(utterance);
            } catch (e) {
                cleanup();
                setStatus('connected');
                setStatusMessage('Ready - speak to interact');
            }
        };

        if (window.speechSynthesis.getVoices().length > 0) {
            setVoice();
        } else {
            window.speechSynthesis.onvoiceschanged = setVoice;
        }
    };

    const toggleMute = () => {
        setIsMuted(!isMuted);
    };

    if (!isClient) return null;

    const getStatusColor = () => {
        switch (status) {
            case 'connected': return 'bg-emerald-500';
            case 'speaking': return 'bg-indigo-500 animate-pulse';
            case 'listening': return 'bg-red-500 animate-pulse';
            case 'connecting': return 'bg-amber-500 animate-pulse';
            case 'error': return 'bg-red-500';
            default: return 'bg-zinc-400 dark:bg-zinc-500';
        }
    };

    const getStatusText = () => {
        switch (status) {
            case 'connected': return 'Connected';
            case 'speaking': return 'AI Speaking';
            case 'listening': return 'Listening';
            case 'connecting': return 'Connecting';
            case 'error': return 'Error';
            default: return 'Ready';
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-[#09090b]">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800/50">
                <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleBack}
                            className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="font-semibold text-zinc-900 dark:text-white">{SITE_CONFIG.name}</h1>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">{statusMessage}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                            <div className={`w-2 h-2 rounded-full transition-all ${getStatusColor()}`} />
                            <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                                {getStatusText()}
                            </span>
                        </div>

                        {status !== 'idle' && (
                            <button
                                onClick={endSession}
                                className="p-2.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-all"
                            >
                                <Phone size={18} className="rotate-[135deg]" />
                            </button>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 pt-24 pb-12">
                <div className="max-w-4xl mx-auto px-6">
                    {/* Avatar Container */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative aspect-video rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl"
                    >
                        {status === 'idle' ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/30">
                                    <User2 size={36} className="text-white" />
                                </div>
                                <h2 className="text-xl font-semibold mb-1 text-zinc-900 dark:text-white">3D Avatar Teacher</h2>
                                <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-5 text-center">
                                    Speak naturally and get real-time responses
                                </p>

                                {/* Topic Selection - 2x2 Grid */}
                                <div className="grid grid-cols-2 gap-2 mb-5 w-full max-w-xs">
                                    {TOPICS.map(topic => (
                                        <button
                                            key={topic.id}
                                            onClick={() => setSelectedTopic(topic)}
                                            className={`px-3 py-2.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2 ${
                                                selectedTopic.id === topic.id
                                                    ? 'bg-indigo-500 text-white shadow-md'
                                                    : 'bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700'
                                            }`}
                                        >
                                            <span>{topic.icon}</span>
                                            <span className="font-medium">{topic.label}</span>
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={startSession}
                                    className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/30 flex items-center gap-2"
                                >
                                    <User2 size={20} />
                                    Start Avatar Session
                                </button>
                            </div>
                        ) : status === 'connecting' && messages.length === 0 ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <Loader2 size={48} className="text-indigo-500 animate-spin mb-4" />
                                <p className="text-zinc-600 dark:text-zinc-400">{statusMessage}</p>
                            </div>
                        ) : status === 'error' ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                                    <User2 size={32} className="text-red-500" />
                                </div>
                                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">Connection Error</h3>
                                <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4 text-center max-w-sm">
                                    Failed to start the avatar session.
                                </p>
                                <button
                                    onClick={startSession}
                                    className="px-6 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-medium hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all"
                                >
                                    Try Again
                                </button>
                            </div>
                        ) : (
                            <>
                                {showAvatar && (
                                    <Avatar3D
                                        audioLevel={audioLevel}
                                        isPlaying={status === 'speaking'}
                                        isListening={status === 'listening'}
                                        isThinking={status === 'connecting'}
                                        className="w-full h-full"
                                    />
                                )}

                                {/* Status Overlay */}
                                {status === 'listening' && (
                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-red-500/90 text-white text-sm font-medium flex items-center gap-2">
                                        <Mic size={16} className="animate-pulse" />
                                        Listening...
                                    </div>
                                )}
                                {status === 'speaking' && (
                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-indigo-500/90 text-white text-sm font-medium flex items-center gap-2">
                                        <Volume2 size={16} className="animate-pulse" />
                                        AI is speaking...
                                    </div>
                                )}
                            </>
                        )}
                    </motion.div>

                    {/* Controls */}
                    {(status === 'connected' || status === 'speaking' || status === 'listening') && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="mt-6 flex items-center justify-center gap-4"
                        >
                            <button
                                onMouseDown={startRecording}
                                onMouseUp={stopRecording}
                                onMouseLeave={stopRecording}
                                onTouchStart={startRecording}
                                onTouchEnd={stopRecording}
                                disabled={status === 'speaking'}
                                className={`p-4 rounded-2xl transition-all ${
                                    status === 'listening'
                                        ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
                                        : status === 'speaking'
                                            ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed'
                                            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                                }`}
                                title="Hold to speak"
                            >
                                {status === 'listening' ? <MicOff size={24} /> : <Mic size={24} />}
                            </button>

                            <button
                                onClick={endSession}
                                className="p-4 rounded-2xl bg-red-500 text-white hover:bg-red-600 transition-all"
                                title="End session"
                            >
                                <Phone size={24} className="rotate-[135deg]" />
                            </button>

                            <button
                                onClick={toggleMute}
                                className={`p-4 rounded-2xl transition-all ${
                                    isMuted
                                        ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
                                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                                }`}
                                title={isMuted ? 'Unmute' : 'Mute'}
                            >
                                {isMuted ? <MicOff size={24} /> : <Volume2 size={24} />}
                            </button>
                        </motion.div>
                    )}

                    {/* Instructions */}
                    {status === 'idle' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="mt-8 grid sm:grid-cols-3 gap-4"
                        >
                            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800">
                                <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-3">
                                    <Mic size={20} className="text-indigo-500" />
                                </div>
                                <h3 className="font-medium mb-1 text-zinc-900 dark:text-white">Speak Naturally</h3>
                                <p className="text-sm text-zinc-500 dark:text-zinc-400">Hold the mic and talk - the AI will understand</p>
                            </div>
                            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800">
                                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center mb-3">
                                    <User2 size={20} className="text-purple-500" />
                                </div>
                                <h3 className="font-medium mb-1 text-zinc-900 dark:text-white">3D Avatar</h3>
                                <p className="text-sm text-zinc-500 dark:text-zinc-400">Watch Sara respond with natural lip sync</p>
                            </div>
                            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800">
                                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-3">
                                    <Sparkles size={20} className="text-emerald-500" />
                                </div>
                                <h3 className="font-medium mb-1 text-zinc-900 dark:text-white">AI Feedback</h3>
                                <p className="text-sm text-zinc-500 dark:text-zinc-400">Get corrections and practice conversation</p>
                            </div>
                        </motion.div>
                    )}
                </div>
            </main>
        </div>
    );
}
