
import styles from "./debug_bar.module.css";

export interface DebugBarProps {
    onCompile?: () => void,
    onRun?: () => void,
    onPause?: () => void
    onResume?: () => void,
    setExecutionDelay?: (delay: number) => void,
    onStep?: () => void,
}

export default function DebugBar(props: DebugBarProps) {
    return (
        <div className={styles.debug} draggable={true}
            onDragStart={() => { }}
            onDrag={() => { }}
            onDragEnd={() => { }}
        >
            <button onClick={props.onCompile}>Compile stuff</button>
            <button onClick={props.onRun}>Run</button>
            <button onClick={props.onPause}>Pause</button>
            <button onClick={props.onRun}>Resume</button>
            <button onClick={props.onStep}>Step</button>
            <input type="range" onChange={(e) => {
                if (props.setExecutionDelay) {
                    props.setExecutionDelay(parseInt(e.currentTarget.value));
                }
            }} defaultValue={50}></input>
        </div>
    )
}
