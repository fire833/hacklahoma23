import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import styles from './App.module.css'
import Editor from './components/editor/editor_pane'
import ResultsPane from './components/results/results_pane'
import EditorPane from './components/editor/editor_pane'

function App() {
  const [count, setCount] = useState(0)
  return <>
    <div className={styles.appWrapper}>

      <EditorPane></EditorPane>
      <ResultsPane></ResultsPane>

    </div>
  </>
}

export default App
