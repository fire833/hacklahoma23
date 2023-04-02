import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import styles from './App.module.css'
import Editor from './components/editor/editor_pane'
import ResultsPane from './components/results/results_pane'
import EditorPane from './components/editor/editor_pane'
import { useMonaco } from '@monaco-editor/react'
import { editor, languages } from 'monaco-editor'
import { LANG_COMPLETIONS, LANG_DEF, LANG_HOVER, LANG as LANG_NAME, compile } from './components/lang/lang'
import { GraphContext, GraphNode, GraphNodeID, SerializerKey } from './components/lang/graph'
import { LevelSelect } from './components/levelselect/LevelSelect'
import { Level1 } from './components/levels/level1/Level1'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Level2 } from './components/levels/level2/Level2'
import { Level3 } from './components/levels/level3/Level3'
import { Level4 } from './components/levels/level4/Level4'
import { Level5 } from './components/levels/level5/Level5'
import { Level6 } from './components/levels/level6/Level6'
import { Level7 } from './components/levels/level7/Level7'
import { Level8 } from './components/levels/level8/Level8'
import { Level9 } from './components/levels/level9/Level9'
import { Level10 } from './components/levels/level10/Level10'

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

  return <>
    <div className={styles.appWrapper}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LevelSelect />} />
          <Route path='/level1' element={<Level1 />} />
          <Route path='/level2' element={<Level2 />} />
          <Route path='/level3' element={<Level3 />} />
          <Route path='/level4' element={<Level4 />} />
          <Route path='/level5' element={<Level5 />} />
          <Route path='/level6' element={<Level6 />} />
          <Route path='/level7' element={<Level7 />} />
          <Route path='/level8' element={<Level8 />} />
          <Route path='/level9' element={<Level9 />} />
          <Route path='/level10' element={<Level10 />} />
        </Routes>
      </BrowserRouter>
    </div>
  </>
}

export default App
