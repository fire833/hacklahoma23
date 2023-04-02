import { createContext } from "react";

interface IAppContext {
    completedLevels: number[],
    setCompletedLevels: (n: number[]) => void
}

let loaded = localStorage.getItem("gamestate");
export const defaultAppContext: IAppContext = {
    completedLevels: [],
    setCompletedLevels(n) {
        
    },
}
export const AppContext = createContext<IAppContext>((loaded && JSON.parse(loaded)) || {...defaultAppContext});