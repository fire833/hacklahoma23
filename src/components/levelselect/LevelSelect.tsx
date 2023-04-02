import { BackgroundCanvas } from "../BackgroundCanvas";
import styles from "./LevelSelect.module.css"
import { useNavigate } from 'react-router-dom'
import bgurl from "../../assets/aurora.jpeg";

export const NUM_LEVELS = 10;

export function LevelSelect() {
    const navigate = useNavigate();

    return <div className={styles.levelSelectWrapper} style={{
        backgroundImage: `url(${bgurl})`,
        backgroundSize: "100%",
        color: "rgba(255, 255, 255, 0.9)"
    }}>

        <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: "-1",
        }}>
            <BackgroundCanvas x_min={200} x_max={800} chunkiness={5} uid="splashcvs"></BackgroundCanvas>
        </div>
        <h1 style={{
            fontWeight: 900,
            fontSize: "4em",
            textShadow: `0px 0px 25px white`
        }}>🌌 The Escape From A-77 🌌</h1>
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