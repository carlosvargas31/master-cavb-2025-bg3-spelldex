import { useRef } from "react";
import { useClickOutsideEffect } from "src/hooks/use-click-outside";

import type { Spell } from "src/models/spell";
import { damageTypeIcons } from "src/models/damage-types";

import styles from "./spell-tooltip.module.css";

type Props = {
  spell: Spell;
  position: { x: number; y: number };
  onClose: () => void;
};

export function SpellTooltip({ spell, position, onClose }: Props) {
  const tooltipRef = useRef<HTMLDivElement>(null);

  useClickOutsideEffect({
    ref: tooltipRef,
    cb: onClose,
  });

  const getLevelText = (level: number) => {
    if (level === 0) return "Cantrip";
    return `Level ${level}`;
  };

  const getDamageIcons = (damage: Spell["damage"]) => {
    if (!damage || damage.length === 0) return [];
    
    const uniqueDamageTypes = [...new Set(damage.map(d => d.damageType))];
    return uniqueDamageTypes
      .map(type => damageTypeIcons[type as keyof typeof damageTypeIcons])
      .filter(Boolean);
  };

  return (
    <div
      ref={tooltipRef}
      className={styles.tooltip}
      style={{
        left: position.x,
        top: position.y,
      }}
      role="tooltip"
      aria-live="polite"
    >
      <div className={styles.header}>
        <h3 className={styles.name}>{spell.name}</h3>
        <span className={styles.level}>{getLevelText(spell.level)}</span>
        {getDamageIcons(spell.damage).length > 0 && (
          <div className={styles.damageIcons}>
            {getDamageIcons(spell.damage).map((icon, index) => (
              <span key={index} className={styles.damageIcon}>
                {icon}
              </span>
            ))}
          </div>
        )}
      </div>
      <button
        className={styles.closeButton}
        onClick={onClose}
        aria-label="Close tooltip"
        type="button"
      >
        ✕
      </button>
    </div>
  );
}
