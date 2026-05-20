"use client";

import { useRef, MouseEvent, ReactNode } from "react";

interface SpotlightCardProps {
    children: ReactNode;
    className?: string;
}

export function SpotlightCard({ children, className = "" }: SpotlightCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const spotRef = useRef<HTMLDivElement>(null);

    const onMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        const card = cardRef.current;
        const spot = spotRef.current;
        if (!card || !spot) return;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        spot.style.opacity = "1";
        spot.style.background = `radial-gradient(320px circle at ${x}px ${y}px, rgba(167,139,250,0.10), transparent 70%)`;
    };

    const onMouseLeave = () => {
        const spot = spotRef.current;
        if (spot) spot.style.opacity = "0";
    };

    return (
        <div
            ref={cardRef}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            className={`grad-border-card relative overflow-hidden ${className}`}
        >
            {/* Spotlight layer */}
            <div
                ref={spotRef}
                className="pointer-events-none absolute inset-0 z-10 rounded-[11px] transition-opacity duration-300"
                style={{ opacity: 0 }}
                aria-hidden="true"
            />
            {children}
        </div>
    );
}
