import {create} from 'zustand'

type TagStore = {
    availableTags: Tag[]
    setAvailableTags: (tags: Tag[]) => void

}

export const useTagStore = create<TagStore>((set) => ({
    availableTags: [],
    setAvailableTags: (tags) => set({availableTags: tags})
}))