import styles from "./LevelSelect.module.css"


export interface LevelSelectProps {
    currentTab: number,
    setCurrentTab: (num: number) => void
}

export const NUM_LEVELS = 10;

export function LevelSelect(props: LevelSelectProps) {

    if(props.currentTab !== -1) return <></>;

    return <div className={styles.levelSelectWrapper}>
        <h1>Escape From A-77</h1>
        <h2>Level Select</h2>

        <div className={styles.buttonGrid}>
            {new Array(NUM_LEVELS).fill(0).map((_, ind) => {
                return <button key={ind} onClick={() => props.setCurrentTab(ind + 1)}>{ind + 1}</button>
            })}
        </div>

    </div>

}