import c from "classnames";
import { forwardRef, useEffect, useMemo, useState } from "react";
import upcastIcon from "src/assets/icons/other/upcast.png";

import type { Spell as SpellType } from "src/models/spell";

import styles from "./spell.module.css";

export const Spell = forwardRef<
  HTMLElement,
  {
    spell: SpellType;
    highlighted: boolean | undefined;
    detailed: boolean | undefined;
    onTooltipClick?: (spell: SpellType, position: { x: number; y: number }) => void;
  }
>(function Spell({ spell, highlighted, detailed, onTooltipClick }, ref) {
  const [selected, setSelected] = useState(false);

  const [showImage, setShowImage] = useState(false);
  const randomDuration = useMemo(() => (Math.random() + 0.5).toFixed(2), []);
  const randomDelay = useMemo(() => (Math.random() * 2 + 1).toFixed(2), []);

  const animatedSpellStyles = {
    "--randomDelay": randomDelay + "s",
    "--randomDuration": randomDuration + "s",
  } as React.CSSProperties;

  useEffect(
    function setShowImageWhenTransitionEnds() {
      if (detailed) {
        const transitionTime =
          (parseFloat(randomDuration) + parseFloat(randomDelay)) * 1000;

        const timer = setTimeout(() => {
          setShowImage(true);
        }, transitionTime);

        return () => {
          clearTimeout(timer);
          setShowImage(false);
        };
      } else {
        setShowImage(false);
      }
    },
    [detailed, randomDuration, randomDelay]
  );

  const onClick = (event: React.MouseEvent) => {
    if (!detailed) {
      return;
    }
    
    if (onTooltipClick) {
      const rect = event.currentTarget.getBoundingClientRect();
      const position = {
        x: Math.min(rect.left + rect.width / 2, window.innerWidth - 160), // Prevent overflow
        y: rect.top + rect.height + 8, // 8px offset below the spell
      };
      onTooltipClick(spell, position);
    } else {
      setSelected(!selected);
    }
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (!detailed) {
      return;
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      
      if (onTooltipClick) {
        const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
        const position = {
          x: Math.min(rect.left + rect.width / 2, window.innerWidth - 160), // Prevent overflow
          y: rect.top + rect.height + 8, // 8px offset below the spell
        };
        onTooltipClick(spell, position);
      } else {
        setSelected(!selected);
      }
    }
  };

  return (
    <article
      ref={ref}
      className={c(
        styles.spell,
        highlighted && !detailed && styles.highlighted,
        detailed && styles.detailed,
        detailed && selected && styles.selected,
      )}
      data-spell-id={spell.id}
      style={animatedSpellStyles}
      aria-label={spell.name}
      aria-detailed={detailed ? "true" : "false"}
      tabIndex={detailed ? 0 : -1}
      {...(detailed ? { onClick, onKeyDown } : {})}
    >
      {detailed && showImage && (
        <div className={styles.image}>
          <img src={spell.icon} alt={spell.name} className={styles.icon} />
          {spell.upcast && (
            <img src={upcastIcon} alt="upcast" className={styles.upcast} />
          )}
        </div>
      )}
    </article>
  );
});
