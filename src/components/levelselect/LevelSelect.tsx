
export interface LevelSelectProps {
    currentTab: number,
    setCurrentTab: (num: number) => void
}

export const NUM_LEVELS = 10;

export function LevelSelect(props: LevelSelectProps) {

    if(props.currentTab !== -1) return <></>;

    return <>
        <h1>Level select</h1>

        {new Array(NUM_LEVELS).fill(0).map((_, ind) => {
            return <button onClick={() => props.setCurrentTab(ind + 1)}>{ind + 1}</button>
        })}

    </>

}