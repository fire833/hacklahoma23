import { useContext, useState } from "react";
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
                    let lastvalueis1 = graph.graph[graph.active_node_id].value === 1;
                    if(!lastvalueis1) throw "The list should go from 20 to 1";
                    return true;
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
                    let lastvalueis1 = graph.graph[graph.active_node_id].value === 1;
                    if(!lastvalueis1) throw "The list should go from 20 to 1";
                    return true;
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
                    let lastvalueis1 = graph.graph[graph.active_node_id].value === 1;
                    if(!lastvalueis1) throw "The list should go from 20 to 1";
                    return true;
                },
            ],
        },
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
                You decide to write a program for your Wookie friend, which will count down from any number they please. 
            </p>
            <h4>Goals/Objectives</h4>
            <p>
                The memory graph at the start of the program will consist of a single node with value N.
                Your program should create a linked list off of this node, with values N-1, N-2, N-3, and so on,
                all the way down to 1.
            </p>
            <p>
                To do this for any number, you'll need to be able to loop.
                Thankfully, looping in this galaxy's assembly language is similar to earth's.
            </p>
            <p>
                <i>A line of code may start with a label</i>.
                For example:
            </p>
            <p>
                <b>loop: SET 15</b> <br></br>
                <b>GOTO loop: </b>
                <span color="rgba(0, 0, 0, 0.5)!important" style={{fontWeight: "light!important!important"}}># Note the trailing colon. It is always part of the loop name</span>
            </p>
            <p>
                That example will infinitely set the current node's value to 15.
                Infinite looping is probably not what we want, so we need a way to stop somehow.
                The <b>GOTO_IF_NEQ</b> command can do this.
                The command takes a label and two integers as parameters, and if the integers are not equal,
                the program will jump to that label. (The EXIT_IF_EQ command does the opposite)
            </p>    
            <p>
                The last function you'll find useful is the <b>$VALUE</b> function,
                which returns the value of the active node.
            </p>
            <p>
                You'll need to put all of those pieces together to complete your wookie friend's counting program.
                The following snippet is a good starting point, but it will need some tweaking to handle the root node 
                correctly, who will only have one neighbor (so TRAVERSE 1) won't work.
            </p>
            <b>loop: BUBBLE $MATH_ADD $VALUE -1</b><br/>
            <b>TRAVERSE 1</b><br/>
            <b>GOTO_IF_NEQ loop: $VALUE 1</b><br/>
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