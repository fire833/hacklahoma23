
import { useState } from "react";
import styles from "./debug_bar.module.css";

export interface DebugBarProps {
    onCompile?: () => void,
    onPlay?: () => void,
    onPause?: () => void
    setExecutionDelay?: (delay: number) => void,
    onStep?: () => void,
}

export default function DebugBar(props: DebugBarProps) {

    // // state for managing where the debug bar lives in the world.
    // const [xCoord, setX] = useState<number>(0);
    // const [yCoord, setY] = useState<number>(0);

    // const [xOffSet, setXOffset] = useState<number>(0);
    // const [yOffSet, setYOffset] = useState<number>(0);

    // const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    //     let rect = e.currentTarget.getBoundingClientRect();
    //     if (e.type === "dragstart") {
    //         setXOffset(e.clientX - rect.x);
    //         setYOffset(e.clientY - rect.y);
    //         return;
    //     }

    //     setX(e.clientX - xOffSet);
    //     setY(e.clientY - yOffSet);
    // }

    return (
        <div className={styles.debug}
            // onDragStart={(e) => { handleDrag(e); e.dataTransfer.setDragImage(document.createElement("div"), xCoord, yCoord); }}
            // onDrag={handleDrag}
            // onDragEnd={handleDrag}
        >
            <button onClick={props.onCompile}>Compile</button>
            <button onClick={props.onPlay}>Play</button>
            <button onClick={props.onPause}>Pause</button>
            <button onClick={props.onStep}>Step</button>
            <input type="range" onChange={(e) => {
                if (props.setExecutionDelay) {
                    props.setExecutionDelay((100 - parseInt(e.currentTarget.value)) * 20);
                }
            }} defaultValue={50}></input>
        </div>
    )
}
