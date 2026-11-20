import styles from "./StepCurtain.module.css";

type Props = { steps?: number };

export default function StepCurtain({ steps = 4 }: Props) {
  return (
    <div className={styles.curtain} aria-hidden="true">
      {Array.from({ length: steps }, (_, i) => (
        <div key={i} className={styles.bar} data-bar />
      ))}
    </div>
  );
}