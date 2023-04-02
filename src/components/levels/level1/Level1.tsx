import { useState } from "react";
import EditorPane from "../../editor/editor_pane";
import ResultsPane from "../../results/results_pane";
import { editor } from "monaco-editor";
import { GraphContext, GraphNode, SerializerKey } from "../../lang/graph";
import { useMonaco } from "@monaco-editor/react";
import { compile } from "../../lang/lang";
import levelStyles from "../levels.module.css";
import { LevelHeader } from "../LevelHeader";
import { Level, Tab } from "../level/Level";

const LEVEL_NUM = 1;
const LUNCH_TIME = 1200

export function Level1() {
    const tabs: Tab[] = [{
        tab_kind: "react_node",
        tab_name: "Level 1",
        node: <div style={{ padding: "2%" }}>
            <h1>Level 1 - Lunchtime</h1>
            <p>
                You wake up for another morning of imprisonment in the intergalactic prison A-77. You have noticed for the last
                few days that the countdown timer above your cell door always drops down to zero before your door unlocks and you
                are able to go to recess/meals.
            </p>
            <p>
                You wonder if there is a way to modify the timer in order to get out of your cell
                early. As you are rooting around in your computer, you find a program called <i>tedit</i> (your initial program state
                to the right). You wonder if you can set the primary register (the root/active node) to 0, then maybe your door will
                open.
            </p>
            <h4>Goals/Objectives</h4>
            <p>
                The goal for this challenge is to assign values to nodes with the <i>SET</i> instruction. You can do this by writing
            </p>
            <b>SET 0</b>
            <p>
                Within your program terminal, and try and run it. If your graph pane lights up green, then you the register was successfully
                set to zero and your door opened!
            </p>
        </div>
    }, {
        tab_kind: "editor",
        tab_name: "Editor"
    }]

    return <Level tabs={tabs} test_cases={[
        {
            initial_graph_provider: () => new GraphContext({
                "a": new GraphNode("a", 12700, [])
            }, "a"),
            solution_predicates: [
                (graph) => {
                    if (!(Object.values(graph.graph).length === 1)) throw "Graph must have only one node";
                    let only_node = graph.graph[Object.keys(graph.graph)[0]];
                    return only_node.value === LUNCH_TIME;
                }
            ]
        }
    ]}></Level>
}