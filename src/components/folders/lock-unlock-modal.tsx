"use client";

import { useState } from "react";
import { Lock, Unlock } from "lucide-react";
import { Modal } from "../ui/modal";
import { Button } from "../ui/button";
import { useUIStore } from "../../stores/ui-store";
import { useLockFolder, useUnlockFolder } from "../../hooks/use-folders";
import { toast } from "../ui/toaster";
import { getErrorMessage } from "../../lib/api/client";

export function LockUnlockModal() {
  const { state, closeLockModal } = useUIStore();
  const lockModal = state.lockModal;
  const folderId = lockModal.folderId ?? "";
  const isLocked = lockModal.isLocked ?? false;

  const lockFolder = useLockFolder(folderId);
  const unlockFolder = useUnlockFolder(folderId);

  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPassword = password.trim();
    if (!cleanPassword) return;

    if (cleanPassword.length < 4) {
      toast("error", "Vault password / PIN must be at least 4 characters");
      return;
    }

    if (isLocked) {
      unlockFolder.mutate(
        { vault_password: cleanPassword },
        {
          onSuccess: () => {
            toast("success", "Folder unlocked successfully");
            setPassword("");
            closeLockModal();
          },
          onError: (err) => toast("error", getErrorMessage(err)),
        }
      );
    } else {
      lockFolder.mutate(
        { vault_password: cleanPassword },
        {
          onSuccess: () => {
            toast("success", "Folder locked and encrypted");
            setPassword("");
            closeLockModal();
          },
          onError: (err) => toast("error", getErrorMessage(err)),
        }
      );
    }
  };

  const isPending = lockFolder.isPending || unlockFolder.isPending;

  return (
    <Modal
      open={lockModal.open}
      onClose={() => {
        setPassword("");
        closeLockModal();
      }}
      title={isLocked ? "Unlock Folder" : "Lock Folder"}
      description={
        isLocked
          ? `Enter your vault password to unlock "${lockModal.folderName}".`
          : `Protect "${lockModal.folderName}" with a password (min. 4 characters).`
      }
      icon={isLocked ? <Unlock size={20} /> : <Lock size={20} />}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label
            htmlFor="vault-password-input"
            className="text-xs font-semibold text-[#64748b] uppercase tracking-wider block mb-1.5"
          >
            Vault Password / PIN (min. 4 chars)
          </label>
          <input
            id="vault-password-input"
            type="password"
            required
            minLength={4}
            autoFocus
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password (min 4 characters)"
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2e8f0] text-sm text-[#0f172a] focus:outline-none focus:border-[#1c3fc4]"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setPassword("");
              closeLockModal();
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={!password.trim() || isPending}
            className="bg-[#1c3fc4] text-white hover:bg-[#1636b0]"
          >
            {isPending
              ? isLocked
                ? "Unlocking…"
                : "Locking…"
              : isLocked
              ? "Unlock"
              : "Lock Folder"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
