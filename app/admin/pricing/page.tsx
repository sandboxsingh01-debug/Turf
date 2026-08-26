import { createClient } from '@/lib/supabase/server'
import { EmptyState } from '@/components/ui/state'
import { Tag } from 'lucide-react'
import { PricingWindowRow } from './pricing-window-row'

export default async function AdminPricingPage() {
  const supabase = await createClient()
  const { data: windows } = await supabase
    .from('pricing_windows')
    .select('id, label, range_label, hourly_rate')
    .order('sort_order', { ascending: true })

  return (
    <div className="flex flex-col gap-8">
      <div>
        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-primary">Admin</span>
        <h1 className="mt-2 font-heading text-3xl font-black uppercase tracking-tight text-foreground">Pricing</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Edit hourly rates. Changes apply immediately to new bookings across the site.
        </p>
      </div>

      {!windows || windows.length === 0 ? (
        <EmptyState icon={Tag} title="No pricing windows" description="Pricing windows will appear here once configured." />
      ) : (
        <div className="grid gap-[2px] bg-border sm:grid-cols-2">
          {windows.map((window) => (
            <PricingWindowRow
              key={window.id}
              id={window.id}
              label={window.label}
              rangeLabel={window.range_label}
              hourlyRate={window.hourly_rate}
            />
          ))}
        </div>
      )}
    </div>
  )
}
