"use client";

import { PaginationMeta } from "@/app/types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationControlsProps {
  meta: PaginationMeta;
}

export function PaginationControls({ meta }: PaginationControlsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center justify-between border-t border-slate-800/80 bg-slate-950/30 px-4 py-3 sm:px-6">
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <span>Page</span>
        <Badge
          variant="outline"
          className="bg-slate-900 border-slate-700 text-slate-200 font-mono text-xs px-2 py-0.5"
        >
          {meta.page}
        </Badge>
        <span>of</span>
        <span className="font-semibold text-slate-300">{meta.totalPages}</span>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(meta.page - 1)}
          disabled={!meta.hasPreviousPage}
          className="h-8 bg-slate-900/80 border-slate-800 text-slate-200 hover:bg-slate-800 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed text-xs"
        >
          <ChevronLeft className="w-3.5 h-3.5 mr-1" />
          Previous
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(meta.page + 1)}
          disabled={!meta.hasNextPage}
          className="h-8 bg-slate-900/80 border-slate-800 text-slate-200 hover:bg-slate-800 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed text-xs"
        >
          Next
          <ChevronRight className="w-3.5 h-3.5 ml-1" />
        </Button>
      </div>
    </div>
  );
}
