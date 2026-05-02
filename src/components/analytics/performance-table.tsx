'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  type ColumnDef,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ArrowUpDown, ArrowUp, ArrowDown, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn, formatNumber, getInitials } from '@/lib/utils';
import type { StoryGroup, AnalyticsData, StoryGroupStatus } from '@/lib/types';

export interface PerformanceRow {
  id: string;
  title: string;
  coverImage: string;
  widget: string;
  status: StoryGroupStatus;
  audience: string;
  reach: number;
  activeUsers: number;
  impressions: number;
  clicks: number;
  completionRate: number;
  shareFromClick: number;
}

function StatusBadge({ status }: { status: StoryGroupStatus }) {
  const variants: Record<StoryGroupStatus, { label: string; className: string }> = {
    active: { label: 'Active', className: 'bg-primary/10 text-primary border-primary/20' },
    inactive: {
      label: 'Inactive',
      className: 'bg-muted text-muted-foreground border-border',
    },
    test: {
      label: 'Test',
      className: 'bg-muted text-foreground border-border',
    },
    archived: {
      label: 'Archived',
      className: 'bg-muted text-muted-foreground border-border',
    },
    scheduled: {
      label: 'Scheduled',
      className: 'bg-muted text-foreground border-border',
    },
  };

  const v = variants[status];
  return (
    <Badge variant="outline" className={cn('text-[10px] font-medium', v.className)} role="status">
      <span className="sr-only">Status: </span>
      {v.label}
    </Badge>
  );
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

const columns: ColumnDef<PerformanceRow>[] = [
  {
    accessorKey: 'title',
    header: 'Story Group',
    cell: ({ row }) => (
      <div className="flex items-center gap-3 min-w-[200px]">
        <Avatar className="h-8 w-8 rounded-md">
          <AvatarImage src={row.original.coverImage} alt={row.original.title} />
          <AvatarFallback className="rounded-md text-xs">
            {getInitials(row.original.title)}
          </AvatarFallback>
        </Avatar>
        <span className="font-medium truncate">{row.original.title}</span>
      </div>
    ),
  },
  {
    accessorKey: 'widget',
    header: 'Widget',
    cell: ({ getValue }) => (
      <span className="text-muted-foreground text-xs">{getValue<string>()}</span>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ getValue }) => <StatusBadge status={getValue<StoryGroupStatus>()} />,
  },
  {
    accessorKey: 'audience',
    header: 'Audience',
    cell: ({ getValue }) => (
      <span className="text-muted-foreground text-xs">{getValue<string>()}</span>
    ),
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
    accessorKey: 'activeUsers',
    header: ({ column }) => (
      <SortableHeader column={column} className="justify-end">
        Active Users
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
    accessorKey: 'shareFromClick',
    header: ({ column }) => (
      <SortableHeader column={column} className="justify-end">
        Share from Click
      </SortableHeader>
    ),
    cell: ({ getValue }) => (
      <div className="text-end font-mono tabular-nums">{getValue<number>().toFixed(1)}%</div>
    ),
  },
];

interface PerformanceTableProps {
  data: PerformanceRow[];
  onResetFilters?: () => void;
}

export function PerformanceTable({ data, onResetFilters }: PerformanceTableProps) {
  const router = useRouter();
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
              <TableRow
                key={row.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => router.push(`/dashboard/analytics/${row.original.id}`)}
              >
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
                <div className="flex flex-col items-center gap-2">
                  <Search className="h-5 w-5 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">No results found</p>
                  {onResetFilters && (
                    <Button variant="outline" size="sm" onClick={onResetFilters}>
                      Reset Filters
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}

export function PerformanceTableSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-10 w-full" />
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-14 w-full" />
      ))}
    </div>
  );
}

export function usePerformanceData(
  storyGroups: StoryGroup[],
  analyticsData: AnalyticsData[],
  widgets: { id: string; name: string }[],
): PerformanceRow[] {
  return useMemo(() => {
    return storyGroups.map((group) => {
      const analytics = analyticsData.find((a) => a.storyGroupId === group.id);
      const widget = widgets.find((w) => group.widgetIds.includes(w.id));
      return {
        id: group.id,
        title: group.title,
        coverImage: group.coverImage,
        widget: widget?.name ?? 'Unknown',
        status: group.status,
        audience:
          group.audience === 'none'
            ? 'All Users'
            : group.audience === 'labels'
              ? group.labels.join(', ')
              : 'Custom',
        reach: analytics?.reach ?? 0,
        activeUsers: analytics?.activeUsers ?? 0,
        impressions: analytics?.impressions ?? 0,
        clicks: analytics?.clicks ?? 0,
        completionRate: analytics?.completionRate ?? 0,
        shareFromClick: analytics?.shareFromClick ?? 0,
      };
    });
  }, [storyGroups, analyticsData, widgets]);
}
