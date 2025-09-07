import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface GrassState {
    question: string
    setQuestion: (q: string) => void
}

const useGrass = create<GrassState>()

    (
        persist((set) => ({
            question: "",
            setQuestion: (by) => set({ question: by }),
        }),
         { name: 'TC-storage' , skipHydration:true},
         
        ),
        

    )
export default useGrass