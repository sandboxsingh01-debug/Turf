import { Inbox } from 'lucide-react'

import { cn } from '@/lib/utils'

interface EmptyStateProps {
  title: string
  description?: string
  icon?: React.ElementType
  action?: React.ReactNode
  className?: string
}

function EmptyState({ title, description, icon: Icon = Inbox, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 border-[2px] border-dashed border-border bg-card/50 px-6 py-16 text-center',
        className,
      )}
    >
      <div className="flex size-12 items-center justify-center border-[2px] border-border bg-card-secondary">
        <Icon className="size-5 text-muted-foreground" />
      </div>
      <div className="space-y-1">
        <p className="font-heading text-base font-bold uppercase tracking-wide text-foreground">{title}</p>
        {description && <p className="max-w-sm text-sm text-muted-foreground">{description}</p>}
      </div>
      {action}
    </div>
  )
}

export { EmptyState }
