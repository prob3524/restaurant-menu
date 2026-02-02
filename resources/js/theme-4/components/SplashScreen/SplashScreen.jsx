import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const SplashScreen = ({ onFinish }) => {
    const containerRef = useRef(null);
    const logoRef = useRef(null);
    const textRef = useRef(null);
    const overlayRef = useRef(null);

    useEffect(() => {
        // Prevent scroll
        document.body.style.overflow = 'hidden';

        const tl = gsap.timeline({
            onComplete: () => {
                // Restore scroll
                document.body.style.overflow = '';
                // Fade out container
                gsap.to(containerRef.current, {
                    opacity: 0,
                    duration: 1,
                    ease: 'power2.inOut',
                    onComplete: onFinish
                });
            }
        });

        // Initial state
        gsap.set(containerRef.current, { opacity: 1 });
        gsap.set(logoRef.current, { scale: 0.8, opacity: 0, rotation: -10 });
        gsap.set(textRef.current, { y: 30, opacity: 0 });

        // Cinematic Sequence
        tl
            // 1. Logo Entrance (Slow & Heavy)
            .to(logoRef.current, {
                scale: 1,
                opacity: 1,
                rotation: 0,
                duration: 1.5,
                ease: 'power3.out'
            })
            // 2. Text Reveal (Elegant)
            .to(textRef.current, {
                y: 0,
                opacity: 1,
                duration: 1,
                ease: 'power2.out'
            }, "-=1") // Overlap with logo
            // 3. Hold/Breath
            .to(logoRef.current, {
                scale: 1.05,
                duration: 2,
                ease: 'sine.inOut',
                yoyo: true,
                repeat: 1
            }, "-=1")
            // 4. Light Sweep / Glow Effect (simulated via overlay)
            .to(overlayRef.current, {
                x: '200%',
                duration: 1.5,
                ease: 'power2.inOut'
            }, "-=2")
            // 5. Build anticipation for exit
            .to([logoRef.current, textRef.current], {
                scale: 1.1,
                opacity: 0,
                duration: 0.8,
                ease: 'power2.in',
                stagger: 0.1
            });

        return () => {
            tl.kill();
            document.body.style.overflow = '';
        };
    }, [onFinish]);

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0a0a0a] text-white overflow-hidden"
        >
            {/* Ambient Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-black via-black to-cafe-primary/5 pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center">
                <div ref={logoRef} className="mb-8 relative">
                    {/* Luxe Circle Logo */}
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border border-cafe-primary/30 flex items-center justify-center relative overflow-hidden bg-black/50 backdrop-blur-sm shadow-[0_0_40px_-10px_rgba(212,163,115,0.2)]">
                        {/* Shine Effect Overlay */}
                        <div
                            ref={overlayRef}
                            className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[200%] skew-x-12"
                        />
                        <span className="text-6xl md:text-7xl font-serif text-cafe-primary/90 italic">L</span>
                    </div>
                </div>

                <div ref={textRef} className="text-center">
                    <h1 className="text-2xl md:text-3xl font-serif tracking-[0.3em] text-white/90 uppercase mb-2">
                        Luxe Cafe
                    </h1>
                    <div className="h-[1px] w-12 mx-auto bg-cafe-primary/50" />
                    <p className="mt-3 text-xs md:text-sm text-white/40 tracking-widest font-light uppercase">
                        Premium Dining Experience
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SplashScreen;
