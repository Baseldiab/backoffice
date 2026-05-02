'use client';

import { useState } from 'react';
import {
  type ColumnDef,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn, formatNumber } from '@/lib/utils';
import type { StoryStatus } from '@/lib/types';

export interface DrilldownRow {
  id: string;
  thumbnail: string;
  storyId: string;
  status: StoryStatus;
  reach: number;
  impressions: number;
  clicks: number;
  ctr: number;
  completionRate: number;
  avgWatchLength: number;
  tapForward: number;
  tapBackward: number;
}

function SortableHeader({
  column,
  children,
  className,
}: {
  column: { getIsSorted: () => false | 'asc' | 'desc'; toggleSorting: (desc?: boolean) => void };
  children: React.ReactNode;
  className?: string;
}) {
  const sorted = column.getIsSorted();
  return (
    <button
      className={cn('flex items-center gap-1 hover:text-foreground transition-colors', className)}
      onClick={() => column.toggleSorting(sorted === 'asc')}
    >
      {children}
      {sorted === 'asc' ? (
        <ArrowUp className="h-3.5 w-3.5" />
      ) : sorted === 'desc' ? (
        <ArrowDown className="h-3.5 w-3.5" />
      ) : (
        <ArrowUpDown className="h-3.5 w-3.5 opacity-40" />
      )}
    </button>
  );
}

const columns: ColumnDef<DrilldownRow>[] = [
  {
    accessorKey: 'thumbnail',
    header: '',
    cell: ({ getValue }) => (
      <div className="h-12 w-8 overflow-hidden rounded-md bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={getValue<string>()}
          alt="Story thumbnail"
          className="h-full w-full object-cover"
        />
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'storyId',
    header: 'Story ID',
    cell: ({ getValue }) => (
      <span className="font-mono text-xs text-muted-foreground">{getValue<string>()}</span>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ getValue }) => {
      const status = getValue<StoryStatus>();
      return (
        <Badge
          variant="outline"
          role="status"
          className={cn(
            'text-[10px] font-medium',
            status === 'active'
              ? 'bg-primary/10 text-primary border-primary/20'
              : 'bg-muted text-muted-foreground border-border',
          )}
        >
          <span className="sr-only">Status: </span>
          {status === 'active' ? 'Active' : 'Archived'}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'reach',
    header: ({ column }) => (
      <SortableHeader column={column} className="justify-end">
        Reach
      </SortableHeader>
    ),
    cell: ({ getValue }) => (
      <div className="text-end font-mono tabular-nums">{formatNumber(getValue<number>())}</div>
    ),
  },
  {
    accessorKey: 'impressions',
    header: ({ column }) => (
      <SortableHeader column={column} className="justify-end">
        Impression
      </SortableHeader>
    ),
    cell: ({ getValue }) => (
      <div className="text-end font-mono tabular-nums">{formatNumber(getValue<number>())}</div>
    ),
  },
  {
    accessorKey: 'clicks',
    header: ({ column }) => (
      <SortableHeader column={column} className="justify-end">
        Click
      </SortableHeader>
    ),
    cell: ({ getValue }) => (
      <div className="text-end font-mono tabular-nums">{formatNumber(getValue<number>())}</div>
    ),
  },
  {
    accessorKey: 'ctr',
    header: ({ column }) => (
      <SortableHeader column={column} className="justify-end">
        CTR%
      </SortableHeader>
    ),
    cell: ({ getValue }) => (
      <div className="text-end font-mono tabular-nums">{getValue<number>().toFixed(2)}%</div>
    ),
  },
  {
    accessorKey: 'completionRate',
    header: ({ column }) => (
      <SortableHeader column={column} className="justify-end">
        Complete
      </SortableHeader>
    ),
    cell: ({ getValue }) => (
      <div className="text-end font-mono tabular-nums">{getValue<number>().toFixed(1)}%</div>
    ),
  },
  {
    accessorKey: 'avgWatchLength',
    header: ({ column }) => (
      <SortableHeader column={column} className="justify-end">
        Avg Watch
      </SortableHeader>
    ),
    cell: ({ getValue }) => (
      <div className="text-end font-mono tabular-nums">{getValue<number>().toFixed(1)}s</div>
    ),
  },
  {
    accessorKey: 'tapForward',
    header: ({ column }) => (
      <SortableHeader column={column} className="justify-end">
        Tap Forward
      </SortableHeader>
    ),
    cell: ({ getValue }) => (
      <div className="text-end font-mono tabular-nums">{formatNumber(getValue<number>())}</div>
    ),
  },
  {
    accessorKey: 'tapBackward',
    header: ({ column }) => (
      <SortableHeader column={column} className="justify-end">
        Tap Backward
      </SortableHeader>
    ),
    cell: ({ getValue }) => (
      <div className="text-end font-mono tabular-nums">{formatNumber(getValue<number>())}</div>
    ),
  },
];

interface DrilldownTableProps {
  data: DrilldownRow[];
}

export function DrilldownTable({ data }: DrilldownTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <ScrollArea className="w-full">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="hover:bg-transparent">
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} className="whitespace-nowrap">
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} className="hover:bg-muted/50">
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="whitespace-nowrap">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No stories found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}

export function DrilldownTableSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-10 w-full" />
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-14 w-full" />
      ))}
    </div>
  );
}
