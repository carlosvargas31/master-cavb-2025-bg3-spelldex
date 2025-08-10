import { useRef } from "react";
import { useClickOutsideEffect } from "src/hooks/use-click-outside";

import type { Spell } from "src/models/spell";

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
