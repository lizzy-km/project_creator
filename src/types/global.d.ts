// src/global.d.ts
export {};

declare global {
  interface Window {
    showDirectoryPicker?: () => Promise<FileSystemDirectoryHandle>;
  }

  interface FileSystemDirectoryHandle extends FileSystemHandle {
    getFileHandle(name: string, options?: { create?: boolean }): Promise<FileSystemFileHandle>;
    getDirectoryHandle(name: string, options?: { create?: boolean }): Promise<FileSystemDirectoryHandle>;
    removeEntry(name: string, options?: { recursive?: boolean }): Promise<void>;
  }
}
