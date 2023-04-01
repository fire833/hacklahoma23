import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import styles from './App.module.css'
import Editor from './components/editor/editor_pane'
import ResultsPane from './components/results/results_pane'
import EditorPane from './components/editor/editor_pane'
import { useMonaco } from '@monaco-editor/react'
import { editor, languages } from 'monaco-editor'
import { LANG_COMPLETIONS, LANG_DEF, LANG_HOVER, LANG as LANG_NAME, compile, run } from './components/lang/lang'
import { GraphContext, GraphNode, GraphNodeID, SerializerKey } from './components/lang/graph'

function App() {
  const [count, setCount] = useState(0);


  const [mountedEditor, setEditor] = useState<editor.IStandaloneCodeEditor | null>(null);

  const [displayedGraph, setDisplayedGraph] = useState<GraphContext | null>(null);
  const [graphSerializer, setGraphSerializer] = useState<SerializerKey>("bfs");

  const monacoConst = useMonaco();


  useEffect(() => {
    if (monacoConst) {
      monacoConst.languages.register({
        id: LANG_NAME
      });
      let dispose_tokens = monacoConst.languages.setMonarchTokensProvider(LANG_NAME, LANG_DEF);
      let dispose_completions = monacoConst.languages.registerCompletionItemProvider(LANG_NAME, LANG_COMPLETIONS)
      let dispose_hover = monacoConst.languages.registerHoverProvider(LANG_NAME, LANG_HOVER);
      return () => {
        dispose_completions.dispose();
        dispose_tokens.dispose();
        dispose_hover.dispose();
      }
    }
  }, [monacoConst]);

  return <>
    <div className={styles.appWrapper}>

      <EditorPane
        onMount={(e) => setEditor(e)}
        onChange={(e) => { }}
      ></EditorPane>
      <ResultsPane graph={displayedGraph} serializer={GraphContext.serializers[graphSerializer]} onCompile={() => {
        if (!mountedEditor) throw "OnCompile called with no editor";
        if (!monacoConst) throw "OnCompile called without monaco";
        let program = compile(mountedEditor.getValue());

        run(program, {
          instruction_pointer: 0,
          graph_context: new GraphContext({
            "a": new GraphNode("a", 0, ["b", "c"]),
            "b": new GraphNode("b", 1, ["a"]),
            "c": new GraphNode("c", 5, ["a"])
          }, "a")
        }, setDisplayedGraph);

      }} />
    </div>
  </>
}

export default App
