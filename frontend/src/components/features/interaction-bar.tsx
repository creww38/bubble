"use client";

import * as React from "react";
import { Heart, ThumbsDown, Search, Flag, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface InteractionBarProps {
  onBelieve: () => void;
  onFactCheck: () => void;
  onDoubt: () => void;
  onReport: () => void;
  onBookmark?: () => void;
  className?: string;
  disabled?: boolean;
}

export function InteractionBar({
  onBelieve,
  onFactCheck,
  onDoubt,
  onReport,
  onBookmark,
  className,
  disabled = false,
}: InteractionBarProps) {
  return (
    <div className={cn("flex flex-wrap gap-2 p-4", className)}>
      <Button
        variant="outline"
        size="sm"
        onClick={onBelieve}
        disabled={disabled}
        className="flex-1 justify-center"
        leftIcon={<Heart className="h-4 w-4 text-green-500" />}
      >
        Percaya
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onDoubt}
        disabled={disabled}
        className="flex-1 justify-center"
        leftIcon={<ThumbsDown className="h-4 w-4 text-red-500" />}
      >
        Ragu
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onFactCheck}
        disabled={disabled}
        className="flex-1 justify-center"
        leftIcon={<Search className="h-4 w-4 text-blue-500" />}
      >
        Cek Fakta
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onReport}
        disabled={disabled}
        className="justify-center"
        leftIcon={<Flag className="h-4 w-4 text-orange-500" />}
      >
        Laporkan
      </Button>
      {onBookmark && (
        <Button
          variant="outline"
          size="sm"
          onClick={onBookmark}
          disabled={disabled}
          className="justify-center"
          leftIcon={<Bookmark className="h-4 w-4 text-purple-500" />}
        >
          Simpan
        </Button>
      )}
    </div>
  );
}