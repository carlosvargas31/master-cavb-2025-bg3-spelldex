import c from "classnames";
import spellsByClass from "src/data/spells-by-class.json";
import spells from "src/data/spells.json";
import { useSpellNavigation } from "src/hooks";
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

  // Obtener lista plana de hechizos detallados para navegación
  const detailedSpells = selectedClass 
    ? (spells as SpellType[]).filter(spell => isSpellDetailed(spell))
    : [];

  // Usar el hook personalizado para la navegación
  const { onKeyDown, setSpellRef } = useSpellNavigation({
    selectedClass,
    detailedSpells,
  });

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
                    ref={setSpellRef(spellIndex)}
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
                    ref={setSpellRef(spellIndex)}
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
