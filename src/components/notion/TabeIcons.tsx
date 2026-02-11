/**
 * T.A.B.E. Custom Icons — SVG icon system
 * Replaces native emojis with custom neon-style icons that match the gamer aesthetic.
 * Each icon is a React component returning inline SVG.
 */

import React from "react";

// === TYPE ===
export interface TabeIcon {
    id: string;
    name: string;
    category: string;
    component: React.FC<{ size?: number; className?: string }>;
    /** Fallback character for text-only contexts */
    fallback: string;
}

// === SVG ICON COMPONENTS ===
// Mini neon-line-art style icons, 24x24 viewBox, stroke-based

const IconBook: React.FC<{ size?: number; className?: string }> = ({ size = 24, className }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 7h6M9 11h4" stroke="url(#neon1)" strokeWidth="1.5" strokeLinecap="round" />
        <defs><linearGradient id="neon1" x1="9" y1="7" x2="15" y2="11"><stop stopColor="#a855f7" /><stop offset="1" stopColor="#06b6d4" /></linearGradient></defs>
    </svg>
);

const IconPen: React.FC<{ size?: number; className?: string }> = ({ size = 24, className }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M17 3a2.83 2.83 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M15 5l4 4" stroke="url(#neon2)" strokeWidth="1.5" />
        <defs><linearGradient id="neon2" x1="15" y1="5" x2="19" y2="9"><stop stopColor="#f59e0b" /><stop offset="1" stopColor="#ef4444" /></linearGradient></defs>
    </svg>
);

const IconFlask: React.FC<{ size?: number; className?: string }> = ({ size = 24, className }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M9 3h6M10 3v6.5L4 20a1 1 0 00.87 1.5h14.26A1 1 0 0020 20l-6-10.5V3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7 15h10" stroke="url(#neon3)" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="9" cy="18" r="1" fill="#22d3ee" />
        <circle cx="13" cy="17" r="0.8" fill="#a855f7" />
        <defs><linearGradient id="neon3" x1="7" y1="15" x2="17" y2="15"><stop stopColor="#22d3ee" /><stop offset="1" stopColor="#a855f7" /></linearGradient></defs>
    </svg>
);

const IconCode: React.FC<{ size?: number; className?: string }> = ({ size = 24, className }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M16 18l6-6-6-6" stroke="url(#neon4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14.5 4l-5 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
        <defs><linearGradient id="neon4" x1="16" y1="6" x2="22" y2="18"><stop stopColor="#06b6d4" /><stop offset="1" stopColor="#8b5cf6" /></linearGradient></defs>
    </svg>
);

const IconTarget: React.FC<{ size?: number; className?: string }> = ({ size = 24, className }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
        <circle cx="12" cy="12" r="2" fill="url(#neon5)" />
        <defs><radialGradient id="neon5"><stop stopColor="#ef4444" /><stop offset="1" stopColor="#f59e0b" /></radialGradient></defs>
    </svg>
);

const IconBrain: React.FC<{ size?: number; className?: string }> = ({ size = 24, className }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M12 2a6 6 0 00-6 6c0 2.5 1.5 4.5 3 5.5V22h6v-8.5c1.5-1 3-3 3-5.5a6 6 0 00-6-6z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 14h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
        <path d="M10 18h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
        <circle cx="10" cy="9" r="1" fill="url(#neon6)" />
        <circle cx="14" cy="9" r="1" fill="url(#neon6)" />
        <defs><radialGradient id="neon6"><stop stopColor="#fbbf24" /><stop offset="1" stopColor="#f59e0b" /></radialGradient></defs>
    </svg>
);

const IconRocket: React.FC<{ size?: number; className?: string }> = ({ size = 24, className }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.7-.84.7-1.98 0-2.83a1.97 1.97 0 00-3 .17z" stroke="currentColor" strokeWidth="1.5" />
        <path d="M12 13l-2.5-2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M15.5 2.5s5 2.04 5 8c0 3.16-2 5.7-4.5 7.5L13 15l-3-3 3-3c1.8-2.5 2.5-6.5 2.5-6.5z" stroke="url(#neon7)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="16.5" cy="8.5" r="1" fill="currentColor" />
        <defs><linearGradient id="neon7" x1="10" y1="2" x2="20" y2="18"><stop stopColor="#f59e0b" /><stop offset="0.5" stopColor="#ef4444" /><stop offset="1" stopColor="#a855f7" /></linearGradient></defs>
    </svg>
);

const IconStar: React.FC<{ size?: number; className?: string }> = ({ size = 24, className }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="url(#neon8)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <defs><linearGradient id="neon8" x1="2" y1="2" x2="22" y2="22"><stop stopColor="#fbbf24" /><stop offset="1" stopColor="#f59e0b" /></linearGradient></defs>
    </svg>
);

const IconLightning: React.FC<{ size?: number; className?: string }> = ({ size = 24, className }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="url(#neon9)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <defs><linearGradient id="neon9" x1="3" y1="2" x2="22" y2="22"><stop stopColor="#fbbf24" /><stop offset="1" stopColor="#ef4444" /></linearGradient></defs>
    </svg>
);

const IconHeart: React.FC<{ size?: number; className?: string }> = ({ size = 24, className }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" stroke="url(#neon10)" strokeWidth="1.5" />
        <defs><linearGradient id="neon10" x1="2" y1="3" x2="22" y2="22"><stop stopColor="#ec4899" /><stop offset="1" stopColor="#ef4444" /></linearGradient></defs>
    </svg>
);

const IconMath: React.FC<{ size?: number; className?: string }> = ({ size = 24, className }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M5 8h6M8 5v6" stroke="url(#neon11)" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M14 17h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M14 7l6 6M20 7l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
        <path d="M5 17h1.5l1.5-3 2 6 1.5-3H13" stroke="url(#neon11)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <defs><linearGradient id="neon11" x1="5" y1="5" x2="13" y2="20"><stop stopColor="#06b6d4" /><stop offset="1" stopColor="#8b5cf6" /></linearGradient></defs>
    </svg>
);

const IconGlobe: React.FC<{ size?: number; className?: string }> = ({ size = 24, className }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
        <ellipse cx="12" cy="12" rx="4" ry="10" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
        <path d="M2 12h20" stroke="url(#neon12)" strokeWidth="1.5" />
        <defs><linearGradient id="neon12" x1="2" y1="12" x2="22" y2="12"><stop stopColor="#22d3ee" /><stop offset="1" stopColor="#a855f7" /></linearGradient></defs>
    </svg>
);

const IconMusic: React.FC<{ size?: number; className?: string }> = ({ size = 24, className }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M9 18V5l12-2v13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="6" cy="18" r="3" stroke="url(#neon13)" strokeWidth="1.5" />
        <circle cx="18" cy="16" r="3" stroke="url(#neon13)" strokeWidth="1.5" />
        <defs><linearGradient id="neon13" x1="3" y1="13" x2="21" y2="19"><stop stopColor="#ec4899" /><stop offset="1" stopColor="#8b5cf6" /></linearGradient></defs>
    </svg>
);

const IconPalette: React.FC<{ size?: number; className?: string }> = ({ size = 24, className }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M12 2a10 10 0 00-1 19.95c.56.05 1.05-.38 1.05-.95v-2.4c0-.83.68-1.5 1.5-1.5h2.4c.83 0 1.5-.68 1.5-1.5a4 4 0 00-4-4H12a10 10 0 010-9.6z" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="7.5" cy="10.5" r="1.2" fill="#ef4444" />
        <circle cx="12" cy="7.5" r="1.2" fill="#fbbf24" />
        <circle cx="16.5" cy="10.5" r="1.2" fill="#22d3ee" />
        <circle cx="9" cy="14.5" r="1.2" fill="#a855f7" />
    </svg>
);

const IconCrown: React.FC<{ size?: number; className?: string }> = ({ size = 24, className }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M2 20h20L19 7l-5 5-2-8-2 8-5-5-3 13z" stroke="url(#neon14)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <defs><linearGradient id="neon14" x1="2" y1="4" x2="22" y2="20"><stop stopColor="#fbbf24" /><stop offset="1" stopColor="#f59e0b" /></linearGradient></defs>
    </svg>
);

const IconShield: React.FC<{ size?: number; className?: string }> = ({ size = 24, className }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="1.5" />
        <path d="M9 12l2 2 4-4" stroke="url(#neon15)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <defs><linearGradient id="neon15" x1="9" y1="10" x2="15" y2="14"><stop stopColor="#22c55e" /><stop offset="1" stopColor="#06b6d4" /></linearGradient></defs>
    </svg>
);

const IconFire: React.FC<{ size?: number; className?: string }> = ({ size = 24, className }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M12 22c4.97 0 8-3.03 8-7 0-3-2-5.5-4-7.5-1 1-1.5 2.5-2.5 2.5S12 8 12 6c0-1 .5-2 1-3-1 0-3 1-5 3-2.5 2.5-4 5-4 8 0 4.42 3.58 8 8 8z" stroke="url(#neon16)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 22c-2 0-3-1.5-3-3.5 0-2 1.5-3 3-4.5 1.5 1.5 3 2.5 3 4.5S14 22 12 22z" stroke="url(#neon16b)" strokeWidth="1.5" />
        <defs>
            <linearGradient id="neon16" x1="4" y1="3" x2="20" y2="22"><stop stopColor="#f59e0b" /><stop offset="1" stopColor="#ef4444" /></linearGradient>
            <linearGradient id="neon16b" x1="9" y1="14" x2="15" y2="22"><stop stopColor="#fbbf24" /><stop offset="1" stopColor="#f59e0b" /></linearGradient>
        </defs>
    </svg>
);

const IconGamepad: React.FC<{ size?: number; className?: string }> = ({ size = 24, className }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M4 8a4 4 0 014-4h8a4 4 0 014 4v2a8 8 0 01-16 0V8z" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 8v4M6 10h4" stroke="url(#neon17)" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="15" cy="9" r="1" fill="url(#neon17)" />
        <circle cx="17" cy="11" r="1" fill="currentColor" opacity="0.5" />
        <defs><linearGradient id="neon17" x1="6" y1="8" x2="18" y2="12"><stop stopColor="#a855f7" /><stop offset="1" stopColor="#06b6d4" /></linearGradient></defs>
    </svg>
);

const IconLeaf: React.FC<{ size?: number; className?: string }> = ({ size = 24, className }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 0-8 0-5 5z" stroke="url(#neon18)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
        <path d="M4 21c4-6 8-9 14-16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
        <defs><linearGradient id="neon18" x1="3" y1="3" x2="22" y2="22"><stop stopColor="#22c55e" /><stop offset="1" stopColor="#06b6d4" /></linearGradient></defs>
    </svg>
);

const IconDiamond: React.FC<{ size?: number; className?: string }> = ({ size = 24, className }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M6 3h12l4 6-10 13L2 9l4-6z" stroke="url(#neon19)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2 9h20" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
        <path d="M10 3l-2 6 4 13 4-13-2-6" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" opacity="0.3" />
        <defs><linearGradient id="neon19" x1="2" y1="3" x2="22" y2="22"><stop stopColor="#06b6d4" /><stop offset="0.5" stopColor="#8b5cf6" /><stop offset="1" stopColor="#ec4899" /></linearGradient></defs>
    </svg>
);

const IconAtom: React.FC<{ size?: number; className?: string }> = ({ size = 24, className }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <ellipse cx="12" cy="12" rx="10" ry="4" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
        <ellipse cx="12" cy="12" rx="10" ry="4" stroke="url(#neon20)" strokeWidth="1.5" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="10" ry="4" stroke="currentColor" strokeWidth="1.5" transform="rotate(120 12 12)" opacity="0.5" />
        <circle cx="12" cy="12" r="2" fill="url(#neon20b)" />
        <defs>
            <linearGradient id="neon20" x1="2" y1="8" x2="22" y2="16"><stop stopColor="#06b6d4" /><stop offset="1" stopColor="#8b5cf6" /></linearGradient>
            <radialGradient id="neon20b"><stop stopColor="#22d3ee" /><stop offset="1" stopColor="#8b5cf6" /></radialGradient>
        </defs>
    </svg>
);

// === ICON CATALOG ===
export const tabeIcons: TabeIcon[] = [
    // Estudio
    { id: "book", name: "Libro", category: "Estudio", component: IconBook, fallback: "📖" },
    { id: "pen", name: "Pluma", category: "Estudio", component: IconPen, fallback: "✏️" },
    { id: "brain", name: "Cerebro", category: "Estudio", component: IconBrain, fallback: "🧠" },
    { id: "target", name: "Objetivo", category: "Estudio", component: IconTarget, fallback: "🎯" },
    { id: "lightning", name: "Rayo", category: "Estudio", component: IconLightning, fallback: "⚡" },
    // Ciencia
    { id: "flask", name: "Matraz", category: "Ciencia", component: IconFlask, fallback: "🧪" },
    { id: "atom", name: "Átomo", category: "Ciencia", component: IconAtom, fallback: "⚛️" },
    { id: "math", name: "Matemática", category: "Ciencia", component: IconMath, fallback: "🧮" },
    { id: "code", name: "Código", category: "Ciencia", component: IconCode, fallback: "💻" },
    { id: "globe", name: "Mundo", category: "Ciencia", component: IconGlobe, fallback: "🌍" },
    // Gaming
    { id: "rocket", name: "Cohete", category: "Gaming", component: IconRocket, fallback: "🚀" },
    { id: "fire", name: "Fuego", category: "Gaming", component: IconFire, fallback: "🔥" },
    { id: "crown", name: "Corona", category: "Gaming", component: IconCrown, fallback: "👑" },
    { id: "shield", name: "Escudo", category: "Gaming", component: IconShield, fallback: "🛡️" },
    { id: "gamepad", name: "Control", category: "Gaming", component: IconGamepad, fallback: "🎮" },
    { id: "diamond", name: "Diamante", category: "Gaming", component: IconDiamond, fallback: "💎" },
    // Expresiones
    { id: "star", name: "Estrella", category: "Expresiones", component: IconStar, fallback: "⭐" },
    { id: "heart", name: "Corazón", category: "Expresiones", component: IconHeart, fallback: "❤️" },
    { id: "leaf", name: "Hoja", category: "Expresiones", component: IconLeaf, fallback: "🌿" },
    { id: "music", name: "Música", category: "Expresiones", component: IconMusic, fallback: "🎵" },
    { id: "palette", name: "Paleta", category: "Expresiones", component: IconPalette, fallback: "🎨" },
];

// Helpers
export const getIconById = (id: string): TabeIcon | undefined =>
    tabeIcons.find((i) => i.id === id);

export const getIconCategories = (): string[] =>
    [...new Set(tabeIcons.map((i) => i.category))];

/**
 * Renders a T.A.B.E. icon by ID. Falls back to the stored string if not a custom icon.
 */
export function TabeIconRenderer({
    iconId,
    size = 24,
    className,
}: {
    iconId: string;
    size?: number;
    className?: string;
}) {
    const icon = getIconById(iconId);
    if (icon) {
        const Comp = icon.component;
        return <Comp size={size} className={className} />;
    }
    // Legacy fallback: render as text (old emoji)
    return <span style={{ fontSize: size * 0.85, lineHeight: 1 }}>{iconId}</span>;
}
