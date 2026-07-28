'use client';

import React from 'react';
import { AlertTriangle, Trash2, X, Loader2 } from 'lucide-react';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  isLoading?: boolean;
}

export const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Deletion',
  description = 'Are you sure you want to delete this item? This action cannot be undone.',
  isLoading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl p-6 md:p-8 shadow-2xl border border-gray-100 dark:border-gray-800 transition-all transform scale-100"
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all cursor-pointer disabled:opacity-50"
        >
          <X size={18} />
        </button>

        {/* Icon */}
        <div className="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 flex items-center justify-center mb-5 mx-auto sm:mx-0 shadow-sm border border-red-100 dark:border-red-900/30">
          <AlertTriangle size={28} />
        </div>

        {/* Header */}
        <div className="text-center sm:text-left">
          <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
            {title}
          </h3>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-5 py-3 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all cursor-pointer disabled:opacity-50 text-center"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 px-5 py-3 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-red-600/20 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 size={16} />
                Delete Now
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
