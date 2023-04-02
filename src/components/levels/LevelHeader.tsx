import { useEffect } from "react";
import levelStyles from "./levels.module.css"
import { useNavigate } from 'react-router-dom'
import {createNoise2D} from "simplex-noise";
import { BackgroundCanvas } from "../BackgroundCanvas";
import bgurl from "../../assets/aurora.jpeg"


export function LevelHeader() {
    const navigate = useNavigate();

    return <div className={levelStyles.levelHeader} style={{
        position: "relative",
        backgroundImage: `url(${bgurl})`,
        backgroundPosition: `center`,
        color: "white",
        textShadow: "0px 0px 15px white"
        }}>
        <b>Escape from A-77</b>
        <a className={levelStyles.homeButton} onClick={() => { navigate("/"); }}>&lt; Return to menu</a>
    </div>
}