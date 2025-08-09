import { useEffect, useRef, useState } from "react";

import type { ClassId } from "src/models/character-class";
import type { Spell } from "src/models/spell";

type UseSpellNavigationOptions = {
  selectedClass: ClassId | undefined;
  detailedSpells: Spell[];
};

type UseSpellNavigationReturn = {
  focusedSpellIndex: number;
  onKeyDown: (event: React.KeyboardEvent) => void;
  setSpellRef: (index: number) => (el: HTMLElement | null) => void;
};

export function useSpellNavigation({
  selectedClass,
  detailedSpells,
}: UseSpellNavigationOptions): UseSpellNavigationReturn {
  const spellRefs = useRef<HTMLElement[]>([]);
  const [focusedSpellIndex, setFocusedSpellIndex] = useState<number>(-1);

  // Limpiar referencias cuando cambia la clase seleccionada
  useEffect(() => {
    spellRefs.current = [];
    setFocusedSpellIndex(-1);
  }, [selectedClass]);

  // Auto-focus al primer hechizo cuando se selecciona una clase
  useEffect(() => {
    if (selectedClass && detailedSpells.length > 0 && focusedSpellIndex === -1) {
      setFocusedSpellIndex(0);
      setTimeout(() => {
        spellRefs.current[0]?.focus();
      }, 100);
    }
  }, [selectedClass, detailedSpells.length, focusedSpellIndex]);

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (!selectedClass || detailedSpells.length === 0) {
      return;
    }

    const { key } = event;
    
    if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Tab"].includes(key)) {
      return;
    }

    event.preventDefault();

    let newIndex = focusedSpellIndex;

    switch (key) {
      case "ArrowRight":
      case "Tab":
        if (!event.shiftKey) {
          newIndex = (focusedSpellIndex + 1) % detailedSpells.length;
        } else if (key === "Tab") {
          newIndex = focusedSpellIndex - 1 < 0 ? detailedSpells.length - 1 : focusedSpellIndex - 1;
        }
        break;
      case "ArrowLeft":
        newIndex = focusedSpellIndex - 1 < 0 ? detailedSpells.length - 1 : focusedSpellIndex - 1;
        break;
      case "ArrowDown":
        // Navegar a la siguiente fila (aproximadamente +6 hechizos por fila, pero varía)
        newIndex = Math.min(detailedSpells.length - 1, focusedSpellIndex + 6);
        break;
      case "ArrowUp":
        // Navegar a la fila anterior (aproximadamente -6 hechizos por fila, pero varía)
        newIndex = Math.max(0, focusedSpellIndex - 6);
        break;
    }

    if (newIndex !== focusedSpellIndex) {
      setFocusedSpellIndex(newIndex);
      spellRefs.current[newIndex]?.focus();
    }
  };

  const setSpellRef = (index: number) => (el: HTMLElement | null) => {
    if (el && index >= 0) {
      spellRefs.current[index] = el;
    }
  };

  return {
    focusedSpellIndex,
    onKeyDown,
    setSpellRef,
  };
}
