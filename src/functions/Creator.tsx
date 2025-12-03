import { useEffect, useState } from "react";
import { ComponentStore } from "../services/zustand/store/ComponentStore";
import { useParams } from "react-router-dom";

interface ItemNode {
    name: string;
    kind: "file" | "directory";
    handle: FileSystemHandle;
    children?: ItemNode[];
    isOpen?: boolean;
    source?: any
}
export default function Creator() {
    
    const [dirHandle, setCount] = useState<FileSystemDirectoryHandle>(null!);
    const [status, setStatus] = useState("");

    async function ChooseFoler(node:ItemNode) {
        console.log('Folder Choose',node)
        try {
            const handle = node.handle as FileSystemDirectoryHandle;
            setCount(handle)

        } catch (err) {
            console.error(err);
        }
    }

    async function openFolderByPath(path: string, root: FileSystemDirectoryHandle) {
    const segments = path.split("/").filter(Boolean);
    let current = root;

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



    // Create folder inside selected dir
    async function createFolder(folderName: string) {


        if (!dirHandle) {
            setStatus("Please choose a directory first.");
            return;
        }
        try {
            // getDirectoryHandle creates or opens if exists (use { create: true })
            await dirHandle.getDirectoryHandle(folderName, { create: true });
            setStatus(`Folder "${folderName}" created.`);
        } catch (e: Error | any) {
            console.error(e);
            setStatus("Error creating folder: " + e.message);
        }
    }

    // Create file with content inside selected dir (optionally inside subfolder)
    async function createFile(filePath: string, content: string = "") {
        if (!dirHandle) {
            setStatus("Please choose a directory first.");
            return;
        }
        try {
            // If filePath includes folders, ensure they exist
            const parts = filePath.split("/").filter(Boolean); // ["sub","file.txt"]
            let current = dirHandle;
            const fileName = parts.pop();

            for (const part of parts) {
                current = await current.getDirectoryHandle(part, { create: true });
            }

            const fileHandle = await current.getFileHandle(fileName, { create: true });
            const writable = await fileHandle.createWritable();
            await writable.write(content);
            await writable.close();
            setStatus(`File "${filePath}" created.`);
        } catch (e) {
            setStatus("Error creating file: " + e.message);
        }
    }

    async function updateFile(filePath: string, newContent: string) {

        console.log(dirHandle)

    if (!dirHandle) {
        setStatus("Please choose a directory first.");
        return;
    }

    try {
        // Same logic as createFile → ensure folders exist
        const parts = filePath.split("/").filter(Boolean); 
        let current = dirHandle;
        const fileName = parts.pop(); // actual file name

        // Ensure parent folders exist
        for (const part of parts) {
            current = await current.getDirectoryHandle(part, { create: true });
        }

        // Access existing file or create it if missing
        const fileHandle = await current.getFileHandle(fileName, { create: true });

        // Open writable stream
        const writable = await fileHandle.createWritable();
        await writable.write(newContent);
        await writable.close();

        setStatus(`File "${filePath}" updated successfully.`);
    } catch (e) {
        setStatus("Error updating file: " + e.message);
    }
}





    return { ChooseFoler, createFolder, createFile, dirHandle,updateFile,openFolderByPath };
}




