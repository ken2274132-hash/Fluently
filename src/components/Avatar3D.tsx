'use client';

import { useRef, useEffect, useState, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// Local avatar file for fast loading
const AVATAR_URL = '/avatar.glb';

interface AvatarModelProps {
    audioLevel: number;
    isPlaying: boolean;
    isListening: boolean;
    isThinking: boolean;
}

function AvatarModel({ audioLevel, isPlaying, isListening, isThinking }: AvatarModelProps) {
    const group = useRef<THREE.Group>(null);
    const { scene } = useGLTF(AVATAR_URL);

    const clonedScene = useMemo(() => scene.clone(), [scene]);
    const headMesh = useRef<THREE.SkinnedMesh | null>(null);
    const headBone = useRef<THREE.Bone | null>(null);
    const neckBone = useRef<THREE.Bone | null>(null);
    const spineBone = useRef<THREE.Bone | null>(null);
    const leftArmBone = useRef<THREE.Bone | null>(null);
    const rightArmBone = useRef<THREE.Bone | null>(null);

    // Store initial rotations
    const initialRotations = useRef<{
        head?: THREE.Euler;
        neck?: THREE.Euler;
        spine?: THREE.Euler;
        leftArm?: THREE.Euler;
        rightArm?: THREE.Euler;
    }>({});

    useEffect(() => {
        clonedScene.traverse((child) => {
            // Find mesh with morph targets
            if (child instanceof THREE.SkinnedMesh && child.morphTargetDictionary) {
                headMesh.current = child;
            }

            // Find bones
            if (child instanceof THREE.Bone) {
                const name = child.name.toLowerCase();

                if (name === 'head' || (name.includes('head') && !name.includes('top') && !name.includes('end'))) {
                    headBone.current = child;
                    initialRotations.current.head = child.rotation.clone();
                }
                if (name === 'neck' || name.includes('neck')) {
                    neckBone.current = child;
                    initialRotations.current.neck = child.rotation.clone();
                }
                if (name.includes('spine') && !spineBone.current) {
                    spineBone.current = child;
                    initialRotations.current.spine = child.rotation.clone();
                }
                if (name === 'leftshoulder') {
                    leftArmBone.current = child;
                    initialRotations.current.leftArm = child.rotation.clone();
                }
                if (name === 'rightshoulder') {
                    rightArmBone.current = child;
                    initialRotations.current.rightArm = child.rotation.clone();
                }
            }
        });
    }, [clonedScene]);

    useFrame((state) => {
        const time = state.clock.elapsedTime;

        // ========== MORPH TARGET ANIMATIONS ==========
        if (headMesh.current?.morphTargetDictionary && headMesh.current?.morphTargetInfluences) {
            const morphTargets = headMesh.current.morphTargetDictionary;
            const influences = headMesh.current.morphTargetInfluences;

            // ----- LIP SYNC (natural, not too wide) -----
            const visemeAaIndex = morphTargets['viseme_aa'];
            const jawOpenIndex = morphTargets['jawOpen'];
            const mouthFunnelIndex = morphTargets['mouthFunnel'];
            const mouthPuckerIndex = morphTargets['mouthPucker'];

            if (isPlaying && audioLevel > 0) {
                const mouthOpenAmount = Math.min(audioLevel * 1.5, 0.5); // Max 50% open
                const variation = Math.sin(time * 12) * 0.3 + 0.5;
                const variation2 = Math.cos(time * 10) * 0.2 + 0.5;

                // Natural mouth movement
                if (visemeAaIndex !== undefined) {
                    influences[visemeAaIndex] = mouthOpenAmount * variation * 0.6;
                }
                if (jawOpenIndex !== undefined) {
                    influences[jawOpenIndex] = mouthOpenAmount * variation * 0.4;
                }
                if (mouthFunnelIndex !== undefined) {
                    influences[mouthFunnelIndex] = mouthOpenAmount * variation2 * 0.3;
                }
                if (mouthPuckerIndex !== undefined) {
                    influences[mouthPuckerIndex] = mouthOpenAmount * (1 - variation) * 0.2;
                }
            } else {
                // Smooth return to neutral
                if (visemeAaIndex !== undefined) influences[visemeAaIndex] *= 0.85;
                if (jawOpenIndex !== undefined) influences[jawOpenIndex] *= 0.85;
                if (mouthFunnelIndex !== undefined) influences[mouthFunnelIndex] *= 0.85;
                if (mouthPuckerIndex !== undefined) influences[mouthPuckerIndex] *= 0.85;
            }

            // ----- EYE BLINKING (both eyes) -----
            const blinkLeftIndex = morphTargets['eyeBlinkLeft'] ?? morphTargets['eyeBlink_L'];
            const blinkRightIndex = morphTargets['eyeBlinkRight'] ?? morphTargets['eyeBlink_R'];

            const blinkCycle = time % 4;
            const blinkValue = blinkCycle < 0.12 ? Math.sin(blinkCycle * Math.PI / 0.12) : 0;

            if (blinkLeftIndex !== undefined) influences[blinkLeftIndex] = blinkValue;
            if (blinkRightIndex !== undefined) influences[blinkRightIndex] = blinkValue;

            // ----- EYE MOVEMENT (looking around) -----
            const eyeLookLeftIndex = morphTargets['eyeLookOutLeft'];
            const eyeLookRightIndex = morphTargets['eyeLookOutRight'];
            const eyeLookUpLeftIndex = morphTargets['eyeLookUpLeft'];
            const eyeLookUpRightIndex = morphTargets['eyeLookUpRight'];
            const eyeLookDownLeftIndex = morphTargets['eyeLookDownLeft'];
            const eyeLookDownRightIndex = morphTargets['eyeLookDownRight'];

            const eyeX = Math.sin(time * 0.4) * 0.2;
            const eyeY = Math.sin(time * 0.5) * 0.15;

            // Horizontal eye movement
            if (eyeX > 0) {
                if (eyeLookRightIndex !== undefined) influences[eyeLookRightIndex] = eyeX;
                if (eyeLookLeftIndex !== undefined) influences[eyeLookLeftIndex] = 0;
            } else {
                if (eyeLookLeftIndex !== undefined) influences[eyeLookLeftIndex] = -eyeX;
                if (eyeLookRightIndex !== undefined) influences[eyeLookRightIndex] = 0;
            }

            // Vertical eye movement
            if (eyeY > 0) {
                if (eyeLookUpLeftIndex !== undefined) influences[eyeLookUpLeftIndex] = eyeY;
                if (eyeLookUpRightIndex !== undefined) influences[eyeLookUpRightIndex] = eyeY;
                if (eyeLookDownLeftIndex !== undefined) influences[eyeLookDownLeftIndex] = 0;
                if (eyeLookDownRightIndex !== undefined) influences[eyeLookDownRightIndex] = 0;
            } else {
                if (eyeLookDownLeftIndex !== undefined) influences[eyeLookDownLeftIndex] = -eyeY;
                if (eyeLookDownRightIndex !== undefined) influences[eyeLookDownRightIndex] = -eyeY;
                if (eyeLookUpLeftIndex !== undefined) influences[eyeLookUpLeftIndex] = 0;
                if (eyeLookUpRightIndex !== undefined) influences[eyeLookUpRightIndex] = 0;
            }

            // ----- EYEBROW EXPRESSIONS -----
            const browInnerUpIndex = morphTargets['browInnerUp'];
            const browDownLeftIndex = morphTargets['browDownLeft'];
            const browDownRightIndex = morphTargets['browDownRight'];

            if (isThinking) {
                // Raised eyebrows when thinking
                if (browInnerUpIndex !== undefined) {
                    influences[browInnerUpIndex] = 0.4 + Math.sin(time * 2) * 0.1;
                }
            } else if (isListening) {
                // Slightly raised, attentive
                if (browInnerUpIndex !== undefined) {
                    influences[browInnerUpIndex] = 0.2;
                }
            } else {
                if (browInnerUpIndex !== undefined) influences[browInnerUpIndex] *= 0.9;
            }

            // ----- SUBTLE SMILE -----
            const smileLeftIndex = morphTargets['mouthSmileLeft'];
            const smileRightIndex = morphTargets['mouthSmileRight'];

            const subtleSmile = 0.12 + Math.sin(time * 0.5) * 0.03;
            if (smileLeftIndex !== undefined) influences[smileLeftIndex] = subtleSmile;
            if (smileRightIndex !== undefined) influences[smileRightIndex] = subtleSmile;
        }

        // ========== BONE ANIMATIONS ==========

        // ----- HEAD MOVEMENT -----
        if (headBone.current && initialRotations.current.head) {
            const baseRot = initialRotations.current.head;

            if (isPlaying) {
                // More visible nodding while speaking
                headBone.current.rotation.x = baseRot.x + Math.sin(time * 3) * 0.08;
                headBone.current.rotation.y = baseRot.y + Math.sin(time * 1.5) * 0.1;
                headBone.current.rotation.z = baseRot.z + Math.sin(time * 2) * 0.05;
            } else if (isListening) {
                // Attentive tilt
                headBone.current.rotation.x = baseRot.x + Math.sin(time * 0.8) * 0.04;
                headBone.current.rotation.z = baseRot.z + 0.08;
            } else if (isThinking) {
                // Looking up and to the side
                headBone.current.rotation.x = baseRot.x - 0.12;
                headBone.current.rotation.y = baseRot.y + Math.sin(time * 0.5) * 0.12;
            } else {
                // Idle - gentle sway (more visible)
                headBone.current.rotation.x = baseRot.x + Math.sin(time * 0.4) * 0.04;
                headBone.current.rotation.y = baseRot.y + Math.sin(time * 0.3) * 0.05;
                headBone.current.rotation.z = baseRot.z + Math.sin(time * 0.25) * 0.03;
            }
        }

        // ----- NECK ANIMATION -----
        if (neckBone.current && initialRotations.current.neck) {
            const baseRot = initialRotations.current.neck;
            neckBone.current.rotation.x = baseRot.x + Math.sin(time * 0.5) * 0.015;
            neckBone.current.rotation.y = baseRot.y + Math.sin(time * 0.35) * 0.01;
        }

        // ----- SPINE/BREATHING ANIMATION -----
        if (spineBone.current && initialRotations.current.spine) {
            const baseRot = initialRotations.current.spine;
            // Breathing motion
            spineBone.current.rotation.x = baseRot.x + Math.sin(time * 0.8) * 0.012;
        }

        // ----- SHOULDER - subtle arm gestures (avatar already in A-pose) -----
        if (leftArmBone.current && initialRotations.current.leftArm) {
            const baseRot = initialRotations.current.leftArm;

            if (isPlaying) {
                // Subtle gesture while speaking
                leftArmBone.current.rotation.z = baseRot.z + Math.sin(time * 2.5) * 0.08;
                leftArmBone.current.rotation.x = baseRot.x + Math.sin(time * 2) * 0.04;
            } else {
                // Subtle idle movement
                leftArmBone.current.rotation.z = baseRot.z + Math.sin(time * 0.5) * 0.02;
                leftArmBone.current.rotation.x = baseRot.x;
            }
        }

        if (rightArmBone.current && initialRotations.current.rightArm) {
            const baseRot = initialRotations.current.rightArm;

            if (isPlaying) {
                // Subtle gesture while speaking
                rightArmBone.current.rotation.z = baseRot.z - Math.sin(time * 2.5 + 1) * 0.08;
                rightArmBone.current.rotation.x = baseRot.x + Math.sin(time * 2 + 0.5) * 0.04;
            } else {
                // Subtle idle movement
                rightArmBone.current.rotation.z = baseRot.z - Math.sin(time * 0.5) * 0.02;
                rightArmBone.current.rotation.x = baseRot.x;
            }
        }

        // ----- OVERALL BODY SWAY -----
        if (group.current) {
            group.current.position.y = Math.sin(time * 0.6) * 0.004;
        }
    });

    return (
        <group ref={group} position={[0, 0, 0]} scale={1}>
            <primitive object={clonedScene} />
        </group>
    );
}

function LoadingFallback() {
    return (
        <mesh>
            <sphereGeometry args={[0.3, 32, 32]} />
            <meshStandardMaterial color="#6366f1" wireframe />
        </mesh>
    );
}

interface Avatar3DProps {
    audioLevel?: number;
    isPlaying?: boolean;
    isListening?: boolean;
    isThinking?: boolean;
    className?: string;
}

export default function Avatar3D({
    audioLevel = 0,
    isPlaying = false,
    isListening = false,
    isThinking = false,
    className = ''
}: Avatar3DProps) {
    const [hasError, setHasError] = useState(false);

    if (hasError) {
        return (
            <div className={`flex flex-col items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-zinc-800 dark:to-zinc-900 rounded-2xl ${className}`}>
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-4">
                    <span className="text-4xl">👩‍🏫</span>
                </div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Sara - AI Teacher</p>
            </div>
        );
    }

    return (
        <div className={`relative overflow-hidden rounded-2xl ${className}`}>
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-zinc-800 dark:via-zinc-850 dark:to-zinc-900" />

            {/* Status indicator */}
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-white/90 dark:bg-zinc-800/90 backdrop-blur px-3 py-1.5 rounded-full shadow-lg">
                <div className={`w-2 h-2 rounded-full ${
                    isPlaying ? 'bg-emerald-500 animate-pulse' :
                    isListening ? 'bg-red-500 animate-pulse' :
                    isThinking ? 'bg-amber-500 animate-pulse' :
                    'bg-zinc-400'
                }`} />
                <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                    {isPlaying ? 'Speaking' : isListening ? 'Listening' : isThinking ? 'Thinking' : 'Ready'}
                </span>
            </div>

            {/* Name badge */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 bg-white/90 dark:bg-zinc-800/90 backdrop-blur px-4 py-2 rounded-full shadow-lg">
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Sara - English Teacher</span>
            </div>

            <Canvas
                camera={{ position: [0, 1.55, 1.3], fov: 28 }}
                style={{ background: 'transparent' }}
                onError={() => setHasError(true)}
            >
                <ambientLight intensity={0.7} />
                <directionalLight position={[5, 5, 5]} intensity={1} />
                <directionalLight position={[-3, 3, 2]} intensity={0.5} />
                <pointLight position={[0, 2, 1]} intensity={0.3} />

                <Suspense fallback={<LoadingFallback />}>
                    <AvatarModel
                        audioLevel={audioLevel}
                        isPlaying={isPlaying}
                        isListening={isListening}
                        isThinking={isThinking}
                    />
                </Suspense>

                <OrbitControls
                    target={[0, 1.5, 0]}
                    enableZoom={false}
                    enablePan={false}
                    minPolarAngle={Math.PI / 2.2}
                    maxPolarAngle={Math.PI / 2}
                    minAzimuthAngle={-Math.PI / 12}
                    maxAzimuthAngle={Math.PI / 12}
                />
            </Canvas>
        </div>
    );
}

if (typeof window !== 'undefined') {
    useGLTF.preload(AVATAR_URL);
}
