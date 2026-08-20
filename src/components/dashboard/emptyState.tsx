import Link from "next/link";
import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  onAction,
  actionLabel,
}: EmptyStateProps) {
  const handleClick = () => {
    if (action?.onClick) {
      action.onClick();
    } else if (onAction) {
      onAction();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 dark:border-slate-800 py-16 px-6 text-center">
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
        <Icon className="w-5 h-5 text-slate-400" />
      </div>
      <h3 className="text-sm font-semibold text-foreground mb-1">{title}</h3>
      {description && (
        <p className="text-xs text-muted-foreground mb-4 max-w-[220px]">
          {description}
        </p>
      )}
      {(action?.href || action?.onClick || onAction) && (
        <Button
          asChild={!!action?.href}
          size="sm"
          className="mt-3"
          onClick={!action?.href ? handleClick : undefined}
        >
          {action?.href ? (
            <Link href={action.href}>{action.label || actionLabel}</Link>
          ) : (
            (action?.label || actionLabel || "Action")
          )}
        </Button>
      )}
    </div>
  );
}