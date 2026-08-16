"use client";

import { useSyncExternalStore } from "react";

export interface RenameModalState {
  open: boolean;
  id?: string;
  name?: string;
  isFolder?: boolean;
}

export interface LockModalState {
  open: boolean;
  folderId?: string;
  folderName?: string;
  isLocked?: boolean;
}

export interface DownloadDialogState {
  open: boolean;
  fileId?: string;
  fileName?: string;
}

export interface UIStoreState {
  uploadModalOpen: boolean;
  targetFolderId: string | null;
  createFolderModalOpen: boolean;
  createFolderParentId: string | null;  
  renameModal: RenameModalState;
  lockModal: LockModalState;
  downloadDialog: DownloadDialogState;
}

const initialState: UIStoreState = {
  uploadModalOpen: false,
  targetFolderId: null,
  createFolderModalOpen: false,
  createFolderParentId: null,
  renameModal: { open: false },
  lockModal: { open: false },
  downloadDialog: { open: false },
};

let currentState: UIStoreState = { ...initialState };
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

export const uiStore = {
  getState: () => currentState,
  setState: (partial: Partial<UIStoreState> | ((prev: UIStoreState) => Partial<UIStoreState>)) => {
    const next = typeof partial === "function" ? partial(currentState) : partial;
    currentState = { ...currentState, ...next };
    notify();
  },
  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  openUploadModal: (folderId: string | null = null) => {
    currentState = { ...currentState, uploadModalOpen: true, targetFolderId: folderId };
    notify();
  },
  closeUploadModal: () => {
    currentState = { ...currentState, uploadModalOpen: false };
    notify();
  },
  openCreateFolderModal: (parentId: string | null = null) => {
    currentState = { ...currentState, createFolderModalOpen: true, createFolderParentId: parentId };
    notify();
  },
  closeCreateFolderModal: () => {
    currentState = { ...currentState, createFolderModalOpen: false };
    notify();
  },
  openRenameModal: (id: string, name: string, isFolder: boolean) => {
    currentState = { ...currentState, renameModal: { open: true, id, name, isFolder } };
    notify();
  },
  closeRenameModal: () => {
    currentState = { ...currentState, renameModal: { open: false } };
    notify();
  },
  openLockModal: (folderId: string, folderName: string, isLocked: boolean) => {
    currentState = { ...currentState, lockModal: { open: true, folderId, folderName, isLocked } };
    notify();
  },
  closeLockModal: () => {
    currentState = { ...currentState, lockModal: { open: false } };
    notify();
  },
  openDownloadDialog: (fileId: string, fileName: string) => {
    currentState = { ...currentState, downloadDialog: { open: true, fileId, fileName } };
    notify();
  },
  closeDownloadDialog: () => {
    currentState = { ...currentState, downloadDialog: { open: false } };
    notify();
  },
};

export function useUIStore() {
  const state = useSyncExternalStore(
    uiStore.subscribe,
    uiStore.getState,
    uiStore.getState
  );

  return {
    state,
    openUploadModal: uiStore.openUploadModal,
    closeUploadModal: uiStore.closeUploadModal,
    openCreateFolderModal: uiStore.openCreateFolderModal,
    closeCreateFolderModal: uiStore.closeCreateFolderModal,
    openRenameModal: uiStore.openRenameModal,
    closeRenameModal: uiStore.closeRenameModal,
    openLockModal: uiStore.openLockModal,
    closeLockModal: uiStore.closeLockModal,
    openDownloadDialog: uiStore.openDownloadDialog,
    closeDownloadDialog: uiStore.closeDownloadDialog,
  };
}
