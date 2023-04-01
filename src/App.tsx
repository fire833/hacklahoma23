import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import styles from './App.module.css'
import Editor from './components/editor/editor_pane'
import ResultsPane from './components/results/results_pane'
import EditorPane from './components/editor/editor_pane'
import { useMonaco } from '@monaco-editor/react'
import { editor, languages } from 'monaco-editor'
import { LANG_DEF, LANG as LANG_NAME, compile } from './components/lang/lang'

function App() {
  const [count, setCount] = useState(0);


  const [mountedEditor, setEditor] = useState<editor.IStandaloneCodeEditor | null>(null);

  const monacoConst = useMonaco();


  useEffect(() => {
    if(monacoConst){
      monacoConst.languages.register({
        id: LANG_NAME
      }); 
      monacoConst.languages.setMonarchTokensProvider(LANG_NAME, LANG_DEF);
    }
  }, [monacoConst]);

  return <>
    <div className={styles.appWrapper}>

      <EditorPane
        onMount={(e) => setEditor(e)}
        onChange={(e) => {}}
      ></EditorPane>
      <ResultsPane graph=' digraph { a -> b } ' onCompile={() => {
        if(!mountedEditor) throw "OnCompile called with no editor";
        if(!monacoConst) throw "OnCompile called without monaco";
        compile(mountedEditor.getValue());
      }}/>
    </div>
  </>
}

export default App
