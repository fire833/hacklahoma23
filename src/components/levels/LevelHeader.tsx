import { useEffect } from "react";
import levelStyles from "./levels.module.css"
import { useNavigate } from 'react-router-dom'
import {createNoise2D} from "simplex-noise";
import { BackgroundCanvas } from "../BackgroundCanvas";


export function LevelHeader() {
    const navigate = useNavigate();

    return <div className={levelStyles.levelHeader} style={{position: "relative"}}>
        <div id="header_cvs" style={{
            position: "absolute",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            zIndex: "-1",
            pointerEvents: "none"
        }}>
            <BackgroundCanvas uid={"headercvs"}></BackgroundCanvas>
        </div>
        <b>Escape from A-77</b>
        <button className={levelStyles.homeButton} onClick={() => { navigate("/"); }}>Return to menu</button>
    </div>
}