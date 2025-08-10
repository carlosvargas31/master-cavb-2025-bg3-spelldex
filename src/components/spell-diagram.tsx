import c from "classnames";
import { useState } from "react";

import { Spell } from "./spell";
import { SpellTooltip } from "./spell-tooltip";

import { useSpellNavigation } from "src/hooks/use-spell-navigation";

import type { SpellId } from "src/models/spell";
import type { Spell as SpellType } from "src/models/spell";
import type { ClassId, SellsByClass } from "src/models/character-class";

import spells from "src/data/spells.json";
import styles from "./spell-diagram.module.css";
import spellsByClass from "src/data/spells-by-class.json";

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
  const [tooltipData, setTooltipData] = useState<{
    spell: SpellType;
    position: { x: number; y: number };
  } | null>(null);
  
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

  const detailedSpells = selectedClass 
    ? (spells as SpellType[]).filter(spell => isSpellDetailed(spell))
    : [];

  const { onKeyDown, setSpellRef } = useSpellNavigation({
    selectedClass,
    detailedSpells,
  });

  const handleTooltipClick = (spell: SpellType, position: { x: number; y: number }) => {
    setTooltipData({ spell, position });
  };

  const handleTooltipClose = () => {
    setTooltipData(null);
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
                    ref={setSpellRef(spellIndex)}
                    spell={spell}
                    highlighted={isSpellHighlighted(spell)}
                    detailed={isDetailed}
                    onTooltipClick={isDetailed ? handleTooltipClick : undefined}
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
                    onTooltipClick={isDetailed ? handleTooltipClick : undefined}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
      
      {tooltipData && (
        <SpellTooltip
          spell={tooltipData.spell}
          position={tooltipData.position}
          onClose={handleTooltipClose}
        />
      )}
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
