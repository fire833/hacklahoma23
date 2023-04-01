
import { useEffect } from "react";
import styles from "./results.module.css";
import * as graphviz from "d3-graphviz";

export const ResultsDiv = "results-div";

export interface ResultsProps {
    graph: string,
}

// Primary pane for viewing results.
export default function ResultsPane(props: ResultsProps) {

    useEffect(() => {
        graphviz.graphviz("#" + ResultsDiv).dot(props.graph).onerror(e => console.error(e)).render();
    });

    return (
        <div id={ResultsDiv} className={styles.results_div}/>
    )
}
