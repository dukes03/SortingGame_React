"use client";

import React, { useRef, useEffect } from "react";

// GlitterGravityCanvas.tsx
// TypeScript + React + TailwindCSS
// Canvas version: continuous falling glitter with gravity, random shape, color, size, spin, etc.
// Transparent background (for overlay on UI)

interface GlitterGravityProps {
    gravity?: number;
    spawnRate?: number;
    colors?: string[];
    minSize?: number;
    maxSize?: number;
    spawnArea?: number;
    style?: React.CSSProperties;
}

type Shape = "circle" | "square" | "triangle" | "star" | "line";

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    rotation: number;
    spin: number;
    shape: Shape;
    color: string;
}

export default function GlitterGravity({
    gravity = 0.000001,
    spawnRate = 10,
    colors = [
        "#ec4899", // pink-500
        "#fbbf24", // amber-400
        "#34d399", // emerald-400
        "#6366f1", // indigo-500
        "#f43f5e", // rose-500
        "#facc15", // yellow-400
    ],
    minSize = 6,
    maxSize = 18,
    spawnArea = 1,
    style = {},
}: GlitterGravityProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const particlesRef = useRef<Particle[]>([]);
    const lastTimeRef = useRef<number | null>(null);
    const spawnAccRef = useRef<number>(0);
    const widthRef = useRef<number>(0);
    const heightRef = useRef<number>(0);

    const rand = (min: number, max: number) => Math.random() * (max - min) + min;
    const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

    function createParticle(canvasWidth: number): Particle {
        const x = rand((1 - spawnArea) * canvasWidth * 0.5, canvasWidth - (1 - spawnArea) * canvasWidth * 0.5);
        const y = rand(-30, -10);
        const angle = rand(-Math.PI * 0.8, Math.PI * 0.8);
        const speed = rand(0.0012, 0.025);
        const vx = Math.cos(angle) * speed;
        const vy = rand(0.0012, 0.025);
        const size = rand(minSize, maxSize);
        const rotation = rand(0, Math.PI * 2);
        const spin = rand(-0.025, 0.025);
        const shape: Shape = pick(["circle", "square", "triangle", "star", "line"]);
        const color = pick(colors);
        return { x, y, vx, vy, size, rotation, spin, shape, color };
    }

    function drawParticle(ctx: CanvasRenderingContext2D, p: Particle) {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;

        switch (p.shape) {
            case "circle":
                ctx.beginPath();
                ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
                ctx.fill();
                break;
            case "square":
                ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
                break;
            case "triangle":
                ctx.beginPath();
                ctx.moveTo(0, -p.size / 2);
                ctx.lineTo(p.size / 2, p.size / 2);
                ctx.lineTo(-p.size / 2, p.size / 2);
                ctx.closePath();
                ctx.fill();
                break;
            case "star": {
                const spikes = 5;
                const outerRadius = p.size / 2;
                const innerRadius = p.size / 4;
                let rot = Math.PI / 2 * 3;
                let x = 0;
                let y = 0;
                ctx.beginPath();
                ctx.moveTo(0, -outerRadius);
                for (let i = 0; i < spikes; i++) {
                    x = Math.cos(rot) * outerRadius;
                    y = Math.sin(rot) * outerRadius;
                    ctx.lineTo(x, y);
                    rot += Math.PI / spikes;
                    x = Math.cos(rot) * innerRadius;
                    y = Math.sin(rot) * innerRadius;
                    ctx.lineTo(x, y);
                    rot += Math.PI / spikes;
                }
                ctx.lineTo(0, -outerRadius);
                ctx.closePath();
                ctx.fill();
                break;
            }
            case "line":
                ctx.fillRect(-p.size, -p.size * 0.1, p.size * 2, p.size * 0.2);
                break;
        }

        ctx.restore();
    }

    function tick(now: number) {
        if (!lastTimeRef.current) lastTimeRef.current = now;
        const dt = now - lastTimeRef.current;
        lastTimeRef.current = now;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const width = canvas.width;
        const height = canvas.height;

        // spawn new particles continuously
        spawnAccRef.current += (spawnRate * dt) / 1000;
        while (spawnAccRef.current >= 1) {
            particlesRef.current.push(createParticle(width));
            spawnAccRef.current--;
        }

        // physics update
        particlesRef.current.forEach((p) => {
            p.vy += gravity * dt;
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            p.rotation += p.spin * dt;
        });

        // remove particles out of view
        particlesRef.current = particlesRef.current.filter(
            (p) => p.y < height + 50 && p.x > -50 && p.x < width + 50
        );

        // draw
        ctx.clearRect(0, 0, width, height);
        particlesRef.current.forEach((p) => drawParticle(ctx, p));

        requestAnimationFrame(tick);
    }

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const resize = () => {
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width * window.devicePixelRatio;
            canvas.height = rect.height * window.devicePixelRatio;
            widthRef.current = canvas.width;
            heightRef.current = canvas.height;
            const ctx = canvas.getContext("2d");
            if (ctx) ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        };

        resize();
        window.addEventListener("resize", resize);
        const initialCount = 200; // จำนวนเริ่มต้น (ปรับได้)
        for (let i = 0; i < initialCount; i++) {
            const p = createParticle(canvas.width);
            p.x = rand(0, canvas.width); // สุ่มตำแหน่ง X ทั่วจอ
            p.y = rand(0, canvas.height); // สุ่มตำแหน่ง Y ทั่วจอ
            p.vy = rand(0.0012, 0.0025); // ความเร็วเริ่มต้นช้าหน่อย
            particlesRef.current.push(p);
        }
        requestAnimationFrame(tick);

        return () => {
            window.removeEventListener("resize", resize);
        };
    }, []);


    // click burst
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const onClick = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            for (let i = 0; i < 30; i++) {
                const p = createParticle(canvas.width);
                p.x = x;
                particlesRef.current.push(p);
            }
        };
        canvas.addEventListener("click", onClick);
        return () => canvas.removeEventListener("click", onClick);
    }, []);

    return (
        <div
            className="relative w-full h-full overflow-hidden"
            style={{ minHeight: "240px", ...style }}
        >
            <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 w-full h-full"
                style={{ background: "transparent", pointerEvents: "auto" }}
            />
        </div>
    );
}
