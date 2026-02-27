'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Mic, MicOff, Phone, Sparkles, Loader2, ArrowLeft, Video, VideoOff, Volume2 } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { SITE_CONFIG } from '@/lib/constants';
import {
    LiveAvatarSession,
    SessionEvent,
    SessionState,
    AgentEventsEnum,
} from '@heygen/liveavatar-web-sdk';

type PageStatus = 'idle' | 'connecting' | 'connected' | 'speaking' | 'listening' | 'error';

export default function VideoAvatarPage() {
    const [status, setStatus] = useState<PageStatus>('idle');
    const [statusMessage, setStatusMessage] = useState('Click Start to begin');
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isVideoLoading, setIsVideoLoading] = useState(true);

    const videoRef = useRef<HTMLVideoElement>(null);
    const sessionRef = useRef<LiveAvatarSession | null>(null);

    useEffect(() => {
        setIsClient(true);
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (sessionRef.current) {
                sessionRef.current.stop().catch(() => {});
                sessionRef.current = null;
            }
            if (videoRef.current) {
                videoRef.current.srcObject = null;
                videoRef.current.src = '';
            }
        };
    }, []);

    const startSession = async () => {
        setStatus('connecting');
        setStatusMessage('Getting session token...');
        setError(null);
        setIsVideoLoading(true);

        try {
            // Step 1: Get session token from our API
            const tokenRes = await fetch('/api/liveavatar-token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    avatarId: 'dd73ea75-1218-4ef3-92ce-606d5f7fbc0a',
                    voiceId: 'c2527536-6d1f-4412-a643-53a3497dada9',
                }),
            });
            const tokenData = await tokenRes.json();

            if (!tokenRes.ok || tokenData.error) {
                const errorMsg = tokenData.error || 'Failed to get session token';
                throw new Error(`Token Error: ${errorMsg}`);
            }

            // Step 2: Create LiveAvatarSession
            setStatusMessage('Creating avatar session...');

            const session = new LiveAvatarSession(tokenData.token, {
                voiceChat: true,
            });
            sessionRef.current = session;

            // Set up event listeners
            session.on(SessionEvent.SESSION_STATE_CHANGED, (state: SessionState) => {
                if (state === SessionState.CONNECTED) {
                    setStatus('connected');
                    setStatusMessage('Connected! Speak to interact.');
                } else if (state === SessionState.DISCONNECTED) {
                    setStatus('idle');
                    setStatusMessage('Session ended');
                }
            });

            session.on(SessionEvent.SESSION_STREAM_READY, () => {
                if (videoRef.current) {
                    session.attach(videoRef.current);
                    videoRef.current.play()
                        .then(() => setIsVideoLoading(false))
                        .catch(() => {});
                }
            });

            session.on(SessionEvent.SESSION_DISCONNECTED, () => {
                setStatus('idle');
                setStatusMessage('Session ended');
            });

            // Agent events
            session.on(AgentEventsEnum.AVATAR_SPEAK_STARTED, () => {
                setStatus('speaking');
                setStatusMessage('AI is speaking...');
            });

            session.on(AgentEventsEnum.AVATAR_SPEAK_ENDED, () => {
                setStatus('connected');
                setStatusMessage('Ready - speak to interact');
            });

            session.on(AgentEventsEnum.USER_SPEAK_STARTED, () => {
                setStatus('listening');
                setStatusMessage('Listening...');
            });

            session.on(AgentEventsEnum.USER_SPEAK_ENDED, () => {
                setStatus('connected');
                setStatusMessage('Processing...');
            });

            // Step 3: Start the session
            setStatusMessage('Starting avatar...');
            await session.start();

            // Start listening for voice
            session.startListening();

        } catch (err: any) {
            let errorMessage = err.message || 'Failed to start session';
            if (err.message?.includes('402') || err.message?.includes('credits')) {
                errorMessage = 'No credits remaining. Please add credits to your LiveAvatar account.';
            } else if (err.message?.includes('401') || err.message?.includes('unauthorized')) {
                errorMessage = 'Authentication failed: Invalid API key.';
            } else if (err.message?.includes('403') || err.message?.includes('forbidden')) {
                errorMessage = 'Access denied: Check your LiveAvatar permissions.';
            }

            setError(errorMessage);
            setStatus('error');
            setStatusMessage('Connection failed');
        }
    };

    const endSession = useCallback(async () => {
        if (sessionRef.current) {
            try {
                await sessionRef.current.stop();
            } catch {
                // Silent fail
            }
            sessionRef.current = null;
        }

        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }

        setStatus('idle');
        setStatusMessage('Session ended');
        setError(null);
        setIsVideoLoading(true);
    }, []);

    const toggleMute = () => {
        if (sessionRef.current) {
            try {
                if (isMuted) {
                    sessionRef.current.startListening();
                } else {
                    sessionRef.current.stopListening();
                }
                setIsMuted(!isMuted);
            } catch {
                // Silent fail
            }
        }
    };

    const toggleVideo = () => {
        setIsVideoOff(!isVideoOff);
        if (videoRef.current) {
            videoRef.current.style.visibility = isVideoOff ? 'visible' : 'hidden';
        }
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
                        <Link
                            href="/dashboard"
                            className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                        >
                            <ArrowLeft size={20} />
                        </Link>
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
                    {/* Video Container */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative aspect-video rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl"
                    >
                        {status === 'idle' ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mb-6 shadow-lg shadow-cyan-500/30">
                                    <Video size={40} className="text-white" />
                                </div>
                                <h2 className="text-xl font-semibold mb-2 text-zinc-900 dark:text-white">AI Video Teacher</h2>
                                <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6 text-center max-w-sm">
                                    Practice English with an AI-powered video avatar. Speak naturally and get real-time responses.
                                </p>
                                <button
                                    onClick={startSession}
                                    className="px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg shadow-cyan-500/30 flex items-center gap-2"
                                >
                                    <Video size={20} />
                                    Start Video Session
                                </button>
                            </div>
                        ) : status === 'connecting' ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <Loader2 size={48} className="text-cyan-500 animate-spin mb-4" />
                                <p className="text-zinc-600 dark:text-zinc-400">{statusMessage}</p>
                            </div>
                        ) : status === 'error' ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                                    <VideoOff size={32} className="text-red-500" />
                                </div>
                                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">Connection Error</h3>
                                <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4 text-center max-w-sm">
                                    {error || 'Failed to connect to the video avatar service.'}
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
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    playsInline
                                    muted
                                    className="w-full h-full object-cover bg-zinc-900"
                                />

                                {/* Loading overlay while avatar renders */}
                                {isVideoLoading && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-zinc-900">
                                        <div className="text-center">
                                            <Loader2 size={32} className="text-cyan-500 animate-spin mx-auto mb-2" />
                                            <p className="text-sm text-zinc-400">Loading avatar...</p>
                                        </div>
                                    </div>
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
                                onClick={toggleMute}
                                className={`p-4 rounded-2xl transition-all ${
                                    isMuted
                                        ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
                                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                                }`}
                                title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
                            >
                                {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
                            </button>

                            <button
                                onClick={endSession}
                                className="p-4 rounded-2xl bg-red-500 text-white hover:bg-red-600 transition-all"
                                title="End session"
                            >
                                <Phone size={24} className="rotate-[135deg]" />
                            </button>

                            <button
                                onClick={toggleVideo}
                                className={`p-4 rounded-2xl transition-all ${
                                    isVideoOff
                                        ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
                                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                                }`}
                                title={isVideoOff ? 'Show video' : 'Hide video'}
                            >
                                {isVideoOff ? <VideoOff size={24} /> : <Video size={24} />}
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
                                <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center mb-3">
                                    <Mic size={20} className="text-cyan-500" />
                                </div>
                                <h3 className="font-medium mb-1 text-zinc-900 dark:text-white">Speak Naturally</h3>
                                <p className="text-sm text-zinc-500 dark:text-zinc-400">Just talk - the AI will understand and respond</p>
                            </div>
                            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800">
                                <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-3">
                                    <Video size={20} className="text-indigo-500" />
                                </div>
                                <h3 className="font-medium mb-1 text-zinc-900 dark:text-white">Real-time Video</h3>
                                <p className="text-sm text-zinc-500 dark:text-zinc-400">Watch the AI avatar respond with natural expressions</p>
                            </div>
                            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800">
                                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-3">
                                    <Sparkles size={20} className="text-emerald-500" />
                                </div>
                                <h3 className="font-medium mb-1 text-zinc-900 dark:text-white">AI Feedback</h3>
                                <p className="text-sm text-zinc-500 dark:text-zinc-400">Get corrections and practice conversation skills</p>
                            </div>
                        </motion.div>
                    )}
                </div>
            </main>
        </div>
    );
}
