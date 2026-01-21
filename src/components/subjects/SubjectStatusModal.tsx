import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SubjectWithStatus, SubjectStatus } from "@/hooks/useSubjects";
import { CheckCircle2, Clock, BookOpen, Lock, RotateCcw, Trophy, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface SubjectStatusModalProps {
  subject: SubjectWithStatus | null;
  open: boolean;
  onClose: () => void;
  onUpdate: (subjectId: string, status: SubjectStatus, nota?: number) => Promise<void>;
}

const statusOptions: { value: SubjectStatus; label: string; icon: any; color: string; description: string }[] = [
  { 
    value: "aprobada", 
    label: "Aprobada", 
    icon: Trophy, 
    color: "text-neon-gold bg-neon-gold/20 border-neon-gold",
    description: "¡Materia completada con éxito!"
  },
  { 
    value: "regular", 
    label: "Regular", 
    icon: Clock, 
    color: "text-neon-cyan bg-neon-cyan/20 border-neon-cyan",
    description: "Cursada aprobada, falta final"
  },
  { 
    value: "cursable", 
    label: "Cursable", 
    icon: BookOpen, 
    color: "text-neon-green bg-neon-green/20 border-neon-green",
    description: "Lista para cursar"
  },
  { 
    value: "recursar", 
    label: "Recursar", 
    icon: RotateCcw, 
    color: "text-neon-red bg-neon-red/20 border-neon-red",
    description: "Necesitas volver a cursar"
  },
];

export function SubjectStatusModal({ subject, open, onClose, onUpdate }: SubjectStatusModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<SubjectStatus | null>(null);
  const [nota, setNota] = useState<string>("");
  const [loading, setLoading] = useState(false);

  if (!subject) return null;

  const handleStatusSelect = (status: SubjectStatus) => {
    setSelectedStatus(status);
    if (status !== "aprobada") {
      setNota("");
    }
  };

  const handleSave = async () => {
    if (!selectedStatus) return;
    
    setLoading(true);
    try {
      const notaValue = selectedStatus === "aprobada" && nota ? parseFloat(nota) : undefined;
      await onUpdate(subject.id, selectedStatus, notaValue);
      onClose();
      setSelectedStatus(null);
      setNota("");
    } finally {
      setLoading(false);
    }
  };

  const isBlocked = subject.status === "bloqueada";

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-display text-xl gradient-text">
            {subject.nombre}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">{subject.codigo} • Año {subject.año}</p>
        </DialogHeader>

        {isBlocked ? (
          <div className="py-6">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <Lock className="w-8 h-8 text-muted-foreground" />
              </div>
            </div>
            <p className="text-center text-muted-foreground mb-4">
              Esta materia está bloqueada. Necesitas:
            </p>
            <div className="space-y-2">
              {subject.requisitos_faltantes.map((req, i) => (
                <div key={i} className="flex items-center gap-2 p-3 bg-secondary rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-neon-red" />
                  <span className="text-sm">{req}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="py-4 space-y-4">
            {/* Current Status */}
            {subject.nota && (
              <div className="flex items-center justify-center gap-2 p-3 bg-neon-gold/10 rounded-xl border border-neon-gold/30">
                <Star className="w-5 h-5 text-neon-gold" />
                <span className="text-neon-gold font-medium">Nota actual: {subject.nota}</span>
              </div>
            )}

            {/* Status Options */}
            <div className="grid grid-cols-2 gap-3">
              {statusOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = selectedStatus === option.value;
                
                return (
                  <button
                    key={option.value}
                    onClick={() => handleStatusSelect(option.value)}
                    className={cn(
                      "p-4 rounded-xl border-2 transition-all text-left",
                      isSelected
                        ? option.color
                        : "border-border bg-secondary hover:bg-secondary/80"
                    )}
                  >
                    <Icon className={cn("w-6 h-6 mb-2", isSelected ? "" : "text-muted-foreground")} />
                    <p className={cn("font-medium text-sm", isSelected ? "" : "text-foreground")}>
                      {option.label}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {option.description}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Nota Input for Aprobada */}
            {selectedStatus === "aprobada" && (
              <div className="space-y-2 animate-fade-in">
                <label className="text-sm font-medium">Nota obtenida</label>
                <input
                  type="number"
                  min="4"
                  max="10"
                  step="0.5"
                  value={nota}
                  onChange={(e) => setNota(e.target.value)}
                  placeholder="Ej: 8"
                  className="w-full px-4 py-3 bg-secondary rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-neon-gold/50"
                />
              </div>
            )}

            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={!selectedStatus || loading}
              className={cn(
                "w-full py-3 rounded-xl font-medium transition-all",
                selectedStatus
                  ? "bg-gradient-to-r from-neon-cyan to-neon-purple text-background hover:opacity-90"
                  : "bg-secondary text-muted-foreground cursor-not-allowed"
              )}
            >
              {loading ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
