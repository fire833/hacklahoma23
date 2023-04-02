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

const LEVEL_NUM = 3;

// SOLUTION:
// 
// BUBBLE $MATH_ADD $VALUE -1
// TRAVERSE 0
// loop: BUBBLE $MATH_ADD $VALUE -1
// TRAVERSE 1
// GOTO_IF_NEQ loop: $VALUE 0
// EXIT_IF_EQ $VALUE 0

export function Level3() {

    const test_cases: TestCase[] = [
        {
            initial_graph_provider: () => {
                return new GraphContext({"a": new GraphNode("a", 20)}, "a");
            },
            solution_predicates: [
                (graph) => {
                    if (!(Object.values(graph.graph).length === 20)) throw "Graph must have 20 nodes";
                    return (graph.graph[graph.root_node_id].value === 20 && graph.graph[graph.active_node_id].value === 0)
                },
            ],
        },
        {
            initial_graph_provider: () => {
                return new GraphContext({"a": new GraphNode("a", 7)}, "a");
            },
            solution_predicates: [
                (graph) => {
                    if (!(Object.values(graph.graph).length === 7)) throw "Graph must have 7 nodes";
                    return (graph.graph[graph.root_node_id].value === 7 && graph.graph[graph.active_node_id].value === 0)
                },
            ],
        },
        {
            initial_graph_provider: () => {
                return new GraphContext({"a": new GraphNode("a", 16)}, "a");
            },
            solution_predicates: [
                (graph) => {
                    if (!(Object.values(graph.graph).length === 16)) throw "Graph must have 16 nodes";
                    return (graph.graph[graph.root_node_id].value === 16 && graph.graph[graph.active_node_id].value === 0)
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
        tab_name: "📒 Level 3",
        node: <div style={{ padding: "2%" }}>
            <h1>Level 3 - Teaching Arbitrary Counting</h1>
            <p>
                Your Wookie friend is mighty impressed with your arithmetic skills on your computer, but he has another question for you. He
                wants to see how to count to any number given at the start of your program. He sees potential for spreading this information to
                his intergalactic Jawa herding friends for herding their collections of Jawas. But, he also says his friends would prefer to count
                <i> downwards</i>.
            </p>
            <p>
                You decide to show your Wookie friend how to loop and create linked lists of arbitrarily-sized numbers decrementing from N to 0.
            </p>
            <h4>Goals/Objectives</h4>
            <p>
                The goal for this challenge is to create a arbitrarily-large linked list of numbers within your graph structure, starting from N, 
                and reducing to 0 using loop semantics. You can implement this using the <b>BUBBLE</b> and <b>TRAVERSE</b> instructions similar to before,
                but you will also add on using labels and <b>GOTO_IF_NEQ</b> to conditionally jump and create new children. It is important to note that
                N will never be smaller than 5, but never larger than 50. You can follow a looping pattern similar to below to complete this challenge:
            </p>
            <b>loop: BUBBLE $MATH_ADD $VALUE -1</b> <br/>
            <b>TRAVERSE 1</b> <br/>
            <b>GOTO_IF_NEQ $VALUE 0</b> <br/>
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

    return <Level completeCase={completeCase} completedTestCased={correctTestCases} tabs={tabs} loadedTestCase={loadedTestCase} setLoadedTestCase={setLoadedTestCase} test_cases={test_cases}></Level>
}