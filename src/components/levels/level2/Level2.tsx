import { useState } from "react";
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
import { ReferenceTab } from "../reference/reference";

const LEVEL_NUM = 2;

export function Level2() {

    const test_cases: TestCase[] = [
        {
            initial_graph_provider: () => new GraphContext({
                "a": new GraphNode("a", 12700, [])
            }, "a"),
            solution_predicates: [
                (graph) => {
                    return false
                }
            ]
        },
        {
            initial_graph_provider: () => new GraphContext({
                "b": new GraphNode("b", 123, []),
            }, "b"),
            solution_predicates: [
                (graph) => {
                    return false
                }
            ]
        },
        {
            initial_graph_provider: () => new GraphContext({
                "b": new GraphNode("b", 555, []),
            }, "b"),
            solution_predicates: [
                (graph) => {
                    return false
                }
            ]
        }
    ];
    const [loadedTestCase, setLoadedTestCase] = useState(0);


    const [correctTestCases, setCorrectTestCases] = useState<number[]>([]);

    function completeCase(number: number) {
        setCorrectTestCases([...correctTestCases, number]);
    }


    const tabs: Tab[] = [{
        tab_kind: "react_node",
        tab_name: "Level 1",
        node: <div style={{ padding: "2%" }}>
            <h1>Level 2 - Teaching Counting</h1>
            <p>
                As you reach the lunch room, you come across a Wookie from the far reaches of the galaxy. You have spoken with him 
                before, and he 
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
    },
    {
        tab_kind: "react_node",
        tab_name: "Test Cases",
        node: <div style={{ padding: "1em" }}>
            {test_cases.map((e, ind) => <div>
                <TestCaseLoader activate={() => setLoadedTestCase(ind)} index={ind} testCase={e} isActive={loadedTestCase === ind} isComplete={correctTestCases.indexOf(ind) !== -1}></TestCaseLoader>
            </div>)}
        </div>
    }, ReferenceTab
    ];

    return <Level completeCase={completeCase} completedTestCased={correctTestCases} tabs={tabs} loadedTestCase={loadedTestCase} setLoadedTestCase={setLoadedTestCase} test_cases={test_cases}></Level>
}