import { BackgroundCanvas } from "../BackgroundCanvas";
import styles from "./LevelSelect.module.css"
import { useNavigate } from 'react-router-dom'
import bgurl from "../../assets/aurora.jpeg";
import { useContext } from "react";
import { AppContext } from "../../context/context";

export const NUM_LEVELS = 6;

export function LevelSelect() {
    const navigate = useNavigate();

    let appContext = useContext(AppContext);

    console.log("Rendering buttons with completedLevels", appContext.completedLevels);
    return <div className={styles.levelSelectWrapper} style={{
        backgroundImage: `url(${bgurl})`,
        backgroundSize: "cover",
        color: "rgba(255, 255, 255, 0.9)"
    }}>
        <h1 style={{
            fontWeight: 900,
            fontSize: "4em",
            textShadow: `0px 0px 25px white`
        }}>🌌 The Escape From A-77 🌌</h1>
        <h2>Level Select</h2>

        <div className={styles.buttonGrid}>
            {new Array(NUM_LEVELS).fill(0).map((_, ind) => {
                return <button className={appContext.completedLevels.indexOf(ind) !== -1 ? styles.complete : ""} key={ind} onClick={() => {
                    navigate(`/level${ind + 1}`);
                }}>{ind + 1}</button>
            })}
        </div>

    </div>

}