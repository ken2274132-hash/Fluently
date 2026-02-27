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
    const [transcription, setTranscription] = useState<{ text: string, type: 'ai' | 'user' } | null>(null);

    const videoRef = useRef<HTMLVideoElement>(null);
    const sessionRef = useRef<LiveAvatarSession | null>(null);
    const heartbeatRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        setIsClient(true);
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (sessionRef.current) {
                sessionRef.current.stop().catch(() => { });
                sessionRef.current = null;
            }
            if (videoRef.current) {
                videoRef.current.srcObject = null;
                videoRef.current.src = '';
            }
        };
    }, []);

    const startSession = async () => {
        if (status === 'connecting' || status === 'connected' || sessionRef.current) return;

        setStatus('connecting');
        setStatusMessage('Getting session token...');
        setError(null);
        setIsVideoLoading(true);

        try {
            setStatusMessage('Connecting to Avatar API...');
            const tokenRes = await fetch('/api/liveavatar-token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    is_sandbox: true,
                }),
            });

            console.log("Token Response Status:", tokenRes.status);
            const tokenData = await tokenRes.json();

            if (!tokenRes.ok || tokenData.error) {
                const errorMsg = tokenData.error || 'Failed to get session token';
                throw new Error(`Token Error: ${errorMsg}`);
            }

            setStatusMessage('Session Token Received. Initializing SDK...');
            console.log("Token Data received, creating session...");

            const session = new LiveAvatarSession(tokenData.token, {
                voiceChat: true,
            });
            sessionRef.current = session;

            session.on(SessionEvent.SESSION_STATE_CHANGED, (state: SessionState) => {
                console.log("Session state changed:", state);
                if (state === SessionState.CONNECTED) {
                    setStatus('connected');
                    setStatusMessage('Connected! Speak to interact.');
                } else if (state === SessionState.DISCONNECTED) {
                    setStatus('idle');
                    setStatusMessage('Session ended');
                }
            });

            session.on(SessionEvent.SESSION_STREAM_READY, () => {
                console.log("Session event: STREAM READY");
                if (videoRef.current) {
                    console.log("Attaching stream to video element");
                    session.attach(videoRef.current);

                    // DO NOT call play() here, let the user click the "Play Avatar" button
                    // to ensure audio is unblocked by browser
                    setIsVideoLoading(true);
                    setStatusMessage('Avatar Ready - Click Play to Start Audio');
                } else {
                    console.error("Video ref is null during stream ready");
                }
            });

            session.on(SessionEvent.SESSION_DISCONNECTED, (reason: any) => {
                console.log("Session event: DISCONNECTED, reason:", reason);

                // Cleanup current session resources
                if (heartbeatRef.current) {
                    clearInterval(heartbeatRef.current);
                    heartbeatRef.current = null;
                }
                sessionRef.current = null;

                // Unlimited Mode: Auto-restart if sandbox timeout or generic disconnect occurs
                const autoRestartReasons = ['CLIENT_INITIATED', 'UNKNOWN_REASON', 'SERVER_ERROR', 'NETWORK_ERROR'];
                if (autoRestartReasons.includes(reason) || !reason) {
                    console.log("Connection lost - auto-restarting for unlimited use...");
                    setStatus('connecting');
                    setStatusMessage('Connection lost. Reconnecting automatically...');
                    setTimeout(() => {
                        startSession();
                    }, 1500);
                    return;
                }

                setStatus('idle');
                if (reason === 'SESSION_START_FAILED') {
                    setError('Account Error: You have no credits remaining. Please add credits at HeyGen.');
                } else {
                    setTranscription(null);
                    setStatusMessage(`Session ended. ${reason || 'Unknown error'}`);
                }
            });

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

            session.on(AgentEventsEnum.AVATAR_TRANSCRIPTION, (event) => {
                console.log("AI Said:", event.text);
                setTranscription({ text: event.text, type: 'ai' });
            });

            session.on(AgentEventsEnum.USER_TRANSCRIPTION, (event) => {
                console.log("You Said:", event.text);
                setTranscription({ text: event.text, type: 'user' });
            });

            await session.start();
            console.log("Session started successfully");

            // Start heartbeat to prevent "CLIENT_INITIATED" disconnections/timeouts
            heartbeatRef.current = setInterval(() => {
                if (sessionRef.current && sessionRef.current.state === SessionState.CONNECTED) {
                    console.log("Sending heartbeat ping...");
                    sessionRef.current.keepAlive().catch((err) => {
                        console.warn("Heartbeat failed, session may be closed:", err.message);
                        if (heartbeatRef.current) {
                            clearInterval(heartbeatRef.current);
                            heartbeatRef.current = null;
                        }
                    });
                } else if (heartbeatRef.current) {
                    clearInterval(heartbeatRef.current);
                    heartbeatRef.current = null;
                }
            }, 10000);

            session.startListening();
            console.log("Started listening for voice");

        } catch (err: any) {
            console.error("Session Start Error:", err);
            let errorMessage = err.message || 'Failed to start session';
            if (err.message?.includes('402') || err.message?.includes('credits')) {
                errorMessage = 'No credits remaining. Please add credits to your LiveAvatar account.';
            } else if (err.message?.includes('401') || err.message?.includes('unauthorized')) {
                errorMessage = 'Authentication failed: Invalid API key.';
            }

            setError(errorMessage);
            setStatus('error');
            setStatusMessage('Connection failed: ' + errorMessage);
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
            <main className="flex-1 pt-20 sm:pt-24 pb-6 sm:pb-12">
                <div className="max-w-4xl mx-auto px-3 sm:px-6">
                    {/* Video Container */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative aspect-[3/4] sm:aspect-video rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl"
                    >
                        {status === 'idle' ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                                <div className="w-16 sm:w-24 h-16 sm:h-24 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mb-4 sm:mb-6 shadow-lg shadow-cyan-500/30">
                                    <Video size={28} className="sm:w-10 sm:h-10 text-white" />
                                </div>
                                <h2 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2 text-zinc-900 dark:text-white">AI Video Teacher</h2>
                                <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mb-4 sm:mb-6 text-center max-w-sm px-4">
                                    Practice English with AI-powered video avatar
                                </p>
                                <button
                                    onClick={startSession}
                                    className="px-6 sm:px-8 py-3 sm:py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm sm:text-base font-medium hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg shadow-cyan-500/30 flex items-center gap-2"
                                >
                                    <Video size={18} className="sm:w-5 sm:h-5" />
                                    Start Video Session
                                </button>
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
                                    playsInline
                                    onPlaying={() => {
                                        console.log("Video started moving - hiding overlay");
                                        setIsVideoLoading(false);
                                        setStatusMessage('Session Active');
                                    }}
                                    className="w-full h-full object-cover bg-zinc-900"
                                />

                                {status === 'connecting' && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900/80 backdrop-blur-sm z-30">
                                        <Loader2 size={48} className="text-cyan-500 animate-spin mb-4" />
                                        <p className="text-white font-medium">{statusMessage}</p>
                                    </div>
                                )}

                                {isVideoLoading && status === 'connected' && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-zinc-900/50 backdrop-blur-sm z-20">
                                        <div className="text-center">
                                            <p className="text-white mb-4">Click to force play if video doesn't start</p>
                                            <button
                                                onClick={() => {
                                                    if (videoRef.current && sessionRef.current) {
                                                        console.log("Manual play triggered - re-attaching stream");
                                                        // Safety re-attach
                                                        sessionRef.current.attach(videoRef.current);
                                                        videoRef.current.muted = false;
                                                        videoRef.current.play()
                                                            .then(() => {
                                                                setIsVideoLoading(false);
                                                                setStatusMessage('Session Active');
                                                            })
                                                            .catch(console.error);
                                                    }
                                                }}
                                                className="px-6 py-2 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 transition-all font-medium"
                                            >
                                                Play Avatar
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Loading overlay while avatar renders */}
                                {isVideoLoading && status !== 'connected' && (
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

                                {/* Floating Transcriptions */}
                                {transcription && (status === 'speaking' || status === 'listening' || status === 'connected') && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`absolute bottom-16 sm:bottom-20 left-4 right-4 p-4 rounded-2xl backdrop-blur-md border ${transcription.type === 'ai'
                                            ? 'bg-indigo-500/20 border-indigo-500/30'
                                            : 'bg-emerald-500/20 border-emerald-500/30'
                                            } z-30`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className={`p-1.5 rounded-lg ${transcription.type === 'ai' ? 'bg-indigo-500' : 'bg-emerald-500'
                                                }`}>
                                                {transcription.type === 'ai' ? <Volume2 size={14} className="text-white" /> : <Mic size={14} className="text-white" />}
                                            </div>
                                            <p className="text-sm sm:text-base text-white/90 font-medium">
                                                {transcription.text}
                                            </p>
                                        </div>
                                    </motion.div>
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
                            className="mt-4 sm:mt-6 flex items-center justify-center gap-3 sm:gap-4"
                        >
                            <button
                                onClick={toggleMute}
                                className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl transition-all ${isMuted
                                    ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
                                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                                    }`}
                                title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
                            >
                                {isMuted ? <MicOff size={20} className="sm:w-6 sm:h-6" /> : <Mic size={20} className="sm:w-6 sm:h-6" />}
                            </button>

                            <button
                                onClick={endSession}
                                className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-red-500 text-white hover:bg-red-600 transition-all"
                                title="End session"
                            >
                                <Phone size={20} className="sm:w-6 sm:h-6 rotate-[135deg]" />
                            </button>

                            <button
                                onClick={toggleVideo}
                                className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl transition-all ${isVideoOff
                                    ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
                                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                                    }`}
                                title={isVideoOff ? 'Show video' : 'Hide video'}
                            >
                                {isVideoOff ? <VideoOff size={20} className="sm:w-6 sm:h-6" /> : <Video size={20} className="sm:w-6 sm:h-6" />}
                            </button>
                        </motion.div>
                    )}

                    {/* Instructions */}
                    {status === 'idle' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="mt-4 sm:mt-8 grid grid-cols-3 gap-2 sm:gap-4"
                        >
                            <div className="p-2.5 sm:p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800">
                                <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center mb-2 sm:mb-3">
                                    <Mic size={16} className="sm:w-5 sm:h-5 text-cyan-500" />
                                </div>
                                <h3 className="font-medium text-xs sm:text-base mb-0.5 sm:mb-1 text-zinc-900 dark:text-white">Speak</h3>
                                <p className="text-[10px] sm:text-sm text-zinc-500 dark:text-zinc-400 hidden sm:block">AI will understand you</p>
                            </div>
                            <div className="p-2.5 sm:p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800">
                                <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-2 sm:mb-3">
                                    <Video size={16} className="sm:w-5 sm:h-5 text-indigo-500" />
                                </div>
                                <h3 className="font-medium text-xs sm:text-base mb-0.5 sm:mb-1 text-zinc-900 dark:text-white">Video</h3>
                                <p className="text-[10px] sm:text-sm text-zinc-500 dark:text-zinc-400 hidden sm:block">Real-time avatar</p>
                            </div>
                            <div className="p-2.5 sm:p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800">
                                <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-2 sm:mb-3">
                                    <Sparkles size={16} className="sm:w-5 sm:h-5 text-emerald-500" />
                                </div>
                                <h3 className="font-medium text-xs sm:text-base mb-0.5 sm:mb-1 text-zinc-900 dark:text-white">Feedback</h3>
                                <p className="text-[10px] sm:text-sm text-zinc-500 dark:text-zinc-400 hidden sm:block">Get corrections</p>
                            </div>
                        </motion.div>
                    )}
                </div>
            </main>
        </div>
    );
}
