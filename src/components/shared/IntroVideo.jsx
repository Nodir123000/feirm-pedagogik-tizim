import React, { useEffect, useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { ChevronRight, Volume2, VolumeX, Play } from 'lucide-react';

export default function IntroVideo() {
    const [isVisible, setIsVisible] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [showStartButton, setShowStartButton] = useState(false);
    const videoRef = useRef(null);

    useEffect(() => {
        // Check if we've already shown the intro in this session
        const hasPlayed = sessionStorage.getItem("introPlayed");

        // Only show if not played
        if (!hasPlayed) {
            setIsVisible(true);
        }
    }, []);

    useEffect(() => {
        if (isVisible && videoRef.current) {
            // Attempt to play automatically
            const playPromise = videoRef.current.play();

            if (playPromise !== undefined) {
                playPromise.catch(() => {
                    // Autoplay was prevented (likely due to unmuted)
                    // Show a start button to require user interaction
                    setShowStartButton(true);
                });
            }
        }
    }, [isVisible]);

    const handleStart = () => {
        if (videoRef.current) {
            videoRef.current.muted = false;
            videoRef.current.play();
            setShowStartButton(false);
            setIsMuted(false);
        }
    };

    const handleComplete = () => {
        setIsVisible(false);
        sessionStorage.setItem("introPlayed", "true");
    };

    const toggleMute = (e) => {
        e.stopPropagation();
        if (videoRef.current) {
            videoRef.current.muted = !videoRef.current.muted;
            setIsMuted(!isMuted);
        }
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center animate-in fade-in duration-500">
            <video
                ref={videoRef}
                muted={isMuted}
                playsInline
                className="w-full h-full object-cover"
                onEnded={handleComplete}
                onClick={handleComplete}
            >
                <source src="/welcome_video.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            {/* Start Button Overlay (if autoplay blocked) */}
            {showStartButton && (
                <div
                    className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-[10001] cursor-pointer"
                    onClick={handleComplete}
                >
                    <div className="text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="flex flex-col gap-4">
                            <Button
                                size="lg"
                                className="text-lg px-8 py-6 rounded-full bg-white text-black hover:bg-gray-200 transition-transform hover:scale-105"
                                onClick={handleStart}
                            >
                                <Play className="mr-2 h-5 w-5 fill-current" />
                                Смотреть вступление
                            </Button>

                            <Button
                                variant="ghost"
                                className="text-white/70 hover:text-white hover:bg-white/10"
                                onClick={handleComplete}
                            >
                                Пропустить и войти
                            </Button>
                        </div>
                        <p className="mt-4 text-white/50 text-sm">Нажмите для запуска со звуком</p>
                    </div>
                </div>
            )}

            {/* Controls Container */}
            {!showStartButton && (
                <div className="absolute bottom-8 right-8 z-[10000] flex gap-4 items-center">
                    {/* Mute Toggle */}
                    <Button
                        variant="outline"
                        size="icon"
                        className="bg-black/20 text-white border-white/20 hover:bg-black/40 hover:text-white backdrop-blur-sm transition-all rounded-full h-10 w-10"
                        onClick={toggleMute}
                        title={isMuted ? "Включить звук" : "Выключить звук"}
                    >
                        {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </Button>

                    {/* Skip Button */}
                    <Button
                        variant="outline"
                        className="bg-black/20 text-white border-white/20 hover:bg-black/40 hover:text-white backdrop-blur-sm transition-all rounded-full px-6"
                        onClick={handleComplete}
                    >
                        Пропустить <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            )}
        </div>
    );
}
