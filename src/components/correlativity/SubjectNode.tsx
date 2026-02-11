
import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { cn } from '@/lib/utils';
import { Sparkles, Trophy, Lock, CheckCircle, Clock, BookOpen, X } from 'lucide-react';

const statusStyles = {
    aprobada: {
        base: "bg-green-500/10 border-green-500",
        text: "text-green-500",
        icon: CheckCircle,
        glow: "shadow-[0_0_15px_rgba(34,197,94,0.3)]",
    },
    regular: {
        base: "bg-cyan-500/10 border-cyan-500",
        text: "text-cyan-500",
        icon: Clock,
        glow: "shadow-[0_0_15px_rgba(6,182,212,0.3)]",
    },
    cursable: {
        base: "bg-blue-500/10 border-blue-500",
        text: "text-blue-500",
        icon: BookOpen,
        glow: "shadow-[0_0_15px_rgba(59,130,246,0.3)]",
    },
    bloqueada: {
        base: "bg-muted/30 border-muted-foreground/30",
        text: "text-muted-foreground",
        icon: Lock,
        glow: "",
    },
    recursar: {
        base: "bg-red-500/10 border-red-500",
        text: "text-red-500",
        icon: X,
        glow: "shadow-[0_0_15px_rgba(239,68,68,0.3)]",
    },
};

export const SubjectNode = memo(({ data }: NodeProps) => {
    const status = (data.status as keyof typeof statusStyles) || 'bloqueada';
    const style = statusStyles[status];
    const Icon = style.icon;
    const isFinalProject = data.label?.toString().toLowerCase().includes('proyecto final') ||
        data.label?.toString().toLowerCase().includes('tesis') ||
        data.label?.toString().toLowerCase().includes('práctica profesional');

    if (isFinalProject) {
        return (
            <div className="relative group">
                <Handle type="target" position={Position.Left} className="!bg-yellow-400 !w-3 !h-3 !-left-1.5" />
                <div className={cn(
                    "w-[240px] p-4 rounded-xl border-2 transition-all duration-300",
                    "bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-400",
                    "shadow-[0_0_30px_rgba(250,204,21,0.4)] hover:shadow-[0_0_50px_rgba(250,204,21,0.6)]",
                    "hover:scale-105 backdrop-blur-xl"
                )}>
                    <div className="absolute -top-3 -right-3 animate-bounce">
                        <div className="bg-yellow-400 text-black p-1.5 rounded-full shadow-lg">
                            <Trophy className="w-5 h-5" />
                        </div>
                    </div>

                    <div className="flex items-center gap-3 mb-2">
                        <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
                        <span className="text-xs font-bold text-yellow-400 tracking-wider uppercase">Meta Final</span>
                    </div>

                    <div className="text-lg font-display font-bold text-foreground leading-tight">
                        {data.label as string}
                    </div>

                    <div className="mt-2 text-xs text-yellow-500/80 font-mono">
                        {data.codigo as string}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative group">
            <Handle type="target" position={Position.Left} className={cn("!w-2 !h-2 transition-colors", style.text)} />

            <div className={cn(
                "w-[180px] p-3 rounded-lg border backdrop-blur-md transition-all duration-300",
                style.base,
                style.glow,
                "group-hover:scale-105 group-hover:border-opacity-100 border-opacity-60"
            )}>
                <div className="flex justify-between items-start gap-2">
                    <div className="font-semibold text-sm text-foreground line-clamp-2 leading-tight">
                        {data.label as string}
                    </div>
                    <Icon className={cn("w-4 h-4 flex-shrink-0 mt-0.5", style.text)} />
                </div>

                <div className="mt-2 flex items-center justify-between">
                    <span className="text-[10px] font-mono opacity-60 uppercase">{data.codigo as string}</span>
                    {status === 'aprobada' && data.nota && (
                        <span className="text-[10px] font-bold bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded">
                            Nota: {data.nota}
                        </span>
                    )}
                </div>
            </div>

            <Handle type="source" position={Position.Right} className={cn("!w-2 !h-2 transition-colors", style.text)} />
        </div>
    );
});

SubjectNode.displayName = 'SubjectNode';
