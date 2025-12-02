import React, { useState } from "react";

interface ItemNode {
  name: string;
  kind: "file" | "directory";
  handle: FileSystemHandle;
  children?: ItemNode[];
  isOpen?: boolean;
}

const ComponentsTree = () => {
  const [root, setRoot] = useState<ItemNode | null>(null);

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
        });
      }
    }

    setRoot({ ...root! }); // refresh state
  };

  const renderNode = (node: ItemNode) => {
    return (
      <div className="folders" key={node.name} style={{ marginLeft: 20 }}>
        <div
          style={{ cursor: node.kind === "directory" ? "pointer" : "default" }}
          onClick={() => toggleFolder(node)}
        >
          {node.kind === "directory" ? (node.isOpen ? "📂" : "📁") : "📄"}{" "}
          {node.name}
        </div>

        {/* Render children only if folder opened */}
        {node.isOpen &&
          node.children?.map((child) => renderNode(child))}
      </div>
    );
  };

  return (
    <div>
      <button onClick={pickFolder}>Select Folder</button>

      <div style={{ marginTop: 20 }}>
        {root ? renderNode(root) : "No folder selected"}
      </div>
    </div>
  );
};

export default ComponentsTree;
