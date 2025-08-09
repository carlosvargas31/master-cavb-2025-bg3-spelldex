import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ClassGrid } from "src/components/class-grid";
import { SpellDiagram } from "src/components/spell-diagram";

import type { ClassId } from "src/models/character-class";

import styles from "./home.module.css";

export function SpellClass() {
  const { classId } = useParams<{ classId: string }>();
  const navigate = useNavigate();
  const [highlightedClass, setHighlightedClass] = useState<ClassId>();
  
  // Validar que el classId es válido
  const validClassIds: ClassId[] = ["bard", "cleric", "druid", "sorcerer", "warlock", "wizard"];
  const selectedClass = validClassIds.includes(classId as ClassId) ? classId as ClassId : undefined;

  // Si no es una clase válida, redirigir a home
  if (!selectedClass) {
    navigate("/");
    return null;
  }

  const background = "classGrid";

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (
      (event.key === "Escape" || event.key === "Backspace")
    ) {
      event.preventDefault();
      navigate("/");
      return;
    }
  };

  const handleClassClick = () => {
    // No hacer nada cuando se hace click en la clase ya seleccionada
    // o navegar de vuelta al home
    navigate("/");
  };

  return (
    <main className={styles.main} onKeyDown={onKeyDown}>
      <SpellDiagram
        highlightedClass={highlightedClass}
        selectedClass={selectedClass}
        background={false}
      />

      <ClassGrid
        selectedClass={selectedClass}
        background={background === "classGrid"}
        highlight={setHighlightedClass}
        onClick={handleClassClick}
      />
    </main>
  );
}
