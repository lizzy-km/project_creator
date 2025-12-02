import { create } from 'zustand'

interface ComponentStoreState {
    Component: {
        name: string,
        code: string
    };
    removeComponent: () => void;
    updateComponent: (newComponent: {
        name: string,
        code: string
    }) => void;
}

export const ComponentStore = create<ComponentStoreState>((set) => ({
    Component: {
        name: "",
        code: ""
    },
    removeComponent: () => set({
        Component: {
            name: "",
            code: ""
        }
    }),
    updateComponent: (newComponent: {
        name: string,
        code: string
    }) => set({ Component: newComponent }),
}))