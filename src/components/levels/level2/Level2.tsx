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
import { ReferenceTab } from "../tabs/reference/reference";
import { EditorTab } from "../tabs/editor/editor";

const LEVEL_NUM = 2;

// SOLUTION:
//
// BUBBLE 1
// TRAVERSE 0
// BUBBLE 2
// TRAVERSE 1
// BUBBLE 3
// TRAVERSE 1

export function Level2() {

    const test_cases: TestCase[] = [
        {
            initial_graph_provider: () => {
                return new GraphContext({"a": new GraphNode("a", 0)}, "a");
            },
            solution_predicates: [
                (graph) => {
                    if (!(Object.values(graph.graph).length === 3)) throw "Graph must have 3 total nodes.";
                    return (graph.root_node_id === "a" && graph.graph[graph.root_node_id].value === 0 && graph.graph[graph.active_node_id].value === 3)                    
                },
            ],
        },
    ];
    const [loadedTestCase, setLoadedTestCase] = useState(0);


    const [correctTestCases, setCorrectTestCases] = useState<number[]>([]);

    function completeCase(number: number) {
        setCorrectTestCases([...correctTestCases, number]);
    }


    const tabs: Tab[] = [{
        tab_kind: "react_node",
        tab_name: "📒 Level 2",
        node: <div style={{ padding: "2%" }}>
            <h1>Level 2 - Teaching Counting</h1>
            <p>
                As you reach the lunch room, you come across a Wookie from the far reaches of the galaxy. He comes up to you and begins
                to ask you of how numbers work and how counting works, as arithmetic is fundamentally different within the far reaches 
                of the galaxy.
            </p>
            <p>
                You decide to give your Wookie friend a quick tutorial on counting on your computer. You open up a program and begin to 
                show him how to count with the Arabic numerals.
            </p>
            <h4>Goals/Objectives</h4>
            <p>
                The goal for this challenge is to create a linked list of numbers within your graph structure, starting from 0, and going up to 3.
                You can implement this using the <b>BUBBLE</b> and <b>TRAVERSE</b> instructions. You can follow a pattern similar to
            </p>
            <b>BUBBLE N</b> <br/>
            <b>TRAVERSE 0</b> <br/>
            <p>
                Where N is the number you wish to have within your next node, which should be currentNode + 1. Within your program terminal, and 
                try and run it. If your graph pane lights up green, then the program ran successfully, and your Wookie friend has a new appreciation
                for our counting system!
            </p>
        </div>
    }, EditorTab,
    {
        tab_kind: "react_node",
        tab_name: "🧪 Test Cases",
        node: <div style={{ padding: "1em" }}>
            {test_cases.map((e, ind) => <div>
                <TestCaseLoader activate={() => setLoadedTestCase(ind)} index={ind} testCase={e} isActive={loadedTestCase === ind} isComplete={correctTestCases.indexOf(ind) !== -1}></TestCaseLoader>
            </div>)}
        </div>
    }, ReferenceTab
    ];

    return <Level levelIndex={LEVEL_NUM - 1}  completeCase={completeCase} completedTestCased={correctTestCases} tabs={tabs} loadedTestCase={loadedTestCase} setLoadedTestCase={setLoadedTestCase} test_cases={test_cases}></Level>
}