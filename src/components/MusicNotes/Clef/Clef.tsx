import styles from "../Note.module.css";

const Clef: React.FC = ({}) => {
  return (
    <div
      className={styles.noteContainer}
      style={{ gridRow: `E4`, gridColumn: 1 }}
    >
      <span className={styles.clef}>𝄞</span>
    </div>
  );
};

export default Clef;
