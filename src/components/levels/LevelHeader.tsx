import { useContext, useEffect } from "react";
import levelStyles from "./levels.module.css"
import { useNavigate } from 'react-router-dom'
import {createNoise2D} from "simplex-noise";
import { BackgroundCanvas } from "../BackgroundCanvas";
import bgurl from "../../assets/aurora.jpeg"
import { AppContext } from "../../context/context";


interface LevelHeaderProps {
    levelIdx: number
}

export function LevelHeader(props: LevelHeaderProps) {
    const navigate = useNavigate();
    const context = useContext(AppContext);

    return <div className={levelStyles.levelHeader} style={{
        position: "relative",
        backgroundImage: `url(${bgurl})`,
        backgroundPosition: `center`,
        color: "white",
        textShadow: "0px 0px 15px white"
        }}>
        <b>Escape from A-77</b>

        <div>
            {context.completedLevels.indexOf(props.levelIdx) !== -1 && (
                <a style={{
                    marginRight: "2em",
                    cursor: "pointer",
                    textShadow: "0px 0px 15px white",
                    textDecoration: "underline"
                }}  
                onClick={() => { console.log("Navigating to", props.levelIdx+2) ;navigate(`/level${props.levelIdx + 2}`); }}
                >Next Level &gt;&gt; </a>
                )}

            <a className={levelStyles.homeButton} onClick={() => { navigate("/"); }}>&lt; Return to menu</a>
        </div>
    </div>
}