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
import { LevelSelect } from './components/levelselect/LevelSelect'
import { Level1 } from './components/levels/level1/Level1'

function App() {

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



  const [currentTab, setCurrentTab] = useState<number>(-1);


  return <>
    <div className={styles.appWrapper}>
      <LevelSelect currentTab={currentTab} setCurrentTab={setCurrentTab}></LevelSelect>
      <Level1 active_level={currentTab}></Level1>
    </div>
  </>
}

export default App
