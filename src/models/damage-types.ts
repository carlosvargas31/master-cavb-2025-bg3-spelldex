export const damageTypeIcons = {
  "Acid": "🧪",           // Tubo de ensayo
  "Necrotic": "💀",       // Calavera
  "Thunder": "⚡",         // Rayo/trueno
  "Piercing": "🗡️",       // Espada
  "Force": "💫",          // Estrella brillante
  "Fire": "🔥",           // Fuego
  "Cold": "❄️",           // Copo de nieve
  "Lightning": "⚡",      // Rayo
  "Poison": "☠️",         // Calavera con huesos
  "Radiant": "✨",        // Brillo
  "Psychic": "🧠",        // Cerebro
  "Slashing": "⚔️",       // Espadas cruzadas
  "Bludgeoning": "🔨",    // Martillo
  "Weapon": "⚔️"          // Espadas (genérico)
} as const;

export type DamageType = keyof typeof damageTypeIcons;
