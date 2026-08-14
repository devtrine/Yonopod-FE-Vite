"use client";

import { useState } from "react";
import { Folder, Link as LinkIcon, EyeOff } from "lucide-react";
import { Modal } from "../ui/modal";
import { Button } from "../ui/button";
import { Toggle } from "../ui/toggle";

export function ShareModal({
  open,
  onClose,
  itemName = '"Q4 Marketing Assets"',
}: {
  open: boolean;
  onClose: () => void;
  itemName?: string;
}) {
  const [permission, setPermission] = useState("Viewer");
  const [passwordProtected, setPasswordProtected] = useState(true);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Share ${itemName}`}
      description="Configure access and security settings before sharing."
      icon={<Folder size={20} />}
      size="md"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button className="gap-2">
            <LinkIcon size={16} />
            Generate Link
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-6 mt-4">
        {/* Share Method */}
        <div>
          <h3 className="text-xs font-semibold text-[#64748b] tracking-wider uppercase mb-3">
            Share Method
          </h3>
          <Button variant="outline" className="w-full h-11 text-[#0f172a] font-medium gap-2 border-[#e2e8f0]">
            <LinkIcon size={16} className="text-[#64748b]" />
            Share Link
          </Button>
        </div>

        {/* Security & Access */}
        <div>
          <h3 className="text-xs font-semibold text-[#64748b] tracking-wider uppercase mb-3">
            Security & Access
          </h3>
          
          <div className="flex flex-col gap-3">
            {/* Permission Level */}
            <div className="flex items-center justify-between p-4 rounded-xl border border-[#e2e8f0]">
              <div className="flex gap-3">
                <div className="text-[#64748b] mt-0.5">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#0f172a]">Permission Level</p>
                  <p className="text-xs text-[#64748b]">Control what recipients can do.</p>
                </div>
              </div>
              <select
                value={permission}
                onChange={(e) => setPermission(e.target.value)}
                className="h-9 px-3 rounded-lg border border-[#e2e8f0] bg-white text-sm font-medium text-[#0f172a] focus:outline-none focus:border-[#1c3fc4]"
              >
                <option value="Viewer">Viewer</option>
                <option value="Editor">Editor</option>
              </select>
            </div>

            {/* Password Protection */}
            <div className="flex flex-col p-4 rounded-xl border border-[#e2e8f0] gap-4">
              <div className="flex items-center justify-between">
                <div className="flex gap-3">
                  <div className="text-[#64748b] mt-0.5">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#0f172a]">Password Protection</p>
                    <p className="text-xs text-[#64748b]">Require a password to access.</p>
                  </div>
                </div>
                <Toggle checked={passwordProtected} onChange={setPasswordProtected} />
              </div>
              
              {passwordProtected && (
                <div className="relative">
                  <input
                    type="password"
                    autoComplete="new-password"
                    defaultValue="secretpassword123"
                    className="w-full h-10 px-3 pr-10 rounded-lg border border-[#e2e8f0] bg-white text-sm focus:outline-none focus:border-[#1c3fc4]"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#64748b]"
                    aria-label="Toggle password visibility"
                  >
                    <EyeOff size={16} />
                  </button>
                </div>
              )}
            </div>

            {/* Additional Settings Row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-xl border border-[#e2e8f0]">
                <div className="flex gap-2 items-center mb-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#64748b]"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                  <p className="text-sm font-semibold text-[#0f172a]">Expiration Date</p>
                </div>
                <input
                  type="date"
                  defaultValue="2024-12-31"
                  className="w-full h-9 px-3 rounded-lg border border-[#e2e8f0] bg-white text-sm text-[#0f172a] focus:outline-none focus:border-[#1c3fc4]"
                />
              </div>

              <div className="p-4 rounded-xl border border-[#e2e8f0]">
                <div className="flex gap-2 items-center mb-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#64748b]"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                  <p className="text-sm font-semibold text-[#0f172a]">Download Limit</p>
                </div>
                <input
                  type="text"
                  placeholder="Unlimited"
                  className="w-full h-9 px-3 rounded-lg border border-[#e2e8f0] bg-white text-sm text-[#0f172a] placeholder:text-[#94a3b8] focus:outline-none focus:border-[#1c3fc4]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
