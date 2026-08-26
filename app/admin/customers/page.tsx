import { Users } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/ui/state'
import { createClient } from '@/lib/supabase/server'

export default async function AdminCustomersPage() {
  const supabase = await createClient()

  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, full_name, phone, is_admin, created_at')
    .order('created_at', { ascending: false })

  const { data: bookings } = await supabase.from('bookings').select('user_id, total_amount, status')

  const statsByUser = new Map<string, { count: number; spend: number }>()
  for (const booking of bookings ?? []) {
    const entry = statsByUser.get(booking.user_id) ?? { count: 0, spend: 0 }
    entry.count += 1
    if (booking.status !== 'cancelled') {
      entry.spend += booking.total_amount ?? 0
    }
    statsByUser.set(booking.user_id, entry)
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-primary">Admin</span>
        <h1 className="mt-2 font-heading text-3xl font-black uppercase tracking-tight text-foreground">Customers</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          A directory of every customer who has registered an account.
        </p>
      </div>

      {!profiles || profiles.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No customers yet"
          description="Customer profiles will appear here once people start registering accounts."
        />
      ) : (
        <div className="border-[2px] border-border bg-card">
          <div className="flex flex-col">
            {profiles.map((profile) => {
              const stats = statsByUser.get(profile.id) ?? { count: 0, spend: 0 }
              return (
                <div
                  key={profile.id}
                  className="flex flex-col gap-2 border-b-[2px] border-border px-6 py-4 last:border-0 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-heading text-sm font-bold uppercase tracking-wide text-foreground">
                        {profile.full_name ?? 'Unnamed customer'}
                      </p>
                      {profile.is_admin ? <Badge variant="default">Admin</Badge> : null}
                    </div>
                    <p className="text-xs text-muted-foreground">{profile.phone ?? 'No phone on file'}</p>
                  </div>
                  <div className="flex items-center gap-6 text-right">
                    <div>
                      <p className="font-heading text-sm font-black text-foreground">{stats.count}</p>
                      <p className="text-[10px] font-black uppercase tracking-wider text-subtle-foreground">Bookings</p>
                    </div>
                    <div>
                      <p className="font-heading text-sm font-black text-foreground">
                        ₹{stats.spend.toLocaleString('en-IN')}
                      </p>
                      <p className="text-[10px] font-black uppercase tracking-wider text-subtle-foreground">Total spend</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
