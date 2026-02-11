
import { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, Settings, Coffee, BookOpen, Target, Loader2, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { usePomodoro, TimerMode } from "@/contexts/PomodoroContext";
import { PomodoroSettings } from "@/components/pomodoro/PomodoroSettings";

interface Subject {
  id: string;
  nombre: string;
  codigo: string;
}

const modeConfig = {
  work: {
    label: "Trabajo",
    icon: BookOpen,
    color: "text-neon-cyan",
    bgColor: "bg-neon-cyan/20",
    borderColor: "border-neon-cyan",
  },
  shortBreak: {
    label: "Descanso Corto",
    icon: Coffee,
    color: "text-neon-green",
    bgColor: "bg-neon-green/20",
    borderColor: "border-neon-green",
  },
  longBreak: {
    label: "Descanso Largo",
    icon: Target,
    color: "text-neon-purple",
    bgColor: "bg-neon-purple/20",
    borderColor: "border-neon-purple",
  },
};

export default function Pomodoro() {
  const { user } = useAuth();

  // Consume Global Context
  const {
    mode,
    timeLeft,
    isActive,
    toggleTimer,
    resetTimer,
    changeMode,
    formatTime,
    progress,
    selectedSubject,
    setSelectedSubject,
    completedPomodoros
  } = usePomodoro();

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  // Still fetch subjects locally as that's UI data, not timer logic
  useEffect(() => {
    if (user) {
      fetchSubjects();
    }
  }, [user]);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("subjects")
        .select("id, nombre, codigo")
        .order("nombre", { ascending: true });

      if (error) throw error;
      setSubjects(data || []);
    } catch (error) {
      console.error("Error fetching subjects:", error);
      toast.error("Error al cargar materias");
    } finally {
      setLoading(false);
    }
  };

  const config = modeConfig[mode];
  const Icon = config.icon;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl lg:text-3xl font-bold gradient-text">
            Pomodoro Global
          </h1>
          <p className="text-muted-foreground mt-1">
            Tu tiempo se sincroniza en toda la app 🍅
          </p>
        </div>
        {isActive && mode === "work" && (
          <div className="flex items-center gap-2 text-sm text-neon-green">
            <Save className="w-4 h-4 animate-pulse" />
            Guardando sesión...
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Timer */}
        <div className="lg:col-span-2 card-gamer rounded-xl p-6 lg:p-10">
          {/* Mode Selector */}
          <div className="flex justify-center gap-2 mb-8">
            {(Object.keys(modeConfig) as TimerMode[]).map((m) => {
              const mConfig = modeConfig[m];
              return (
                <button
                  key={m}
                  onClick={() => changeMode(m)}
                  // disabled={isActive} // Allow changing mode even if active (context handles save)
                  className={cn(
                    "px-4 py-2 rounded-xl text-sm font-medium transition-all",
                    mode === m
                      ? cn(mConfig.bgColor, mConfig.color, "border", mConfig.borderColor)
                      : "bg-secondary hover:bg-secondary/80",
                    isActive && mode !== m && "opacity-50"
                  )}
                >
                  {mConfig.label}
                </button>
              );
            })}
          </div>

          {/* Timer Display */}
          <div className="flex flex-col items-center">
            <div className="relative w-64 h-64 lg:w-80 lg:h-80">
              {/* Background Circle */}
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="50%"
                  cy="50%"
                  r="45%"
                  fill="none"
                  stroke="hsl(var(--secondary))"
                  strokeWidth="8"
                />
                <circle
                  cx="50%"
                  cy="50%"
                  r="45%"
                  fill="none"
                  stroke={`hsl(var(--${mode === "work" ? "neon-cyan" : mode === "shortBreak" ? "neon-green" : "neon-purple"}))`}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 45} ${2 * Math.PI * 45}`}
                  strokeDashoffset={2 * Math.PI * 45 * (1 - progress / 100)}
                  className="transition-all duration-1000"
                  style={{
                    filter: `drop-shadow(0 0 10px hsl(var(--${mode === "work" ? "neon-cyan" : mode === "shortBreak" ? "neon-green" : "neon-purple"})))`,
                  }}
                />
              </svg>

              {/* Timer Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Icon className={cn("w-8 h-8 mb-2", config.color)} />
                <span className={cn(
                  "font-display text-5xl lg:text-6xl font-bold",
                  config.color,
                  "text-glow-cyan"
                )}>
                  {formatTime(timeLeft)}
                </span>
                <span className="text-sm text-muted-foreground mt-2">
                  {config.label}
                </span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4 mt-8">
              <button
                onClick={resetTimer}
                className="p-3 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors"
              >
                <RotateCcw className="w-6 h-6" />
              </button>
              <button
                onClick={toggleTimer}
                className={cn(
                  "p-6 rounded-2xl transition-all",
                  isActive
                    ? "bg-neon-red/20 text-neon-red hover:bg-neon-red/30"
                    : cn(config.bgColor, config.color, "hover:opacity-80"),
                  "glow-cyan"
                )}
              >
                {isActive ? (
                  <Pause className="w-8 h-8" />
                ) : (
                  <Play className="w-8 h-8 ml-1" />
                )}
              </button>
              {/* Settings could integrate with context settings if needed, hidden for now as context uses defaults */}
            </div>

            {/* Pomodoros Counter */}
            <div className="mt-8 flex items-center gap-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "w-4 h-4 rounded-full transition-all",
                    i < completedPomodoros % 4
                      ? "bg-neon-gold glow-gold"
                      : "bg-secondary"
                  )}
                />
              ))}
              <span className="text-sm text-muted-foreground ml-2">
                {completedPomodoros} pomodoros hoy
              </span>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Subject Selector */}
          <div className="card-gamer rounded-xl p-5">
            <h3 className="font-display font-semibold mb-4">Materia Actual</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              <button
                onClick={() => setSelectedSubject(null)}
                className={cn(
                  "w-full p-3 rounded-lg text-left text-sm transition-all",
                  selectedSubject === null
                    ? "bg-primary/10 text-primary border border-primary/30"
                    : "bg-secondary hover:bg-secondary/80"
                )}
              >
                Sin materia específica
              </button>
              {subjects.map((subject) => (
                <button
                  key={subject.id}
                  onClick={() => setSelectedSubject(subject.id)}
                  className={cn(
                    "w-full p-3 rounded-lg text-left text-sm transition-all",
                    selectedSubject === subject.id
                      ? "bg-primary/10 text-primary border border-primary/30"
                      : "bg-secondary hover:bg-secondary/80"
                  )}
                >
                  <span className="font-medium">{subject.codigo}</span>
                  <span className="text-muted-foreground ml-2">{subject.nombre}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="card-gamer rounded-xl p-5">
            <p className="text-xs text-muted-foreground text-center">
              El timer sigue corriendo aunque navegues a otra sección.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
