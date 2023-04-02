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
        {/* <div id="header_cvs" style={{
            position: "absolute",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            zIndex: "-1",
            pointerEvents: "none"
        }}>
            <BackgroundCanvas uid={"headercvs"}></BackgroundCanvas>
        </div> */}
        <b>Escape from A-77</b>
        <a className={levelStyles.homeButton} onClick={() => { navigate("/"); }}>&lt; Return to menu</a>
    </div>
}