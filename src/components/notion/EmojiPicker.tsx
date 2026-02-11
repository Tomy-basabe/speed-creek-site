import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import {
  tabeIcons,
  getIconCategories,
  TabeIconRenderer,
} from "./TabeIcons";

interface EmojiPickerProps {
  value: string;
  onChange: (iconId: string) => void;
}

export function EmojiPicker({ value, onChange }: EmojiPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const categories = useMemo(getIconCategories, []);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);

  const filteredIcons = useMemo(
    () => tabeIcons.filter((i) => i.category === selectedCategory),
    [selectedCategory]
  );

  return (
    <div className="relative inline-block">
      {/* Trigger button — shows current icon */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="notion-emoji-button"
        title="Cambiar icono"
      >
        <TabeIconRenderer iconId={value} size={40} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Picker panel */}
          <div
            className="absolute top-full left-0 mt-2 z-50 border rounded-xl shadow-xl p-3 w-80"
            style={{
              background: "hsl(var(--card))",
              borderColor: "hsl(var(--border))",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between mb-3 pb-2"
              style={{ borderBottom: "1px solid hsl(var(--border) / 0.5)" }}
            >
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "hsl(var(--muted-foreground))" }}>
                Iconos T.A.B.E.
              </span>
              <button
                onClick={() => {
                  onChange("book");
                  setIsOpen(false);
                }}
                className="text-xs px-2 py-0.5 rounded"
                style={{ color: "hsl(var(--muted-foreground))" }}
              >
                Reset
              </button>
            </div>

            {/* Category tabs */}
            <div className="flex gap-1 mb-3 overflow-x-auto pb-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "px-3 py-1.5 text-xs rounded-lg whitespace-nowrap transition-all font-medium",
                    selectedCategory === cat
                      ? "text-white shadow-md"
                      : "hover:bg-[hsl(var(--secondary))]"
                  )}
                  style={
                    selectedCategory === cat
                      ? {
                        background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary) / 0.7))",
                      }
                      : undefined
                  }
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Icon grid */}
            <div className="grid grid-cols-5 gap-2">
              {filteredIcons.map((icon) => (
                <button
                  key={icon.id}
                  onClick={() => {
                    onChange(icon.id);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "flex flex-col items-center gap-1 p-2 rounded-lg transition-all",
                    value === icon.id
                      ? "ring-2 ring-[hsl(var(--primary))]"
                      : "hover:bg-[hsl(var(--secondary))]"
                  )}
                  style={
                    value === icon.id
                      ? { background: "hsl(var(--primary) / 0.1)" }
                      : undefined
                  }
                  title={icon.name}
                >
                  <icon.component size={28} />
                  <span
                    className="text-[10px] truncate w-full text-center"
                    style={{ color: "hsl(var(--muted-foreground))" }}
                  >
                    {icon.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
