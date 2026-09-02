import React from 'react';
import { Trash2, AlertTriangle, X } from 'lucide-react';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  itemName?: string;
  itemType?: 'Candidate' | 'Job Role' | 'Task' | 'item' | string;
  itemTitle?: string;
  itemSubtitle?: string;
  warningMessage?: string;
  isDeleting?: boolean;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  itemName,
  itemType = 'item',
  itemTitle,
  itemSubtitle,
  warningMessage,
  isDeleting = false,
}) => {
  if (!isOpen) return null;

  const displayTitle = title || itemTitle || `Delete ${itemType}`;
  const displayItemName = itemName || itemTitle || 'this item';
  const displayWarning = warningMessage || itemSubtitle || `Deleting this ${(itemType || 'item').toLowerCase()} will remove all its associated evaluation logs, scores, and recruiter task records. This action is irreversible.`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-red-50/50">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-red-950">
                {displayTitle}
              </h3>
              <p className="text-[11px] text-red-700 font-medium">Permanent Action Warning</p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isDeleting}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3">
          <p className="text-xs text-slate-600 leading-relaxed">
            Are you sure you want to delete <strong className="text-slate-900">"{displayItemName}"</strong>?
          </p>

          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800">
            {displayWarning}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-end space-x-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            id="confirm-delete-btn"
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex items-center space-x-1.5 px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>{isDeleting ? 'Deleting...' : `Confirm Delete`}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
