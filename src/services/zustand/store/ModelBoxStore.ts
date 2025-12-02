import { create } from 'zustand'

interface ItemNode {
    name: string;
    kind: "file" | "directory";
    handle: FileSystemHandle;
    children?: ItemNode[];
    isOpen?: boolean;
    source?: any
}

interface ModelBoxStoreState {
    isOpen: boolean
    setIsOpen: (value: boolean) => void

    type: string
    setType: (value: string) => void

    node: ItemNode | null
    setNode: (val: ItemNode) => void

    createFileData: {
        filename: string
        content: string
    }
    updateCreateFileData: (value: {
        filename: string
        content: string
    }) => void

    createFolderData: {
        folderName: string
    }
    updateCreateFolderData: (value: {
        folderName: string
    }) => void
}

export const ModelBoxStore = create<ModelBoxStoreState>((set) => ({
    isOpen: false,
    setIsOpen: (value) => set({
        isOpen: value
    }),

    type: '',
    setType: (value) => set({
        type: value
    }),

    node: null,
    setNode: (val) => set({
        node: val
    }),

    createFileData: {
        filename: "",
        content: ""
    },
    updateCreateFileData: (value) => set({
        createFileData: value
    }),

    createFolderData: {
        folderName: ""
    },
    updateCreateFolderData: (value) => set({
        createFolderData: value
    })


}))