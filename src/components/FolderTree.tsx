import Creator from "../functions/Creator";
import { ArrowIcon } from "../assets/icon/Exported";
import { ComponentStore } from "../services/zustand/store/ComponentStore";
import React, { useEffect } from "react";
import { ModelBoxStore } from "../services/zustand/store/ModelBoxStore";

interface ItemNode {
    name: string;
    kind: "file" | "directory";
    handle: FileSystemHandle;
    children?: ItemNode[];
    isOpen?: boolean;
    source?: any
}

export const FolderTree = ({ type }: { type: "Components" | "Source" }) => {
    const [root, setRoot] = React.useState<ItemNode | null>(null);
    const { ChooseFoler, createFile, createFolder, dirHandle } = Creator();

    const { updateComponent } = ComponentStore()
    const { setIsOpen, setType, setNode, isOpen } = ModelBoxStore()



    // Pick root directory
    const pickFolder = async () => {
        const dirHandle = await window.showDirectoryPicker();
        const node = await readDirectory(dirHandle, dirHandle.name);
        setRoot(node);
    };




    // Read a directory and return its structure
    const readDirectory = async (
        dirHandle: FileSystemDirectoryHandle,
        name: string
    ): Promise<ItemNode> => {
        const children: ItemNode[] = [];

        for await (const [entryName, handle] of dirHandle.entries()) {
            children.push({
                name: entryName,
                kind: handle.kind,
                handle,
                source: dirHandle
            });
        }

        return {
            name,
            kind: "directory",
            handle: dirHandle,
            children,
            isOpen: true,
        };
    };


    useEffect(() => {
        if (root)
            readDirectory((root.handle as FileSystemDirectoryHandle), String(root.name ?? '')
            ).then(updatedRoot => setRoot(updatedRoot))
    }, [isOpen,setRoot])

    // When folder clicked: load children
    const toggleFolder = async (node: ItemNode) => {
        if (node.kind === "file") return;

        node.isOpen = !node.isOpen;

        // Load children only when needed
        if (node.isOpen && !node.children) {
            node.children = [];

            for await (const [entryName, handle] of (
                node.handle as FileSystemDirectoryHandle
            ).entries()) {
                node.children.push({
                    name: entryName,
                    kind: handle.kind,
                    handle,
                    source: node
                });
            }
        }

        setRoot({ ...root! }); // refresh state
    };






    const renderNode = (node: ItemNode) => {



        return (
            <div className={type} key={node.name} style={{ marginLeft: 20 }}>

                {
                    node.name.split('.')[1] !== "ts" && <div className="folder_item"
                        style={{
                            cursor: node.kind === "directory" ? "pointer" : "default",
                            transition: "all .2s"
                        }}
                        onClick={() => {
                            ChooseFoler(node)
                        }}
                    >

                        <div>
                            {
                                node.kind === "directory" ? <div style={{
                                    transition: "all .2s",
                                    rotate: !node.isOpen ? '0deg' : '90deg'
                                }} onClick={() => {


                                    toggleFolder(node)

                                }}><ArrowIcon size={24} /></div> : null
                            }

                        </div>

                        <div onClick={() => {
                            if (node.kind === "file") {
                                console.log(node.name)

                                if (node.name.split('.')[1] !== "ts") {


                                    node.handle.getFile().then(file => {
                                        const reader = new FileReader();
                                        reader.onload = (e) => {
                                            const content = e.target?.result;
                                            const name = (node.name)



                                            updateComponent({
                                                name: name,
                                                code: String(content)
                                            })

                                        };
                                        // reader.readAsDataURL(file)
                                        reader.readAsText(file)
                                    })

                                }
                                // updateComponent(node.handle as unknown as React.JSX.Element)
                            }


                        }} className=" folder_props " >
                            <div>{node.kind === "directory" ? (node.isOpen ? "📂" : "📁") : "📄"}{" "}</div>
                            <p>{node.name}</p>

                        </div>


                        <div className="add_icon" onClick={() => {
                            ChooseFoler(node).then(() => {
                                setIsOpen(true)
                                setNode(node)

                                // createFolder(node.name + "_newFolder").then(() => {
                                //     if (!root) return;

                                // });
                            });
                        }}>
                            <div>+</div>
                        </div>
                    </div>
                }



                {/* Render children only if folder opened */}
                {node.isOpen &&
                    node.children?.map((child) => renderNode(child))}
            </div>
        );
    };

    return (
        <div>
            <button onClick={pickFolder}>Select {type}</button>

            <div style={{ marginTop: 20 }}>
                {root ? renderNode(root) : `No ${type} selected`}
            </div>
        </div>
    );
};

