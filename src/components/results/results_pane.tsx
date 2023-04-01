
import { useEffect } from "react";
import styles from "./results.module.css";
import * as graphviz from "d3-graphviz";
import DebugBar from "./debug_bar";

export const ResultsDiv = "results-div";

export interface ResultsProps {
    graph: string | null,
    onCompile?: () => void,
    onRun?: () => void,
    onResume?: () => void,
    setExecutionDelay?: (delay: number) => void,
    onStep?: () => void,
}

// Primary pane for viewing results.
export default function ResultsPane(props: ResultsProps) {

    useEffect(() => {
        if(props.graph){    
            console.log("Updating graph with", props.graph);
            
            graphviz.graphviz("#" + ResultsDiv).dot(props.graph).onerror(e => console.error(e)).render();
        }
    });

    return (
        <div>
            <DebugBar onCompile={props.onCompile} onRun={props.onRun} onResume={props.onResume} onStep={props.onStep}/>
            <div id={ResultsDiv} className={styles.results_div} />
        </div>
    )
}
