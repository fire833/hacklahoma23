import { useCallback, useContext, useState } from "react";
import EditorPane from "../../editor/editor_pane";
import ResultsPane from "../../results/results_pane";
import { editor } from "monaco-editor";
import { GraphContext, GraphNode, SerializerKey } from "../../lang/graph";
import { useMonaco } from "@monaco-editor/react";
import { TestCase, compile } from "../../lang/lang";
import levelStyles from "../levels.module.css";
import { LevelHeader } from "../LevelHeader";
import { Level, Tab } from "../level/Level";
import { TestCaseLoader } from "../TestCaseLoader";
import { ReferenceTab } from "../tabs/reference/reference";
import { EditorTab } from "../tabs/editor/editor";
import { AppContext } from "../../../context/context";

const LEVEL_NUM = 1;
const LUNCH_TIME = 1200;

// SOLUTION
//
// SET 1200

export function Level1() {

    const test_cases: TestCase[] = [
        {
            initial_graph_provider: () => new GraphContext({
                "a": new GraphNode("a", 12700, [])
            }, "a"),
            solution_predicates: [
                (graph) => {
                    if (!(Object.values(graph.graph).length === 1)) throw "Graph must have only one node";
                    let only_node = graph.graph[Object.keys(graph.graph)[0]];
                    let is_lunchtime = only_node.value === LUNCH_TIME;
                    if (!is_lunchtime) {
                        throw ("The graph's node must have value " + LUNCH_TIME);
                    }
                    return only_node.value === LUNCH_TIME;
                }
            ]
        },
        {
            initial_graph_provider: () => new GraphContext({
                "b": new GraphNode("b", 123, []),
            }, "b"),
            solution_predicates: [
                (graph) => {
                    if (!(Object.values(graph.graph).length === 1)) throw "Graph must have only one node";
                    let only_node = graph.graph[Object.keys(graph.graph)[0]];
                    let is_lunchtime = only_node.value === LUNCH_TIME;
                    if (!is_lunchtime) {
                        throw ("The graph's node must have value " + LUNCH_TIME);
                    }
                    return only_node.value === LUNCH_TIME;
                }
            ]
        },
        {
            initial_graph_provider: () => new GraphContext({
                "b": new GraphNode("b", 555, []),
            }, "b"),
            solution_predicates: [
                (graph) => {
                    if (!(Object.values(graph.graph).length === 1)) throw "Graph must have only one node";
                    let only_node = graph.graph[Object.keys(graph.graph)[0]];
                    let is_lunchtime = only_node.value === LUNCH_TIME;
                    if (!is_lunchtime) {
                        throw ("The graph's node must have value " + LUNCH_TIME);
                    }
                    return only_node.value === LUNCH_TIME;
                }
            ]
        }
    ];
    const [loadedTestCase, setLoadedTestCase] = useState(0);


    const [correctTestCases, setCorrectTestCases] = useState<number[]>([]);

    const context = useContext(AppContext);

    function completeCase(number: number) {
        let newCorrectCases = [...correctTestCases, number];
        console.log("Calling completeCase");
        
        setCorrectTestCases(newCorrectCases);
        if(Array.from(new Set(newCorrectCases)).length === test_cases.length) {
            context.setCompletedLevels([...context.completedLevels, LEVEL_NUM - 1]);
            console.log("Finished all cases, updating context!");
            
        }
    }


    const tabs: Tab[] = [{
        tab_kind: "react_node",
        tab_name: "📒 Level 1",
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
                to the right). You wonder if you can set the primary register (the root/active node) to 1200, then maybe your door will
                open.
            </p>
            <h4>Goals/Objectives</h4>
            <p>
                The goal for this challenge is to assign values to nodes with the <i>SET</i> instruction. You can do this by writing
            </p>
            <b>SET 1200</b>
            <p>
                Within your program terminal, and try and run it. If your graph pane lights up green, then you the register was successfully
                set to zero and your door opened!
            </p>
        </div>
    }, EditorTab,
    {
        tab_kind: "react_node",
        tab_name: "🧪 Test Cases",
        node: <div style={{ paddingLeft: "1em" }}>
                {test_cases.map((e, ind) => <div>
                    <TestCaseLoader activate={() => setLoadedTestCase(ind)} index={ind} testCase={e} isActive={loadedTestCase === ind} isComplete={correctTestCases.indexOf(ind) !== -1}></TestCaseLoader>
                </div>)}
            </div>
    },
        ReferenceTab
    ];

    return <Level levelIndex={LEVEL_NUM - 1} completeCase={completeCase} completedTestCased={correctTestCases} tabs={tabs} loadedTestCase={loadedTestCase} setLoadedTestCase={setLoadedTestCase} test_cases={test_cases}></Level>
}