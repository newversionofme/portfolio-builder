'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronUp, ChevronDown, Pencil, Trash2 } from 'lucide-react';

interface ListItemActionsProps {
  onEdit: () => void;
  onDelete: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
  editLabel?: string;
  deleteLabel?: string;
  className?: string;
}

export function ListItemActions({
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
  isFirst = false,
  isLast = false,
  editLabel = 'Edit',
  deleteLabel = 'Hapus',
  className = '',
}: ListItemActionsProps) {
  return (
    <div className={`flex flex-wrap items-center gap-1.5 shrink-0 ${className}`}>
      {/* Tombol Naik / Turun Urutan */}
      {onMoveUp && onMoveDown && (
        <div className="flex items-center gap-0.5 border border-zinc-200 dark:border-zinc-800 rounded-lg p-0.5 bg-zinc-50/60 dark:bg-zinc-900/40">
          <button
            type="button"
            onClick={onMoveUp}
            disabled={isFirst}
            title="Pindahkan ke atas"
            aria-label="Pindahkan urutan ke atas"
            className="w-8 h-8 sm:w-8 sm:h-8 min-w-[32px] min-h-[32px] flex items-center justify-center rounded text-zinc-500 hover:text-zinc-900 dark:hover:text-white disabled:opacity-20 disabled:cursor-not-allowed hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition-colors"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            disabled={isLast}
            title="Pindahkan ke bawah"
            aria-label="Pindahkan urutan ke bawah"
            className="w-8 h-8 sm:w-8 sm:h-8 min-w-[32px] min-h-[32px] flex items-center justify-center rounded text-zinc-500 hover:text-zinc-900 dark:hover:text-white disabled:opacity-20 disabled:cursor-not-allowed hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition-colors"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Tombol Edit */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onEdit}
        className="h-9 px-3 text-xs gap-1.5 min-h-[36px] font-medium border-zinc-200 dark:border-zinc-800 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/40 dark:hover:text-blue-400"
      >
        <Pencil className="w-3.5 h-3.5" />
        <span>{editLabel}</span>
      </Button>

      {/* Tombol Hapus */}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onDelete}
        className="h-9 px-3 text-xs gap-1.5 min-h-[36px] font-medium text-zinc-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
      >
        <Trash2 className="w-3.5 h-3.5" />
        <span>{deleteLabel}</span>
      </Button>
    </div>
  );
}
