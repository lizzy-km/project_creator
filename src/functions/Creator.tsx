import { useState } from "react";

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
        try {
            const handle = node.handle as FileSystemDirectoryHandle;
            setCount(handle)

        } catch (err) {
            console.error(err);
        }
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

    return { ChooseFoler, createFolder, createFile, dirHandle };
}




