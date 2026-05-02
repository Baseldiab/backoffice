'use client';

import React, { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  useDroppable,
  useDraggable,
} from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { toast } from 'sonner';
import { usePipelineStore } from '@/lib/pipeline-store';
import { PIPELINE_STAGES } from '@/lib/mock/pipeline';
import type { Deal, DealPriority } from '@/lib/mock/pipeline';
import { cn, getInitials } from '@/lib/utils';

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Active pipeline stages used for board columns
const ACTIVE_STAGES = PIPELINE_STAGES;

const FLAG: Record<string, string> = {
  SA: '🇸🇦',
  AE: '🇦🇪',
  KW: '🇰🇼',
  QA: '🇶🇦',
  BH: '🇧🇭',
  OM: '🇴🇲',
};
const countryFlag = (c: string) => FLAG[c] ?? '🌍';

function priorityColor(p: DealPriority): string {
  if (p === 'High') return 'bg-red-500';
  if (p === 'Medium') return 'bg-amber-400';
  return 'bg-zinc-400';
}

// ─── DraggableCard ────────────────────────────────────────────────────────────

interface DraggableCardProps {
  deal: Deal;
  isSelected: boolean;
  onSelectDeal: (deal: Deal | null) => void;
  isDragOverlay?: boolean;
}

function DraggableCard({
  deal,
  isSelected,
  onSelectDeal,
  isDragOverlay = false,
}: DraggableCardProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: deal.id,
    disabled: isDragOverlay,
  });

  const stage = PIPELINE_STAGES.find((s) => s.id === deal.stageId);
  const completedReqs = deal.completedRequirements || [];
  const totalReqs = stage?.requirements?.length || 0;
  const completedCount =
    stage?.requirements?.filter((r) => {
      if (completedReqs.includes(r.id)) return true;
      if (r.field) return !!deal[r.field as keyof Deal];
      return false;
    }).length || 0;
  const progress = totalReqs > 0 ? (completedCount / totalReqs) * 100 : 0;

  function handleClick(e: React.MouseEvent) {
    if (isDragOverlay) return;
    e.stopPropagation();
    onSelectDeal(isSelected ? null : deal);
  }

  return (
    <div
      ref={setNodeRef}
      {...(isDragOverlay ? {} : { ...listeners, ...attributes })}
      onClick={handleClick}
      className={cn(
        'bg-card border border-border rounded-lg p-3 cursor-pointer transition-all duration-150',
        'hover:border-primary/40 hover:shadow-sm',
        isSelected && 'border-primary bg-primary/5',
        isDragging && 'opacity-50',
        isDragOverlay && 'cursor-grabbing shadow-2xl rotate-1 scale-105',
      )}
    >
      <p className="text-sm font-medium truncate mb-2">{deal.companyName}</p>
      <div className="flex items-center gap-1.5 flex-wrap mb-2">
        <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
          {deal.requestedPlan}
        </span>
        <span className="text-xs text-muted-foreground">
          {countryFlag(deal.country)} {deal.country}
        </span>
        <span
          className={cn('w-2 h-2 rounded-full ml-auto flex-none', priorityColor(deal.priority))}
        />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono text-muted-foreground">
          HL-{deal.id.slice(-3).toUpperCase()}
        </span>
        <div className="w-5 h-5 rounded-full bg-muted text-[9px] flex items-center justify-center font-medium text-muted-foreground">
          {getInitials(deal.contactName)}
        </div>
      </div>
      {totalReqs > 0 && (
        <div className="mt-2 pt-2 border-t border-border/50">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-muted-foreground">
              {completedCount}/{totalReqs} done
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-0.5">
            <div
              className={cn(
                'h-0.5 rounded-full transition-all',
                progress === 100 ? 'bg-primary' : 'bg-muted-foreground/40',
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── DroppableColumn ──────────────────────────────────────────────────────────

interface DroppableColumnProps {
  stage: (typeof PIPELINE_STAGES)[number];
  deals: Deal[];
  selectedDealId: string | null;
  onSelectDeal: (deal: Deal | null) => void;
}

function DroppableColumn({ stage, deals, selectedDealId, onSelectDeal }: DroppableColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: stage.id });

  return (
    <div className="flex flex-col w-[280px] flex-none">
      <div
        className={cn(
          'flex flex-col rounded-xl transition-colors',
          'bg-muted/30',
          isOver && 'bg-muted/50',
        )}
      >
        {/* Column header inside the container */}
        <div className="px-3 py-2.5 border-b border-border/50 rounded-t-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {stage.label}
            </span>
            <span className="text-xs bg-background rounded px-1.5 py-0.5 text-muted-foreground">
              {deals.length}
            </span>
          </div>
        </div>

        {/* Cards — height fits content only */}
        <div ref={setNodeRef} className="p-2 flex flex-col gap-2">
          {deals.map((deal) => (
            <DraggableCard
              key={deal.id}
              deal={deal}
              isSelected={deal.id === selectedDealId}
              onSelectDeal={onSelectDeal}
            />
          ))}
          {deals.length === 0 && (
            <div className="py-6 text-center text-xs text-muted-foreground/50 border border-dashed border-border/30 rounded-lg">
              No deals
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── KanbanBoard ──────────────────────────────────────────────────────────────

export interface KanbanBoardProps {
  deals: Deal[];
  selectedDealId: string | null;
  onSelectDeal: (deal: Deal | null) => void;
}

export default function KanbanBoard({ deals, selectedDealId, onSelectDeal }: KanbanBoardProps) {
  const { moveDealToStage } = usePipelineStore();
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));
  const activeDeal = activeId ? (deals.find((d) => d.id === activeId) ?? null) : null;

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const dealId = active.id as string;
    const targetStageId = over.id as string;
    const deal = deals.find((d) => d.id === dealId);
    if (!deal || deal.stageId === targetStageId) return;

    moveDealToStage(dealId, targetStageId);
    const name = ACTIVE_STAGES.find((s) => s.id === targetStageId)?.label ?? targetStageId;
    toast.success(`Deal moved to ${name}`);
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-3 items-start">
        {ACTIVE_STAGES.map((stage) => (
          <DroppableColumn
            key={stage.id}
            stage={stage}
            deals={deals.filter((d) => d.stageId === stage.id)}
            selectedDealId={selectedDealId}
            onSelectDeal={onSelectDeal}
          />
        ))}
      </div>

      <DragOverlay>
        {activeDeal ? (
          <DraggableCard
            deal={activeDeal}
            isSelected={activeDeal.id === selectedDealId}
            onSelectDeal={() => {}}
            isDragOverlay
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
