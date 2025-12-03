import Creator from "../functions/Creator";
import { ArrowIcon } from "../assets/icon/Exported";
import { ComponentStore } from "../services/zustand/store/ComponentStore";
import React, { useCallback, useEffect } from "react";
import { ModelBoxStore } from "../services/zustand/store/ModelBoxStore";
import { NavLink, useNavigate, useParams, type Params } from "react-router-dom";
import { FolderWatcher } from "../functions/FolderWatcher";

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
    const { ChooseFoler, dirHandle } = Creator();

    const navigate = useNavigate()
    const param: Readonly<Params<string>> = useParams()

    const paths = param['*']?.split('/')


    const { updateComponent, updateFolderNode, folderNode } = ComponentStore()
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
            ).then(updatedRoot => {
                setRoot(updatedRoot)

            })
    }, [isOpen, setRoot])

    // When folder clicked: load children
    const toggleFolder = async (node: ItemNode) => {
        if (node?.kind === "file") return;

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


    function iconColor(type: string) {
        switch (type) {
            case "css":
                return "#03A6A1"

                break;
            case "js":
                return "#FFC107"

                break;
            case "ts":
                return "#169976"

                break;
            case "jsx":
                return "#06923E"

                break;
            case "tsx":
                return "#169976"

                break;
            case "json":
                return "#FFC107"

                break;
            case "html":
                return "#BB3E00"

                break;


            default:
                return "#BB3E00"
                break;
        }
    }


    const target = root ? (root.children?.find(val => val.name === 'features')) : false

    let targetDir: ItemNode




    // useEffect(() => {

    //     console.log(target)

       

    //     toggleFolder(target).then(() => {
    //         console.log('toggled')
    //     })

    // }, [target])





    const RenderNode = (node: ItemNode) => {


        // useEffect(() => {
        //     if (target?.kind === 'directory' && target) {
        //         readDirectory((target?.handle as FileSystemDirectoryHandle), target?.name).then((dta) => {
        //             console.log(dta)
        //             targetDir = dta as ItemNode
        //         })
        //     }
        // }, [])


        return (
            <div className={type} key={node.name} style={{ marginLeft: 20 }}>

                {
                    <div className="folder_item"
                        style={{
                            cursor: node.kind === "directory" ? "pointer" : "default",
                            transition: "all .2s"
                        }}
                        onClick={() => {
                            ChooseFoler(node)
                            if (!paths?.includes(node.name) && node.kind === "directory") {
                                navigate(node.name)
                            }
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
                            if (node.kind === "file" &&
                                node.name.split('.')[node.name.split('.').length - 1] === 'tsx'
                            ) {



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
                            if (node.kind !== "file") { updateFolderNode(node) }

                        }} className=" folder_props " >
                            <div  >{node.kind === "directory" ? (node.isOpen ? "📂" : "📁") :
                                <div style={{

                                    color: iconColor(node.name?.split('.')[node.name?.split('.').length - 1]),
                                    fontWeight: 400,
                                    backgroundColor: `${iconColor(node.name?.split('.')[node.name?.split('.').length - 1])}18`,
                                    padding: 4,
                                    borderRadius: 4
                                }} >{node.name?.split('.')[node.name?.split('.').length - 1].toUpperCase()}</div>}{" "}</div>
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
                    node.children?.map((child) => RenderNode(child))}
            </div>
        );
    };

    return (
        <div>

            <button onClick={pickFolder}>Select {type}</button>

            <div style={{ marginTop: 20 }}>
                {root ? RenderNode(root) : `No ${type} selected`}
            </div>
        </div>
    );
};

