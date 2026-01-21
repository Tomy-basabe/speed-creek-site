import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { 
  Layers, Plus, Play, ChevronLeft, ChevronRight, 
  Check, X, Clock, RotateCcw, Trash2, Edit2 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Deck {
  id: string;
  nombre: string;
  subject_id: string;
  total_cards: number;
  subject?: { nombre: string; codigo: string; año: number };
}

interface Flashcard {
  id: string;
  pregunta: string;
  respuesta: string;
  veces_correcta: number;
  veces_incorrecta: number;
}

interface Subject {
  id: string;
  nombre: string;
  codigo: string;
  año: number;
}

export default function Flashcards() {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [decks, setDecks] = useState<Deck[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isStudying, setIsStudying] = useState(false);
  const [studyTime, setStudyTime] = useState(0);
  const [showNewDeckModal, setShowNewDeckModal] = useState(false);
  const [showNewCardModal, setShowNewCardModal] = useState(false);
  const [newDeckName, setNewDeckName] = useState("");
  const [newCardQuestion, setNewCardQuestion] = useState("");
  const [newCardAnswer, setNewCardAnswer] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchSubjects();
      fetchDecks();
    }
  }, [user]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isStudying) {
      interval = setInterval(() => {
        setStudyTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isStudying]);

  const fetchSubjects = async () => {
    const { data, error } = await supabase
      .from("subjects")
      .select("*")
      .order("año", { ascending: true });
    
    if (!error && data) {
      setSubjects(data);
    }
  };

  const fetchDecks = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("flashcard_decks")
      .select("*, subjects(nombre, codigo, año)")
      .order("created_at", { ascending: false });
    
    if (!error && data) {
      const mapped = data.map((d: any) => ({ ...d, subject: d.subjects }));
      setDecks(mapped);
    }
    setLoading(false);
  };

  const fetchCards = async (deckId: string) => {
    const { data, error } = await supabase
      .from("flashcards")
      .select("*")
      .eq("deck_id", deckId)
      .order("created_at", { ascending: true });
    
    if (!error && data) {
      setCards(data);
    }
  };

  const createDeck = async () => {
    if (!user || !selectedSubject || !newDeckName.trim()) return;

    const { error } = await supabase
      .from("flashcard_decks")
      .insert({
        user_id: user.id,
        subject_id: selectedSubject,
        nombre: newDeckName.trim(),
      });

    if (error) {
      toast.error("Error al crear el mazo");
    } else {
      toast.success("¡Mazo creado exitosamente!");
      setNewDeckName("");
      setShowNewDeckModal(false);
      fetchDecks();
    }
  };

  const createCard = async () => {
    if (!user || !selectedDeck || !newCardQuestion.trim() || !newCardAnswer.trim()) return;

    const { error } = await supabase
      .from("flashcards")
      .insert({
        user_id: user.id,
        deck_id: selectedDeck.id,
        pregunta: newCardQuestion.trim(),
        respuesta: newCardAnswer.trim(),
      });

    if (error) {
      toast.error("Error al crear la tarjeta");
    } else {
      toast.success("¡Tarjeta agregada!");
      setNewCardQuestion("");
      setNewCardAnswer("");
      setShowNewCardModal(false);
      fetchCards(selectedDeck.id);
      
      // Update deck card count
      await supabase
        .from("flashcard_decks")
        .update({ total_cards: cards.length + 1 })
        .eq("id", selectedDeck.id);
    }
  };

  const handleCardResult = async (correct: boolean) => {
    if (!cards[currentCardIndex]) return;
    
    const card = cards[currentCardIndex];
    await supabase
      .from("flashcards")
      .update({
        veces_correcta: correct ? card.veces_correcta + 1 : card.veces_correcta,
        veces_incorrecta: correct ? card.veces_incorrecta : card.veces_incorrecta + 1,
      })
      .eq("id", card.id);

    setIsFlipped(false);
    
    if (currentCardIndex < cards.length - 1) {
      setTimeout(() => setCurrentCardIndex(prev => prev + 1), 300);
    } else {
      // End of deck - save study session
      await saveStudySession();
      toast.success(`¡Mazo completado! Tiempo: ${formatTime(studyTime)}`);
      setIsStudying(false);
      setCurrentCardIndex(0);
    }
  };

  const saveStudySession = async () => {
    if (!user || !selectedDeck) return;
    
    await supabase
      .from("study_sessions")
      .insert({
        user_id: user.id,
        subject_id: selectedDeck.subject_id,
        duracion_segundos: studyTime,
        tipo: "flashcard",
        completada: true,
      });
  };

  const startStudying = (deck: Deck) => {
    setSelectedDeck(deck);
    fetchCards(deck.id);
    setIsStudying(true);
    setStudyTime(0);
    setCurrentCardIndex(0);
    setIsFlipped(false);
  };

  const stopStudying = async () => {
    await saveStudySession();
    toast.success(`Sesión guardada: ${formatTime(studyTime)}`);
    setIsStudying(false);
    setSelectedDeck(null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const filteredDecks = decks.filter(deck => {
    const matchesYear = !selectedYear || deck.subject?.año === selectedYear;
    const matchesSubject = !selectedSubject || deck.subject_id === selectedSubject;
    return matchesYear && matchesSubject;
  });

  const filteredSubjects = subjects.filter(s => !selectedYear || s.año === selectedYear);

  // Study Mode View
  if (isStudying && selectedDeck && cards.length > 0) {
    const currentCard = cards[currentCardIndex];
    const progress = ((currentCardIndex + 1) / cards.length) * 100;

    return (
      <div className="p-4 lg:p-8 min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={stopStudying}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Salir
          </button>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-lg">
              <Clock className="w-4 h-4 text-neon-cyan" />
              <span className="font-mono text-neon-cyan">{formatTime(studyTime)}</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {currentCardIndex + 1} / {cards.length}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-2 bg-secondary rounded-full mb-8 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-neon-cyan to-neon-purple transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Flashcard */}
        <div className="max-w-2xl mx-auto perspective-1000">
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className={cn(
              "relative w-full aspect-[3/2] cursor-pointer transition-transform duration-500 preserve-3d",
              isFlipped && "rotate-y-180"
            )}
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Front */}
            <div 
              className="absolute inset-0 card-gamer rounded-2xl p-8 flex flex-col items-center justify-center backface-hidden"
              style={{ backfaceVisibility: "hidden" }}
            >
              <p className="text-xs text-muted-foreground mb-4">PREGUNTA</p>
              <p className="text-xl lg:text-2xl font-medium text-center">
                {currentCard.pregunta}
              </p>
              <p className="text-xs text-muted-foreground mt-8">Click para ver respuesta</p>
            </div>

            {/* Back */}
            <div 
              className="absolute inset-0 card-gamer rounded-2xl p-8 flex flex-col items-center justify-center bg-gradient-to-br from-neon-cyan/10 to-neon-purple/10 border-neon-cyan/30"
              style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
            >
              <p className="text-xs text-neon-cyan mb-4">RESPUESTA</p>
              <p className="text-xl lg:text-2xl font-medium text-center text-neon-cyan">
                {currentCard.respuesta}
              </p>
            </div>
          </div>
        </div>

        {/* Controls */}
        {isFlipped && (
          <div className="flex justify-center gap-4 mt-8 animate-fade-in">
            <button
              onClick={() => handleCardResult(false)}
              className="flex items-center gap-2 px-6 py-3 bg-neon-red/20 text-neon-red rounded-xl hover:bg-neon-red/30 transition-colors"
            >
              <X className="w-5 h-5" />
              No la sabía
            </button>
            <button
              onClick={() => handleCardResult(true)}
              className="flex items-center gap-2 px-6 py-3 bg-neon-green/20 text-neon-green rounded-xl hover:bg-neon-green/30 transition-colors"
            >
              <Check className="w-5 h-5" />
              ¡La sabía!
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl lg:text-3xl font-bold gradient-text">
            Flashcards
          </h1>
          <p className="text-muted-foreground mt-1">
            Estudia con tarjetas de memoria
          </p>
        </div>
        <button
          onClick={() => setShowNewDeckModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nuevo Mazo
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        {/* Year Filter */}
        <div className="flex gap-2">
          <button
            onClick={() => { setSelectedYear(null); setSelectedSubject(null); }}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all",
              !selectedYear ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-secondary/80"
            )}
          >
            Todos
          </button>
          {[1, 2, 3, 4].map(year => (
            <button
              key={year}
              onClick={() => { setSelectedYear(year); setSelectedSubject(null); }}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                selectedYear === year ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-secondary/80"
              )}
            >
              Año {year}
            </button>
          ))}
        </div>

        {/* Subject Filter */}
        {selectedYear && (
          <select
            value={selectedSubject || ""}
            onChange={(e) => setSelectedSubject(e.target.value || null)}
            className="px-4 py-2 bg-secondary rounded-lg text-sm border border-border"
          >
            <option value="">Todas las materias</option>
            {filteredSubjects.map(subject => (
              <option key={subject.id} value={subject.id}>
                {subject.nombre}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Decks Grid */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="card-gamer rounded-xl p-6 animate-pulse">
              <div className="h-6 bg-secondary rounded mb-4" />
              <div className="h-4 bg-secondary rounded w-3/4" />
            </div>
          ))}
        </div>
      ) : filteredDecks.length === 0 ? (
        <div className="text-center py-16">
          <Layers className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground mb-4">No hay mazos creados</p>
          <button
            onClick={() => setShowNewDeckModal(true)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium"
          >
            Crear primer mazo
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDecks.map(deck => (
            <div key={deck.id} className="card-gamer rounded-xl p-6 group">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center">
                  <Layers className="w-6 h-6 text-background" />
                </div>
                <span className="text-xs px-2 py-1 bg-secondary rounded-lg">
                  Año {deck.subject?.año}
                </span>
              </div>
              
              <h3 className="font-display font-semibold text-lg mb-1">{deck.nombre}</h3>
              <p className="text-sm text-muted-foreground mb-4">{deck.subject?.nombre}</p>
              
              {/* Progress Animation */}
              <div className="relative h-2 bg-secondary rounded-full mb-4 overflow-hidden">
                <div 
                  className="absolute inset-0 bg-gradient-to-r from-neon-cyan to-neon-purple animate-shimmer"
                  style={{ width: `${Math.min((deck.total_cards / 10) * 100, 100)}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mb-4">{deck.total_cards} tarjetas</p>

              <div className="flex gap-2">
                <button
                  onClick={() => startStudying(deck)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  <Play className="w-4 h-4" />
                  Estudiar
                </button>
                <button
                  onClick={() => { setSelectedDeck(deck); fetchCards(deck.id); setShowNewCardModal(true); }}
                  className="px-3 py-2 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Deck Modal */}
      <Dialog open={showNewDeckModal} onOpenChange={setShowNewDeckModal}>
        <DialogContent className="sm:max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-display gradient-text">Nuevo Mazo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Año</label>
              <div className="flex gap-2 mt-2">
                {[1, 2, 3, 4].map(year => (
                  <button
                    key={year}
                    onClick={() => { setSelectedYear(year); setSelectedSubject(null); }}
                    className={cn(
                      "flex-1 py-2 rounded-lg text-sm font-medium transition-all",
                      selectedYear === year ? "bg-primary text-primary-foreground" : "bg-secondary"
                    )}
                  >
                    Año {year}
                  </button>
                ))}
              </div>
            </div>

            {selectedYear && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Materia</label>
                <select
                  value={selectedSubject || ""}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full mt-2 px-4 py-3 bg-secondary rounded-xl border border-border"
                >
                  <option value="">Seleccionar materia</option>
                  {filteredSubjects.map(subject => (
                    <option key={subject.id} value={subject.id}>
                      {subject.nombre}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-muted-foreground">Nombre del mazo</label>
              <input
                type="text"
                value={newDeckName}
                onChange={(e) => setNewDeckName(e.target.value)}
                placeholder="Ej: Unidad 1 - Conceptos básicos"
                className="w-full mt-2 px-4 py-3 bg-secondary rounded-xl border border-border"
              />
            </div>

            <button
              onClick={createDeck}
              disabled={!selectedSubject || !newDeckName.trim()}
              className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-medium disabled:opacity-50"
            >
              Crear Mazo
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* New Card Modal */}
      <Dialog open={showNewCardModal} onOpenChange={setShowNewCardModal}>
        <DialogContent className="sm:max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-display gradient-text">Nueva Tarjeta</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Pregunta</label>
              <textarea
                value={newCardQuestion}
                onChange={(e) => setNewCardQuestion(e.target.value)}
                placeholder="Escribe la pregunta..."
                rows={3}
                className="w-full mt-2 px-4 py-3 bg-secondary rounded-xl border border-border resize-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Respuesta</label>
              <textarea
                value={newCardAnswer}
                onChange={(e) => setNewCardAnswer(e.target.value)}
                placeholder="Escribe la respuesta..."
                rows={3}
                className="w-full mt-2 px-4 py-3 bg-secondary rounded-xl border border-border resize-none"
              />
            </div>

            <button
              onClick={createCard}
              disabled={!newCardQuestion.trim() || !newCardAnswer.trim()}
              className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-medium disabled:opacity-50"
            >
              Agregar Tarjeta
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
