import levelStyles from "./levels.module.css"
import { useNavigate } from 'react-router-dom'

export function LevelHeader() {
    const navigate = useNavigate();

    return <div className={levelStyles.levelHeader}>
        <b>Escape from A-77</b>
        <button className={levelStyles.homeButton} onClick={() => { navigate("/"); }}>Return to menu</button>
    </div>
}