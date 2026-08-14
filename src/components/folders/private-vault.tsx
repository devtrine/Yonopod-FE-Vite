"use client";

import { useState } from "react";
import { Lock, ShieldCheck, FolderPlus, Unlock } from "lucide-react";
import { Button } from "../ui/button";
import { FileTable, type FileItem } from "../files/file-table";
import { useFolders, useCreateFolder } from "../../hooks/use-folders";
import * as folderService from "../../services/folder.service";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "../ui/toaster";
import { getErrorMessage } from "../../lib/api/client";
import type { Folder } from "../../types/folder";
import type { File as ApiFile } from "../../types/file";

function fileToVaultItem(file: ApiFile): FileItem {
  return {
    id: String(file.id),
    name: file.name,
    isFolder: false,
    lastModified: new Date(file.created_at).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    owner: "me",
    tags: file.tags || [],
    isStarred: file.is_favorite,
  };
}

export function PrivateVault() {
  const queryClient = useQueryClient();
  const { data: foldersData, isPending: foldersLoading } = useFolders({ limit: 50 });
  const createFolder = useCreateFolder();

  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
  const [pin, setPin] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [unlockedFolder, setUnlockedFolder] = useState<Folder | null>(null);
  const [isCreatingVault, setIsCreatingVault] = useState(false);
  const [newVaultPin, setNewVaultPin] = useState("");

  const lockedFolders = (foldersData?.data ?? []).filter((f) => f.is_locked);

  const activeFolderId = selectedFolderId ?? lockedFolders[0]?.id ?? null;

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeFolderId || !pin) return;

    try {
      setIsUnlocking(true);
      const res = await folderService.unlockFolder(activeFolderId, {
        vault_password: pin,
      });
      setUnlockedFolder(res);
      setIsUnlocked(true);
      queryClient.setQueryData(["folders", activeFolderId], res);
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      toast("success", "Vault unlocked successfully");
    } catch (err) {
      toast("error", getErrorMessage(err));
    } finally {
      setIsUnlocking(false);
    }
  };

  const handleCreateVault = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newVaultPin.length < 4) {
      toast("error", "PIN/Password must be at least 4 characters");
      return;
    }

    try {
      setIsCreatingVault(true);
      const _folder = await createFolder.mutateAsync({ name: "Private Vault" });
      await folderService.lockFolder(_folder.id, {
        vault_password: newVaultPin,
      });
      queryClient.invalidateQueries({ queryKey: ["folders", _folder.id] });
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      toast("success", "Private Vault created and encrypted!");
      setNewVaultPin("");
      setIsCreatingVault(false);
    } catch (err) {
      toast("error", getErrorMessage(err));
      setIsCreatingVault(false);
    }
  };

  if (foldersLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-[#f1f5f9] animate-pulse" />
      </div>
    );
  }

  // No locked vault folder exists yet
  if (lockedFolders.length === 0 && !isUnlocked) {
    return (
      <div className="flex h-full w-full items-center justify-center p-4">
        <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[#e2e8f0] text-center">
          <div className="w-16 h-16 bg-[#eff1fb] text-[#1c3fc4] rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock size={32} />
          </div>

          <h1 className="text-2xl font-bold text-[#0f172a] mb-2">Private Vault</h1>
          <p className="text-sm text-[#64748b] mb-6">
            You don&apos;t have a Private Vault yet. Create an encrypted folder protected by your secret PIN or password.
          </p>

          <form onSubmit={handleCreateVault} className="flex flex-col gap-4">
            <input
              type="password"
              autoComplete="new-password"
              value={newVaultPin}
              onChange={(e) => setNewVaultPin(e.target.value)}
              placeholder="Enter PIN or password (min 4 chars)"
              required
              minLength={4}
              className="w-full px-4 py-3 rounded-xl border border-[#e2e8f0] text-center text-sm focus:outline-none focus:border-[#1c3fc4]"
            />
            <Button
              type="submit"
              disabled={isCreatingVault || newVaultPin.length < 4}
              className="w-full h-11 text-base flex items-center justify-center gap-2"
            >
              <FolderPlus size={18} />
              {isCreatingVault ? "Creating Vault…" : "Create Private Vault"}
            </Button>
          </form>

          <div className="mt-6 flex items-center justify-center gap-2 text-xs font-medium text-[#16a34a] bg-[#dcfce7] py-2 px-3 rounded-lg mx-auto w-fit">
            <ShieldCheck size={16} />
            End-to-End Encrypted
          </div>
        </div>
      </div>
    );
  }

  // Vault locked screen
  if (!isUnlocked) {
    return (
      <div className="flex h-full w-full items-center justify-center p-4">
        <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[#e2e8f0] text-center">
          <div className="w-16 h-16 bg-[#eff1fb] text-[#1c3fc4] rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock size={32} />
          </div>

          <h1 className="text-2xl font-bold text-[#0f172a] mb-2">Private Vault</h1>
          <p className="text-sm text-[#64748b] mb-6">
            Enter your PIN or password to access encrypted files in your vault.
          </p>

          {lockedFolders.length > 1 && (
            <div className="mb-4 text-left">
              <label className="text-xs font-semibold text-[#64748b] uppercase tracking-wider block mb-1.5">
                Select Vault Folder
              </label>
              <select
                value={activeFolderId ?? ""}
                onChange={(e) => setSelectedFolderId(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-[#e2e8f0] text-sm text-[#0f172a]"
              >
                {lockedFolders.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <form onSubmit={handleUnlock} className="flex flex-col gap-4">
            <input
              type="password"
              autoComplete="new-password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Enter vault PIN or password"
              required
              className="w-full px-4 py-3 rounded-xl border border-[#e2e8f0] text-center text-sm focus:outline-none focus:border-[#1c3fc4]"
            />
            <Button
              type="submit"
              disabled={!pin || isUnlocking}
              className="w-full h-11 text-base flex items-center justify-center gap-2"
            >
              <Unlock size={18} />
              {isUnlocking ? "Unlocking…" : "Unlock Vault"}
            </Button>
          </form>

          <div className="mt-6 flex items-center justify-center gap-2 text-xs font-medium text-[#16a34a] bg-[#dcfce7] py-2 px-3 rounded-lg mx-auto w-fit">
            <ShieldCheck size={16} />
            End-to-End Encrypted
          </div>
        </div>
      </div>
    );
  }

  const vaultFiles: FileItem[] = (unlockedFolder?.Files ?? []).map(fileToVaultItem);

  return (
    <div className="flex h-full w-full overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[1200px] mx-auto w-full flex flex-col gap-8">
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-[#0f172a]">
                {unlockedFolder?.name || "Private Vault"}
              </h1>
              <div className="flex items-center gap-1.5 text-xs font-medium text-[#16a34a] bg-[#dcfce7] py-1 px-2.5 rounded-full">
                <ShieldCheck size={14} />
                Unlocked & Encrypted
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setIsUnlocked(false);
                setUnlockedFolder(null);
                setPin("");
              }}
            >
              <Lock size={16} />
              Lock Vault
            </Button>
          </header>

          <section className="flex flex-col gap-4">
            {vaultFiles.length === 0 ? (
              <div className="py-12 text-center bg-white rounded-xl border border-[#e2e8f0]">
                <p className="text-sm text-[#64748b]">
                  No files in this vault yet. Upload files and move them into this folder to encrypt them.
                </p>
              </div>
            ) : (
              <FileTable
                files={vaultFiles}
                columns={["name", "lastModified", "owner", "tags"]}
              />
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
