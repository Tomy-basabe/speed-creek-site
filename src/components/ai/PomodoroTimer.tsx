
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Play, Pause, RotateCcw, Timer, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePomodoro, TimerMode } from "@/contexts/PomodoroContext";

const TIMER_MODES: Record<TimerMode, { label: string; color: string }> = {
    focus: { label: "Focus", color: "text-primary" },
    shortBreak: { label: "Short Break", color: "text-neon-green" },
    longBreak: { label: "Long Break", color: "text-neon-cyan" },
};

const MOTIVATIONAL_QUOTES = [
    "¡Dale que sos ingeniero!",
    "El dolor es temporal, el título es para siempre.",
    "Un Pomodoro más, una materia menos.",
    "Concentración total. Modo Dios activado.",
    "Si fuera fácil, cualquiera lo haría.",
];

export function PomodoroTimer() {
    const {
        mode,
        timeLeft,
        isActive,
        soundEnabled,
        toggleTimer,
        resetTimer,
        changeMode,
        setSoundEnabled,
        formatTime,
        progress
    } = usePomodoro();

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2 border-primary/20 hover:bg-primary/10 w-full mb-2">
                    <Timer className="w-4 h-4 text-primary" />
                    Pomodoro
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xs bg-card/95 backdrop-blur-xl border-border/50">
                <DialogHeader>
                    <DialogTitle className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                            <Timer className="w-5 h-5 text-primary" />
                            Pomodoro T.A.B.E.
                        </span>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setSoundEnabled(!soundEnabled)}>
                            {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                        </Button>
                    </DialogTitle>
                </DialogHeader>

                <div className="flex flex-col items-center gap-4 py-4">
                    {/* Mode Selector */}
                    <div className="flex bg-secondary p-1 rounded-lg w-full">
                        {(Object.keys(TIMER_MODES) as TimerMode[]).map((m) => (
                            <button
                                key={m}
                                onClick={() => changeMode(m)}
                                className={cn(
                                    "flex-1 text-xs py-1.5 rounded-md transition-all",
                                    mode === m
                                        ? "bg-background shadow-sm font-medium text-foreground"
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                {TIMER_MODES[m].label}
                            </button>
                        ))}
                    </div>

                    {/* Timer Display */}
                    <div className="relative w-48 h-48 flex items-center justify-center">
                        {/* Progress Ring Background */}
                        <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="4" className="text-secondary" />
                            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="4"
                                className={TIMER_MODES[mode].color}
                                strokeDasharray="283"
                                strokeDashoffset={283 - (283 * progress) / 100}
                                strokeLinecap="round"
                            />
                        </svg>

                        <div className="text-4xl font-mono font-bold tracking-wider z-10 transition-colors duration-300">
                            {formatTime(timeLeft)}
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex gap-4">
                        <Button
                            size="lg"
                            className={cn("w-24 rounded-full", isActive ? "bg-secondary hover:bg-secondary/80 text-foreground" : "bg-primary hover:bg-primary/90 text-primary-foreground")}
                            onClick={toggleTimer}
                        >
                            {isActive ? <Pause className="fill-current" /> : <Play className="fill-current ml-1" />}
                        </Button>
                        <Button size="icon" variant="secondary" className="rounded-full" onClick={resetTimer}>
                            <RotateCcw className="w-4 h-4" />
                        </Button>
                    </div>

                    {isActive && (
                        <p className="text-xs text-center text-muted-foreground animate-pulse mt-2">
                            "{MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]}"
                        </p>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
