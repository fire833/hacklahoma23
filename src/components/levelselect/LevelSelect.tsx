import styles from "./LevelSelect.module.css"
import { useNavigate } from 'react-router-dom'

export const NUM_LEVELS = 10;

export function LevelSelect() {
    const navigate = useNavigate();

    return <div className={styles.levelSelectWrapper}>
        <h1>Escape From A-77</h1>
        <h2>Level Select</h2>

        <div className={styles.buttonGrid}>
            {new Array(NUM_LEVELS).fill(0).map((_, ind) => {
                return <button key={ind} onClick={() => {
                    navigate(`/level${ind + 1}`);
                }}>{ind + 1}</button>
            })}
        </div>

    </div>

}