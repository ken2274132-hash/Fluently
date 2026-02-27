'use client';

import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Phone, Sparkles, Loader2, ArrowLeft, Volume2, MessageCircle, Send } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { TOPICS, SITE_CONFIG } from '@/lib/constants';

export default function VoicePage() {
    const [isRecording, setIsRecording] = useState(false);
    const [isThinking, setIsThinking] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
    const [selectedTopic, setSelectedTopic] = useState(TOPICS[0]);
    const [status, setStatus] = useState('Choose a topic to begin');
    const [isClient, setIsClient] = useState(false);
    const [sessionStarted, setSessionStarted] = useState(false);
    const [audioLevel, setAudioLevel] = useState(0);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const animationFrameRef = useRef<number | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setIsClient(true);
        return () => {
            // Quick cleanup - don't block navigation
            try {
                animationFrameRef.current && cancelAnimationFrame(animationFrameRef.current);
                mediaRecorderRef.current?.stream?.getTracks().forEach(track => track.stop());
                audioRef.current?.pause();
                window.speechSynthesis?.cancel();
                audioContextRef.current?.close().catch(() => {});
            } catch (e) {}
        };
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

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
            setIsRecording(true);
            setStatus('Listening...');
            setupVisualizer(stream);
        } catch {
            setStatus('Error accessing microphone');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            setAudioLevel(0);
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        }
    };

    const setupVisualizer = (stream: MediaStream) => {
        const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
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

    const getInitialGreeting = async (topic: typeof TOPICS[0]) => {
        setIsThinking(true);
        setStatus('AI is joining...');
        try {
            const chatRes = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: topic.prompt,
                    history: []
                })
            });
            const { response } = await chatRes.json();
            await playResponse(response);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Unknown error';
            setStatus('Error: ' + message);
        } finally {
            setIsThinking(false);
        }
    };

    const processAudio = async (blob: Blob) => {
        setIsThinking(true);
        setStatus('Transcribing...');

        try {
            const formData = new FormData();
            formData.append('file', blob);
            const sttRes = await fetch('/api/stt', { method: 'POST', body: formData });
            const { text } = await sttRes.json();

            if (!text) throw new Error('Could not understand audio');

            setMessages(prev => [...prev, { role: 'user', content: text }]);
            setStatus('Thinking...');

            const chatRes = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text, history: messages.slice(-10) })
            });
            const { response } = await chatRes.json();

            await playResponse(response);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Something went wrong';
            setStatus('Error: ' + message);
        } finally {
            setIsThinking(false);
        }
    };

    const playResponse = async (text: string) => {
        try {
            setStatus('Speaking...');
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
            audio.onerror = () => speakLocal(text);
            audio.onplay = () => setIsPlaying(true);
            audio.onended = () => {
                setIsPlaying(false);
                setStatus('Ready to listen');
            };

            await audio.play();
        } catch {
            speakLocal(text);
        }
    };

    const speakLocal = (text: string) => {
        if (!('speechSynthesis' in window)) {
            setStatus('Voice error: Not supported');
            return;
        }

        window.speechSynthesis.cancel();

        setMessages(prev => {
            if (prev.length > 0 && prev[prev.length - 1].content === text) return prev;
            return [...prev, { role: 'assistant', content: text }];
        });

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onstart = () => {
            setIsPlaying(true);
            setStatus('Speaking (Browser Voice)');
        };
        utterance.onend = () => {
            setIsPlaying(false);
            setStatus('Ready to listen');
        };
        utterance.onerror = () => {
            setStatus('Voice Error');
            setIsPlaying(false);
        };

        const setVoice = () => {
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
        };

        if (window.speechSynthesis.getVoices().length > 0) {
            setVoice();
        } else {
            window.speechSynthesis.onvoiceschanged = setVoice;
        }
    };

    const handleStartSession = () => {
        setSessionStarted(true);
        getInitialGreeting(selectedTopic);
    };

    const endSession = () => {
        setSessionStarted(false);
        setMessages([]);
        setStatus('Choose a topic to begin');
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }
        window.speechSynthesis.cancel();
    };

    if (!isClient) return null;

    const getOrbScale = () => {
        if (isRecording) return 1 + audioLevel * 0.3;
        if (isPlaying) return 1.05;
        return 1;
    };

    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-[#09090b]">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800/50">
                <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/dashboard"
                            className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                        >
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <h1 className="font-semibold text-zinc-900 dark:text-white">{SITE_CONFIG.name}</h1>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">{status}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="badge">
                            <div className={`w-2 h-2 rounded-full transition-all ${
                                isRecording ? 'bg-red-500 animate-pulse' :
                                isThinking ? 'bg-amber-500 animate-pulse' :
                                isPlaying ? 'bg-emerald-500' :
                                'bg-zinc-400 dark:bg-zinc-500'
                            }`} />
                            <span className="text-xs">
                                {isRecording ? 'Listening' : isThinking ? 'Processing' : isPlaying ? 'Speaking' : 'Ready'}
                            </span>
                        </div>

                        {sessionStarted && (
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
                <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row gap-8 h-full">
                    {/* Left: Voice Orb Section */}
                    <div className="flex-1 flex flex-col items-center justify-center min-h-[500px]">
                        {/* Voice Orb */}
                        <motion.div
                            className="relative cursor-pointer select-none touch-manipulation"
                            style={{ WebkitTouchCallout: 'none', WebkitUserSelect: 'none' }}
                            onMouseDown={sessionStarted ? startRecording : undefined}
                            onMouseUp={sessionStarted ? stopRecording : undefined}
                            onMouseLeave={sessionStarted ? stopRecording : undefined}
                            onTouchStart={sessionStarted ? startRecording : undefined}
                            onTouchEnd={sessionStarted ? stopRecording : undefined}
                            whileHover={{ scale: sessionStarted ? 1.02 : 1 }}
                            whileTap={{ scale: sessionStarted ? 0.98 : 1 }}
                        >
                            {/* Ripple Effects */}
                            <AnimatePresence>
                                {isRecording && (
                                    <>
                                        <motion.div
                                            initial={{ scale: 1, opacity: 0.5 }}
                                            animate={{ scale: 2, opacity: 0 }}
                                            transition={{ duration: 1.5, repeat: Infinity }}
                                            className="absolute inset-0 rounded-full border-2 border-indigo-500/30"
                                        />
                                        <motion.div
                                            initial={{ scale: 1, opacity: 0.5 }}
                                            animate={{ scale: 2, opacity: 0 }}
                                            transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                                            className="absolute inset-0 rounded-full border-2 border-indigo-500/30"
                                        />
                                    </>
                                )}
                            </AnimatePresence>

                            {/* Main Orb */}
                            <motion.div
                                className={`relative w-48 h-48 md:w-56 md:h-56 rounded-full flex items-center justify-center transition-all duration-300 ${
                                    isRecording
                                        ? 'bg-gradient-to-br from-indigo-500 to-purple-600 shadow-[0_0_60px_rgba(99,102,241,0.4)]'
                                        : isThinking
                                            ? 'bg-zinc-100 dark:bg-zinc-800 border-2 border-amber-500/50 shadow-[0_0_40px_rgba(245,158,11,0.2)]'
                                            : isPlaying
                                                ? 'bg-zinc-100 dark:bg-zinc-800 border-2 border-emerald-500/50 shadow-[0_0_40px_rgba(16,185,129,0.2)]'
                                                : 'bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:border-indigo-500/50 hover:shadow-[0_0_40px_rgba(99,102,241,0.15)]'
                                }`}
                                animate={{ scale: getOrbScale() }}
                                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            >
                                <div className="flex flex-col items-center">
                                    {isRecording ? (
                                        <MicOff size={40} className="text-white" />
                                    ) : isThinking ? (
                                        <Loader2 size={40} className="animate-spin text-amber-500" />
                                    ) : isPlaying ? (
                                        <Volume2 size={40} className="text-emerald-500 animate-pulse" />
                                    ) : (
                                        <Mic size={40} className={sessionStarted ? 'text-zinc-500 dark:text-zinc-400' : 'text-zinc-400 dark:text-zinc-600'} />
                                    )}
                                    <span className={`mt-3 text-xs font-medium select-none ${
                                        isRecording ? 'text-white/80' : 'text-zinc-500 dark:text-zinc-400'
                                    }`}>
                                        {!sessionStarted ? 'Start session first' : isRecording ? 'Release to send' : 'Hold to speak'}
                                    </span>
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* Topic Selection */}
                        <AnimatePresence mode="wait">
                            {!sessionStarted ? (
                                <motion.div
                                    key="topics"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="mt-12 w-full max-w-md"
                                >
                                    <div className="text-center mb-6">
                                        <h2 className="text-xl font-semibold mb-2 text-zinc-900 dark:text-white">Choose Your Topic</h2>
                                        <p className="text-sm text-zinc-500 dark:text-zinc-400">Select a conversation scenario to begin</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 mb-6">
                                        {TOPICS.map(topic => (
                                            <button
                                                key={topic.id}
                                                onClick={() => setSelectedTopic(topic)}
                                                className={`p-4 rounded-xl text-left transition-all ${
                                                    selectedTopic.id === topic.id
                                                        ? 'bg-indigo-500/10 border-2 border-indigo-500/50'
                                                        : 'bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                                                }`}
                                            >
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className={selectedTopic.id === topic.id ? 'text-indigo-500' : 'text-zinc-500 dark:text-zinc-400'}>
                                                        {topic.icon}
                                                    </span>
                                                    <span className={`text-sm font-medium ${
                                                        selectedTopic.id === topic.id ? 'text-indigo-500' : 'text-zinc-900 dark:text-white'
                                                    }`}>
                                                        {topic.label}
                                                    </span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>

                                    <button
                                        onClick={handleStartSession}
                                        className="btn-primary w-full justify-center py-4"
                                    >
                                        <span>Start Voice Session</span>
                                        <Send size={18} />
                                    </button>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="session-info"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="mt-12 text-center"
                                >
                                    <div className="badge badge-accent mb-4">
                                        <MessageCircle size={12} />
                                        {selectedTopic.label}
                                    </div>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xs mx-auto">
                                        Hold the orb and speak. Release when you&apos;re done to send your message.
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Right: Conversation Log */}
                    <div className="w-full lg:w-96 rounded-2xl bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/50 flex flex-col overflow-hidden h-[600px] lg:sticky lg:top-24 shadow-sm">
                        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800/50 flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-zinc-900 dark:text-white">Conversation</h3>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400">{messages.length} messages</p>
                            </div>
                            <div className="badge">
                                <Sparkles size={12} />
                                Live
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.length === 0 && (
                                <div className="h-full flex flex-col items-center justify-center text-center">
                                    <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
                                        <Sparkles size={24} className="text-zinc-400 dark:text-zinc-600" />
                                    </div>
                                    <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-1">No messages yet</p>
                                    <p className="text-xs text-zinc-400 dark:text-zinc-600 max-w-[200px]">
                                        {sessionStarted
                                            ? 'Hold the orb and start speaking'
                                            : 'Start a session to begin'}
                                    </p>
                                </div>
                            )}

                            <AnimatePresence>
                                {messages.map((m, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
                                    >
                                        <span className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400 mb-1.5 uppercase tracking-wide">
                                            {m.role === 'user' ? 'You' : 'AI Teacher'}
                                        </span>
                                        <div className={m.role === 'user' ? 'message-user' : 'message-ai'}>
                                            {m.content}
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            <div ref={messagesEndRef} />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
