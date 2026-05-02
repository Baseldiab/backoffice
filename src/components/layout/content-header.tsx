import React from 'react';

interface ContentHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export function ContentHeader({ title, description, actions }: ContentHeaderProps) {
  return (
    <div className="flex items-start justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
}
