import { useEffect } from "react";
import { useParams } from "react-router-dom";

async function openFolderByPath(path: string, root: FileSystemDirectoryHandle) {
    const segments = path.split("/").filter(Boolean).filter(val=> val !== path.split("/")[0]);
    let current = root;


    console.log(root)
    for (const seg of segments) {
        try {
            current = await current.getDirectoryHandle(seg);
        } catch (e) {
            console.error("Folder not found:", seg);
            return null;
        }
    }

    // Read children of this folder
    const children = [];
    for await (const [name, handle] of current.entries()) {
        children.push({ name, handle, type: handle.kind });
    }

    return { handle: current, children };
}
export function FolderWatcher({ dirHandle, onFolderOpen }) {
    const { "*": folderPath } = useParams(); // catch all

    // console.log(dirHandle)

    useEffect(() => {
        if (!folderPath || !dirHandle) return;
        openFolderByPath(folderPath, dirHandle).then(onFolderOpen);
    }, [folderPath, dirHandle]);

    return null;
}

export async function openFolder(path: string, root: FileSystemDirectoryHandle) {
    const segments = path.split("/").filter(Boolean);
    let current = root;


    console.log(segments,current)

    for (const seg of segments) {
        try {
            current = await current.getDirectoryHandle(seg);
        } catch (e) {
            console.error("Folder not found:", seg);
            return null;
        }
    }

    // Read children of this folder
    const children = [];
    for await (const [name, handle] of current.entries()) {
        children.push({ name, handle, type: handle.kind });
    }

    return { handle: current, children };
}
