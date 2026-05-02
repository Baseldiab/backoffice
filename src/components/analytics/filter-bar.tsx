'use client';

import { CalendarDays, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useState } from 'react';
import type { DateRange } from 'react-day-picker';

export function FilterBar() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2026, 1, 23),
    to: new Date(2026, 2, 8),
  });

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select defaultValue="all">
        <SelectTrigger className="h-8 w-auto gap-1.5 text-xs">
          <SelectValue placeholder="Widgets" />
          <Badge variant="secondary" className="h-4 px-1 text-[10px]">
            2
          </Badge>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Widgets</SelectItem>
          <SelectItem value="widget-1">Default App</SelectItem>
          <SelectItem value="widget-2">Website Widget</SelectItem>
        </SelectContent>
      </Select>

      <Select defaultValue="all">
        <SelectTrigger className="h-8 w-auto gap-1.5 text-xs">
          <SelectValue placeholder="Status" />
          <Badge variant="secondary" className="h-4 px-1 text-[10px]">
            4
          </Badge>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="inactive">Inactive</SelectItem>
          <SelectItem value="test">Test</SelectItem>
          <SelectItem value="archived">Archived</SelectItem>
        </SelectContent>
      </Select>

      <Select defaultValue="all">
        <SelectTrigger className="h-8 w-auto gap-1.5 text-xs">
          <SelectValue placeholder="Labels" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Labels</SelectItem>
          <SelectItem value="vip">VIP</SelectItem>
          <SelectItem value="early-access">Early Access</SelectItem>
          <SelectItem value="gulf-region">Gulf Region</SelectItem>
          <SelectItem value="premium">Premium</SelectItem>
        </SelectContent>
      </Select>

      <Select defaultValue="all">
        <SelectTrigger className="h-8 w-auto gap-1.5 text-xs">
          <SelectValue placeholder="Audiences" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Audiences</SelectItem>
          <SelectItem value="none">No Targeting</SelectItem>
          <SelectItem value="labels">Label-Based</SelectItem>
          <SelectItem value="custom">Custom</SelectItem>
        </SelectContent>
      </Select>

      <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
        <SlidersHorizontal className="h-3.5 w-3.5" />
        Columns
      </Button>

      <div className="ms-auto flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
              <CalendarDays className="h-3.5 w-3.5" />
              {dateRange?.from && dateRange?.to
                ? `${dateRange.from.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${dateRange.to.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
                : 'Pick a date range'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={setDateRange}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>

        <Button variant="outline" size="sm" className="h-8 text-xs">
          Create Report
        </Button>
      </div>
    </div>
  );
}
