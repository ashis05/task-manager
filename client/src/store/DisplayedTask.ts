import {create} from "zustand";

type TaskStore = {
    typeTask: string
    setTypeTask: (typeTask: string) => void

}

export const useTaskStore = create<TaskStore>((set) => ({
    typeTask: "All Tasks",
    setTypeTask: (typeTask) => set({typeTask: typeTask})
}))