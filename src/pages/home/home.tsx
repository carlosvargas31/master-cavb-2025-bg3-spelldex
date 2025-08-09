import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClassGrid } from "src/components/class-grid";
import { SpellDiagram } from "src/components/spell-diagram";

import type { ClassId } from "src/models/character-class";

import styles from "src/pages/global.module.css";

export function Home() {
  const navigate = useNavigate();
  const [highlightedClass, setHighlightedClass] = useState<ClassId>();

  const handleClassClick = (classId: ClassId | undefined) => {
    if (classId) {
      navigate(`/${classId}`);
    }
  };

  return (
    <main className={styles.main}>
      <SpellDiagram
        highlightedClass={highlightedClass}
        selectedClass={undefined}
        background={true}
      />

      <ClassGrid
        background={false}
        highlight={setHighlightedClass}
        onClick={handleClassClick}
      />
    </main>
  );
}
