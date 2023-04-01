
import { useEffect } from "react";
import styles from "./results.module.css";
import * as graphviz from "d3-graphviz";

export const ResultsDiv = "results-div";

export interface ResultsProps {
    graph: string,
    onCompile?: () => void,
    onRun?: () => void,
    onResume?: () => void,
    setExecutionDelay?: (delay: number) => void,
    onStep?: () => void,
    onStepIn?: () => void,
    onStepOut?: () => void,
}

// Primary pane for viewing results.
export default function ResultsPane(props: ResultsProps) {

    useEffect(() => {
        graphviz.graphviz("#" + ResultsDiv).dot(props.graph).onerror(e => console.error(e)).render();
    });

    return (
        <div>
            <button onClick={props.onCompile}>Compile stuff</button>
            <button onClick={props.onRun}>Run your code</button>
            <button onClick={props.onRun}>Resume your code</button>
            <button onClick={props.onStep}>Step</button>
            <button onClick={props.onStepIn}>Step In</button>
            <button onClick={props.onStepOut}>Step Out</button>
            <input type="range" onChange={(e) => {
                if (props.setExecutionDelay) {
                    props.setExecutionDelay(parseInt(e.currentTarget.value));
                }
             }} defaultValue={50}></input>
            <div id={ResultsDiv} className={styles.results_div}/>
        </div>
    )
}
