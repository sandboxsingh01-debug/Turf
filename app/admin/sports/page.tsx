import { Trophy } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/ui/state'
import { createClient } from '@/lib/supabase/server'

export default async function AdminSportsPage() {
  const supabase = await createClient()
  const { data: sports } = await supabase
    .from('sports')
    .select('id, name, tagline, description, surface, max_players, active')
    .order('sort_order', { ascending: true })

  return (
    <div className="flex flex-col gap-8">
      <div>
        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-primary">Admin</span>
        <h1 className="mt-2 font-heading text-3xl font-black uppercase tracking-tight text-foreground">Sports</h1>
        <p className="mt-2 text-sm text-muted-foreground">Live sports configuration used by the booking flow.</p>
      </div>

      {!sports?.length ? (
        <EmptyState icon={Trophy} title="No sports configured" description="Add a sport to make it available for bookings." />
      ) : (
        <div className="grid gap-[2px] bg-border sm:grid-cols-2">
          {sports.map((sport) => (
            <div key={sport.id} className="flex flex-col bg-card p-6">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Trophy className="size-4 text-primary" />
                  <p className="font-heading text-base font-bold uppercase tracking-wide text-foreground">{sport.name}</p>
                </div>
                <Badge variant={sport.active ? 'success' : 'neutral'}>{sport.active ? 'Active' : 'Inactive'}</Badge>
              </div>
              <div className="mt-4">
                <p className="text-sm font-bold text-foreground">{sport.tagline}</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{sport.description}</p>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <span className="border-[2px] border-border bg-card-secondary px-3 py-1.5">{sport.surface}</span>
                <span className="border-[2px] border-border bg-card-secondary px-3 py-1.5">{sport.max_players}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
