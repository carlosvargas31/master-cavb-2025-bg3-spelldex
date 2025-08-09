import c from "classnames";
import { useEffect, useRef, useState } from "react";
import spellsByClass from "src/data/spells-by-class.json";
import spells from "src/data/spells.json";
import { Spell } from "./spell";

import type { ClassId, SellsByClass } from "src/models/character-class";
import type { SpellId } from "src/models/spell";
import type { Spell as SpellType } from "src/models/spell";
import styles from "./spell-diagram.module.css";

type Props = {
  selectedClass: ClassId | undefined;
  highlightedClass: ClassId | undefined;
  background?: boolean;
};

export function SpellDiagram({
  highlightedClass,
  selectedClass,
  background,
}: Props) {
  const spellsByLevel = groupSpellsByLevel(spells as SpellType[]);
  const status = selectedClass
    ? "selected"
    : highlightedClass
    ? "highlighted"
    : "none";

  const currentClass = selectedClass || highlightedClass;
  const highlightedSpells = currentClass
    ? new Set((spellsByClass as SellsByClass)[currentClass])
    : new Set<SpellId>();

  const isSpellHighlighted = (spell: SpellType) =>
    highlightedClass && highlightedSpells.has(spell.id);

  const isSpellDetailed = (spell: SpellType) =>
    selectedClass && highlightedSpells.has(spell.id);

  // Referencias a todos los hechizos que están en detalle
  const spellRefs = useRef<HTMLElement[]>([]);
  const [focusedSpellIndex, setFocusedSpellIndex] = useState<number>(-1);

  // Obtener lista plana de hechizos detallados para navegación
  const detailedSpells = selectedClass 
    ? (spells as SpellType[]).filter(spell => isSpellDetailed(spell))
    : [];

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

  return (
    <div
      className={c(
        styles.spellDiagram,
        background && styles.background,
        status === "selected" && styles.selected,
        status === "highlighted" && styles.highlighted
      )}
      onKeyDown={onKeyDown}
      tabIndex={selectedClass ? 0 : -1}
    >
      {Array.from({ length: 7 }, (_, level) => {
        const { firstHalf, secondHalf } = twoRows(spellsByLevel[level]);

        return (
          <div key={level} className={styles.levelGroup} data-level={level}>
            <div className={styles.row}>
              {firstHalf.map((spell, idx) => {
                const isDetailed = isSpellDetailed(spell);
                const spellIndex = isDetailed ? detailedSpells.findIndex(s => s.id === spell.id) : -1;
                
                return (
                  <Spell
                    key={`${level}-1-${idx}`}
                    ref={(el) => {
                      if (el && spellIndex >= 0) {
                        spellRefs.current[spellIndex] = el;
                      }
                    }}
                    spell={spell}
                    highlighted={isSpellHighlighted(spell)}
                    detailed={isDetailed}
                  />
                );
              })}
            </div>
            <div className={styles.row}>
              {secondHalf.map((spell, idx) => {
                const isDetailed = isSpellDetailed(spell);
                const spellIndex = isDetailed ? detailedSpells.findIndex(s => s.id === spell.id) : -1;
                
                return (
                  <Spell
                    key={`${level}-2-${idx}`}
                    ref={(el) => {
                      if (el && spellIndex >= 0) {
                        spellRefs.current[spellIndex] = el;
                      }
                    }}
                    spell={spell}
                    highlighted={isSpellHighlighted(spell)}
                    detailed={isDetailed}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function twoRows(spells: SpellType[] = []) {
  const half = Math.ceil(spells.length / 2);
  return {
    firstHalf: spells.slice(0, half),
    secondHalf: spells.slice(half),
  };
}

function groupSpellsByLevel(spells: SpellType[]) {
  return spells.reduce<Record<number, SpellType[]>>((acc, spell) => {
    if (!acc[spell.level]) {
      acc[spell.level] = [];
    }
    acc[spell.level].push(spell);
    return acc;
  }, {});
}
