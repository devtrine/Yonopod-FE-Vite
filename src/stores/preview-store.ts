"use client";

import { useSyncExternalStore, useEffect } from "react";
import type { FileItem } from "../components/files/file-table";

export interface PreviewStoreState {
  activeFiles: FileItem[];
  isListLoaded: boolean;
  previewFileId: string | null;
}

const initialState: PreviewStoreState = {
  activeFiles: [],
  isListLoaded: false,
  previewFileId: null,
};

let currentState: PreviewStoreState = { ...initialState };
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

function cleanHashInUrl() {
  if (typeof window === "undefined") return;
  if (window.location.hash) {
    const newUrl = window.location.pathname + window.location.search;
    window.history.replaceState(null, "", newUrl);
  }
}

function setHashInUrl(fileId: string) {
  if (typeof window === "undefined") return;
  if (window.location.hash !== `#${fileId}`) {
    window.location.hash = fileId;
  }
}

export const previewStore = {
  getState: () => currentState,
  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  setActiveFiles: (items: FileItem[], isLoaded: boolean) => {
    currentState = {
      ...currentState,
      activeFiles: items,
      isListLoaded: isLoaded,
    };
    notify();
    previewStore.syncFromHash();
  },
  openPreview: (fileId: string) => {
    // Only open if the file actually exists in activeFiles when loaded
    const exists = currentState.activeFiles.some(
      (f) => !f.isFolder && String(f.id) === String(fileId)
    );

    if (currentState.isListLoaded && !exists) {
      cleanHashInUrl();
      currentState = { ...currentState, previewFileId: null };
      notify();
      return;
    }

    setHashInUrl(fileId);
    currentState = { ...currentState, previewFileId: fileId };
    notify();
  },
  closePreview: () => {
    cleanHashInUrl();
    currentState = { ...currentState, previewFileId: null };
    notify();
  },
  syncFromHash: () => {
    if (typeof window === "undefined") return;
    const rawHash = window.location.hash.replace(/^#/, "").trim();

    if (!rawHash) {
      if (currentState.previewFileId !== null) {
        currentState = { ...currentState, previewFileId: null };
        notify();
      }
      return;
    }

    // If already viewing this file, do not interrupt active preview
    if (currentState.previewFileId === rawHash) {
      return;
    }

    // If active files list has loaded, check if the file exists in current directory ls
    if (currentState.isListLoaded) {
      const match = currentState.activeFiles.find(
        (f) => !f.isFolder && String(f.id) === rawHash
      );
      if (match) {
        if (currentState.previewFileId !== rawHash) {
          currentState = { ...currentState, previewFileId: rawHash };
          notify();
        }
      } else {
        // Not in current list -> clean hash and do not open preview (avoids double BE request)
        cleanHashInUrl();
        if (currentState.previewFileId !== null) {
          currentState = { ...currentState, previewFileId: null };
          notify();
        }
      }
    }
  },
  nextFile: () => {
    const onlyFiles = currentState.activeFiles.filter((f) => !f.isFolder);
    if (onlyFiles.length <= 1 || !currentState.previewFileId) return;

    const currentIndex = onlyFiles.findIndex(
      (f) => String(f.id) === String(currentState.previewFileId)
    );
    if (currentIndex === -1) return;

    const nextIndex = (currentIndex + 1) % onlyFiles.length;
    const nextItem = onlyFiles[nextIndex];
    if (nextItem) {
      previewStore.openPreview(nextItem.id);
    }
  },
  prevFile: () => {
    const onlyFiles = currentState.activeFiles.filter((f) => !f.isFolder);
    if (onlyFiles.length <= 1 || !currentState.previewFileId) return;

    const currentIndex = onlyFiles.findIndex(
      (f) => String(f.id) === String(currentState.previewFileId)
    );
    if (currentIndex === -1) return;

    const prevIndex = (currentIndex - 1 + onlyFiles.length) % onlyFiles.length;
    const prevItem = onlyFiles[prevIndex];
    if (prevItem) {
      previewStore.openPreview(prevItem.id);
    }
  },
};

export function usePreviewStore() {
  const state = useSyncExternalStore(
    previewStore.subscribe,
    previewStore.getState,
    previewStore.getState
  );

  return {
    ...state,
    setActiveFiles: previewStore.setActiveFiles,
    openPreview: previewStore.openPreview,
    closePreview: previewStore.closePreview,
    nextFile: previewStore.nextFile,
    prevFile: previewStore.prevFile,
  };
}

/**
 * Hook to automatically listen for window hashchange events and sync preview state
 */
export function usePreviewHashSync() {
  useEffect(() => {
    const handleHashChange = () => {
      previewStore.syncFromHash();
    };

    window.addEventListener("hashchange", handleHashChange);
    // Initial sync
    previewStore.syncFromHash();

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);
}
