import { create } from 'zustand'

interface ItemNode {
    name: string;
    kind: "file" | "directory";
    handle: FileSystemHandle;
    children?: ItemNode[];
    isOpen?: boolean;
    source?: any
}
interface ComponentStoreState {
    Component: {
        name: string,
        code: string
    };


    folderNode:ItemNode|null
    updateFolderNode:(value:ItemNode)=>void

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


    folderNode:null,
    updateFolderNode:(value)=>set({
        folderNode:value
    }),
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